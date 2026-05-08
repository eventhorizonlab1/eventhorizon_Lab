<?php
/**
 * Bootstrap — runs before every request: error reporting, session, security
 * headers, config loading, dependency includes, dirs setup, auth helpers.
 *
 * Anchored to dirname(__DIR__) so it doesn't matter where the router lives,
 * as long as the lib/ directory stays inside public/admin/.
 */

require_once __DIR__ . '/response.php';
require_once __DIR__ . '/locks.php';
require_once __DIR__ . '/security.php';
require_once __DIR__ . '/sanitize.php';

const ADMIN_BASE_DIR = __DIR__;

// Errors are never sent to the response body (would leak internals to the browser),
// but they ARE logged so failures can be diagnosed. Override ADMIN_LOG_FILE in
// config.php to point outside the webroot if desired.
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', defined('ADMIN_LOG_FILE')
    ? constant('ADMIN_LOG_FILE')
    : dirname(__DIR__) . '/admin_error.log');

// Session
session_set_cookie_params([
    'lifetime' => 7200,
    'path'     => '/admin/',
    'domain'   => '',
    'secure'   => (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on'),
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

// 2-hour idle timeout
ini_set('session.gc_maxlifetime', 7200);
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > 7200) {
    session_destroy();
    session_start();
}
if (isset($_SESSION['auth'])) {
    $_SESSION['last_activity'] = time();
}

// HTTP security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
header('X-Robots-Tag: noindex, nofollow');

// Load config (bcrypt password hash + optional ADMIN_STRICT_CSRF / ADMIN_LOG_FILE)
$configFile = dirname(__DIR__) . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    error_log('Fichier de configuration config.php manquant.');
    echo json_encode(['error' => 'Erreur systeme : configuration manquante.']);
    exit;
}
require_once $configFile;

if (!defined('ADMIN_PASSWORD_HASH')) {
    http_response_code(500);
    echo json_encode(['error' => 'ADMIN_PASSWORD_HASH non defini dans config.php.']);
    exit;
}

// Allowed JSON types for get_data / save_data / delete_media reference scan / list_media reference scan.
define('ALLOWED_DATA_TYPES', ['news', 'artworks', 'hero', 'boutique', 'bio', 'contact', 'atelier_meta', 'layout', 'custom_pages', 'legal']);

function getDataDir(): string    { return dirname(__DIR__, 2) . '/data'; }
function getUploadsDir(): string { return getDataDir() . '/uploads'; }

function ensureDataDirs(): void {
    $dataDir = getDataDir();
    $uploadsDir = getUploadsDir();
    if (!file_exists($dataDir) && !mkdir($dataDir, 0755, true)) {
        error_log("mkdir failed: $dataDir");
    }
    if (!file_exists($uploadsDir) && !mkdir($uploadsDir, 0755, true)) {
        error_log("mkdir failed: $uploadsDir");
    }
    if (!chmod($dataDir, 0755))    error_log("chmod 0755 failed on $dataDir");
    if (!chmod($uploadsDir, 0755)) error_log("chmod 0755 failed on $uploadsDir");
}

function requireAuth(): void {
    if (!isset($_SESSION['auth']) || $_SESSION['auth'] !== true) {
        jsonResponse(['error' => 'Non autorise'], 401);
    }
}
