<?php
/**
 * Auth-adjacent primitives:
 *  - client IP resolution
 *  - rate-limit (5 failed logins / 15 min lockout) with per-IP state in JSON
 *  - CSRF token issue + verification (strict-by-default, lenient mode behind
 *    ADMIN_STRICT_CSRF=false in config.php)
 *  - security event logging
 *
 * All file paths are anchored to the parent directory (public/admin/) via
 * dirname(__DIR__) so this module stays self-contained.
 */

function getRateLimitsFile(): string {
    return dirname(__DIR__) . '/rate_limits.json';
}

function getClientIp(): string {
    // NOTE: If your host uses a reverse proxy or CDN, uncomment the matching line.
    // Only trust headers from sources you control.
    // if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) return $_SERVER['HTTP_CF_CONNECTING_IP']; // Cloudflare
    // if (!empty($_SERVER['HTTP_X_REAL_IP']))       return $_SERVER['HTTP_X_REAL_IP'];        // OVH/nginx
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function logSecurityEvent(string $message): void {
    $ip = getClientIp();
    $date = date('Y-m-d H:i:s');
    error_log("[$date] [IP: $ip] $message" . PHP_EOL);
}

function checkRateLimit(): void {
    $ip = getClientIp();
    $file = getRateLimitsFile();
    $raw = readWithLock($file);
    $limits = $raw === '' ? [] : (json_decode($raw, true) ?: []);

    if (isset($limits[$ip])) {
        $lockedUntil = $limits[$ip]['locked_until'] ?? 0;
        if ($lockedUntil > time()) {
            $remaining = (int) ceil(($lockedUntil - time()) / 60);
            jsonResponse([
                'success' => false,
                'error'   => "Trop de tentatives. Reessayez dans {$remaining} minute(s).",
                'locked'  => true,
            ], 429);
        }

        if ($lockedUntil > 0 && $lockedUntil <= time()) {
            unset($limits[$ip]);
            writeWithLock($file, json_encode($limits));
        }
    }
}

function recordFailedAttempt(): void {
    $ip = getClientIp();
    $file = getRateLimitsFile();
    $maxAttempts  = 5;
    $lockDuration = 15 * 60;

    $raw = readWithLock($file);
    $limits = $raw === '' ? [] : (json_decode($raw, true) ?: []);

    if (!isset($limits[$ip])) {
        $limits[$ip] = ['attempts' => 0, 'locked_until' => 0];
    }

    $limits[$ip]['attempts']++;

    if ($limits[$ip]['attempts'] >= $maxAttempts) {
        $limits[$ip]['locked_until'] = time() + $lockDuration;
        writeWithLock($file, json_encode($limits));
        logSecurityEvent("IP $ip bloquee apres $maxAttempts echecs");
        jsonResponse([
            'success' => false,
            'error'   => 'Trop de tentatives depuis cette IP. Bloque pendant 15 minutes.',
            'locked'  => true,
        ], 429);
    }

    $remaining = $maxAttempts - $limits[$ip]['attempts'];
    writeWithLock($file, json_encode($limits));
    logSecurityEvent("Echec de connexion (Tentative {$limits[$ip]['attempts']})");
    jsonResponse([
        'success' => false,
        'error'   => "Mot de passe incorrect. Il vous reste {$remaining} tentative(s).",
    ], 401);
}

function getCsrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrfToken(): void {
    $token = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

    if (isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token)) {
        return;
    }

    $strict = !defined('ADMIN_STRICT_CSRF') || constant('ADMIN_STRICT_CSRF') !== false;
    if (!$strict) {
        $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https://' : 'http://';
        $expectedOrigin = $protocol . ($_SERVER['HTTP_HOST'] ?? '');
        $actualOrigin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
        if ($expectedOrigin !== 'http://' && strpos($actualOrigin, $expectedOrigin) === 0
            && isset($_SESSION['auth']) && $_SESSION['auth'] === true) {
            logSecurityEvent('CSRF lenient mode: token missing but Origin matched');
            return;
        }
    }

    logSecurityEvent('CSRF check failed');
    jsonResponse(['error' => 'Échec de la vérification de sécurité. Rechargez la page.'], 403);
}
