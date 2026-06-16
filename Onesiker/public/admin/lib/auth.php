<?php
/**
 * Public endpoints (no auth required): login, logout, check.
 */

function handleLogin(): void {
    checkRateLimit();

    $password = $_POST['password'] ?? '';
    $storedHash = defined('ADMIN_PASSWORD_HASH') ? constant('ADMIN_PASSWORD_HASH') : '';

    if (!$storedHash || !password_verify($password, (string) $storedHash)) {
        recordFailedAttempt();
        return; // recordFailedAttempt() already exits via jsonResponse
    }

    $_SESSION['auth']       = true;
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

    // Reset rate-limit counter for this IP on success.
    $ip = getClientIp();
    $file = getRateLimitsFile();
    $raw = readWithLock($file);
    if ($raw !== '') {
        $limits = json_decode($raw, true) ?: [];
        if (isset($limits[$ip])) {
            unset($limits[$ip]);
            writeWithLock($file, json_encode($limits));
        }
    }

    logSecurityEvent('Connexion reussie');

    jsonResponse([
        'success'    => true,
        'csrf_token' => $_SESSION['csrf_token'],
    ]);
}

function handleLogout(): void {
    verifyCsrfToken();
    session_destroy();
    jsonResponse(['success' => true]);
}

function handleCheck(): void {
    $auth = isset($_SESSION['auth']) && $_SESSION['auth'] === true;
    jsonResponse([
        'auth'       => $auth,
        'csrf_token' => $auth ? getCsrfToken() : null,
    ]);
}
