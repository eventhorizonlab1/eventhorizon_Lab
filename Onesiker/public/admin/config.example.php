<?php
/**
 * Onesiker back-office configuration
 *
 * 1. Copy this file to `config.php` (same directory).
 * 2. Replace ADMIN_PASSWORD_HASH with the hash of your real password:
 *      php -r "echo password_hash('YourPasswordHere', PASSWORD_BCRYPT) . PHP_EOL;"
 * 3. Optionally tune the constants below.
 *
 * config.php is blocked from web access by .htaccess. Do NOT remove that protection.
 */

// Bcrypt hash of the admin password. Required.
define('ADMIN_PASSWORD_HASH', '$2y$10$REPLACE_THIS_WITH_YOUR_BCRYPT_HASH');

// Strict CSRF (default true): only the per-session token is accepted on
// mutations. Set to false to also allow Origin/Referer-only requests when an
// authenticated session is active — weaker, only useful if a client legitimately
// can't include the token. Leave at true unless you know you need it.
// define('ADMIN_STRICT_CSRF', true);

// Path to the error log. Defaults to /admin/admin_error.log next to api.php.
// Move it outside the web root if you can — e.g. /home/youruser/logs/admin.log
// define('ADMIN_LOG_FILE', __DIR__ . '/../../logs/admin_error.log');

// ─── Translate provider (translate endpoint) ──────────────────────────────────
// Pick ONE of the two keys below. If both are set, DeepL wins.
// If neither is set, the back-office falls back to the unofficial Google
// Translate gtx endpoint (no key, no SLA, can be blocked at any time).
//
// DeepL Free API key (recommended). 500 000 chars/month free.
// Sign up: https://www.deepl.com/pro-api → Account → Authentication Key for DeepL API.
// define('DEEPL_API_KEY', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx');

// Google Cloud Translate v2 API key. Pay-as-you-go (~20 USD / million chars).
// Create a key in the Google Cloud Console with the "Cloud Translation API" enabled.
// define('GOOGLE_TRANSLATE_API_KEY', 'AIzaSy_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
