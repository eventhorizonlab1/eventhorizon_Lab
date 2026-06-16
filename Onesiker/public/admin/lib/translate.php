<?php
/**
 * Auth-required translate proxy.
 *
 * Provider selection (auto, no code change required):
 *   1. If DEEPL_API_KEY is defined in config.php → DeepL (recommended; free tier
 *      is 500K chars/month, excellent quality, https://www.deepl.com/pro-api).
 *   2. Else if GOOGLE_TRANSLATE_API_KEY is defined → Google Cloud Translate v2.
 *   3. Else → unofficial Google Translate (client=gtx) + MyMemory fallback. No
 *      key required, but rate-limited / blockable by Google without notice.
 *
 * On top of any provider:
 *   - Per-IP rate limit (30 requests / minute).
 *   - File cache keyed by sha1(text|sl|tl|provider) with 30-day TTL — repeated
 *     translations of the same string are answered locally without an API call.
 *
 * Cache files live in admin/cache/translations/ (created on demand). Add it to
 * .gitignore and a periodic cleanup if you want; the TTL prevents unbounded
 * growth in practice.
 */

const TRANSLATE_RATE_LIMIT  = 30;       // requests per window
const TRANSLATE_RATE_WINDOW = 60;       // seconds
const TRANSLATE_CACHE_TTL   = 30 * 24 * 60 * 60; // 30 days

function getTranslateCacheDir(): string {
    return dirname(__DIR__) . '/cache/translations';
}

function getTranslateRateFile(): string {
    return dirname(__DIR__) . '/translate_rate_limits.json';
}

function pickTranslateProvider(): string {
    if (defined('DEEPL_API_KEY') && constant('DEEPL_API_KEY') !== '') return 'deepl';
    if (defined('GOOGLE_TRANSLATE_API_KEY') && constant('GOOGLE_TRANSLATE_API_KEY') !== '') return 'google_cloud';
    return 'google_gtx';
}

function checkTranslateRateLimit(): void {
    $ip = getClientIp();
    $file = getTranslateRateFile();
    $now = time();

    $raw = readWithLock($file);
    $state = $raw === '' ? [] : (json_decode($raw, true) ?: []);

    $entry = $state[$ip] ?? ['count' => 0, 'window_start' => $now];
    if (($now - $entry['window_start']) >= TRANSLATE_RATE_WINDOW) {
        $entry = ['count' => 0, 'window_start' => $now];
    }
    $entry['count']++;

    if ($entry['count'] > TRANSLATE_RATE_LIMIT) {
        $retry = TRANSLATE_RATE_WINDOW - ($now - $entry['window_start']);
        header('Retry-After: ' . max(1, $retry));
        jsonResponse([
            'error' => 'Trop de traductions. Reessayez dans une minute.',
        ], 429);
    }

    $state[$ip] = $entry;
    // Best-effort cleanup: drop stale entries every ~30 calls.
    if (mt_rand(0, 29) === 0) {
        foreach ($state as $k => $v) {
            if (($now - ($v['window_start'] ?? 0)) > TRANSLATE_RATE_WINDOW * 5) {
                unset($state[$k]);
            }
        }
    }
    writeWithLock($file, json_encode($state));
}

function getTranslateCachePath(string $key): string {
    // Two-level fan-out so a single directory never holds millions of files.
    $dir = getTranslateCacheDir() . '/' . substr($key, 0, 2);
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    return $dir . '/' . $key . '.json';
}

function lookupTranslateCache(string $key): ?string {
    $path = getTranslateCachePath($key);
    if (!file_exists($path)) return null;
    if ((time() - filemtime($path)) > TRANSLATE_CACHE_TTL) {
        @unlink($path);
        return null;
    }
    $raw = readWithLock($path);
    if ($raw === '') return null;
    $decoded = json_decode($raw, true);
    return $decoded['translated'] ?? null;
}

function storeTranslateCache(string $key, string $translated, string $provider): void {
    writeWithLock(getTranslateCachePath($key), json_encode([
        'translated' => $translated,
        'provider'   => $provider,
        'cached_at'  => time(),
    ]));
}

function translateViaDeepl(string $text, string $sl, string $tl): ?string {
    $url  = 'https://api-free.deepl.com/v2/translate';
    $body = http_build_query([
        'text'        => $text,
        'source_lang' => strtoupper($sl),
        'target_lang' => strtoupper($tl),
    ]);
    $ctx = stream_context_create([
        'http' => [
            'method'  => 'POST',
            'timeout' => 10,
            'header'  => "Authorization: DeepL-Auth-Key " . constant('DEEPL_API_KEY') . "\r\n"
                       . "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $body,
        ],
    ]);
    $raw = @file_get_contents($url, false, $ctx);
    if ($raw === false) return null;
    $json = json_decode($raw, true);
    return $json['translations'][0]['text'] ?? null;
}

function translateViaGoogleCloud(string $text, string $sl, string $tl): ?string {
    $url = 'https://translation.googleapis.com/language/translate/v2'
         . '?key=' . urlencode(constant('GOOGLE_TRANSLATE_API_KEY'));
    $ctx = stream_context_create([
        'http' => [
            'method'  => 'POST',
            'timeout' => 10,
            'header'  => "Content-Type: application/json\r\n",
            'content' => json_encode([
                'q'      => $text,
                'source' => $sl,
                'target' => $tl,
                'format' => 'text',
            ]),
        ],
    ]);
    $raw = @file_get_contents($url, false, $ctx);
    if ($raw === false) return null;
    $json = json_decode($raw, true);
    return $json['data']['translations'][0]['translatedText'] ?? null;
}

function translateViaGoogleGtx(string $text, string $sl, string $tl): ?string {
    $url = 'https://translate.googleapis.com/translate_a/single?client=gtx'
         . '&sl=' . urlencode($sl)
         . '&tl=' . urlencode($tl)
         . '&dt=t'
         . '&q='  . urlencode($text);
    $ctx = stream_context_create([
        'http' => ['method' => 'GET', 'timeout' => 10, 'header' => "User-Agent: Mozilla/5.0\r\n"],
    ]);
    $raw = @file_get_contents($url, false, $ctx);
    if ($raw === false) return null;
    $json = json_decode($raw, true);
    if (!$json || !isset($json[0])) return null;
    $translated = '';
    foreach ($json[0] as $segment) {
        if (isset($segment[0])) $translated .= $segment[0];
    }
    return $translated === '' ? null : $translated;
}

function translateViaMyMemory(string $text, string $sl, string $tl): ?string {
    $url = 'https://api.mymemory.translated.net/get?q=' . urlencode($text)
         . '&langpair=' . urlencode($sl . '|' . $tl);
    $ctx = stream_context_create(['http' => ['method' => 'GET', 'timeout' => 10]]);
    $raw = @file_get_contents($url, false, $ctx);
    if ($raw === false) return null;
    $json = json_decode($raw, true);
    return $json['responseData']['translatedText'] ?? null;
}

function handleTranslate(): void {
    verifyCsrfToken();
    $text = trim($_POST['text'] ?? '');
    $sl   = preg_replace('/[^a-z\-]/', '', strtolower($_POST['sl'] ?? 'fr'));
    $tl   = preg_replace('/[^a-z\-]/', '', strtolower($_POST['tl'] ?? 'en'));

    if ($text === '')         jsonResponse(['error' => 'Texte vide'], 400);
    if (strlen($text) > 5000) jsonResponse(['error' => 'Texte trop long (max 5000 caractères)'], 400);

    $provider = pickTranslateProvider();
    $cacheKey = sha1($text . '|' . $sl . '|' . $tl . '|' . $provider);

    $cached = lookupTranslateCache($cacheKey);
    if ($cached !== null) {
        jsonResponse(['translated' => $cached, 'cached' => true]);
    }

    // Rate-limit only after the cache check — repeated translations of the same
    // string don't burn quota.
    checkTranslateRateLimit();

    $translated = match ($provider) {
        'deepl'        => translateViaDeepl($text, $sl, $tl),
        'google_cloud' => translateViaGoogleCloud($text, $sl, $tl),
        default        => translateViaGoogleGtx($text, $sl, $tl),
    };

    // Universal fallback to MyMemory if the chosen provider returned nothing.
    if ($translated === null || $translated === '') {
        $translated = translateViaMyMemory($text, $sl, $tl);
    }

    if ($translated === null || $translated === '') {
        error_log("translate: provider=$provider returned empty for '$sl' -> '$tl'");
        jsonResponse(['error' => 'Service de traduction indisponible'], 503);
    }

    storeTranslateCache($cacheKey, $translated, $provider);
    jsonResponse(['translated' => $translated, 'cached' => false]);
}
