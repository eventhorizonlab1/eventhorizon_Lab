<?php
/**
 * ============================================================
 *  ONESIKER BACK OFFICE - API SECURISEE
 * ============================================================
 *  Securites implementees :
 *  - Mot de passe hache bcrypt (dans config.php)
 *  - Rate limiting : 5 tentatives max, blocage 15 min
 *  - Token CSRF sur toutes les requetes de mutation
 *  - En-tetes de securite HTTP
 *  - Validation stricte des types de donnees
 *  - Sanitisation des noms de fichiers uploades
 *
 *  Routeur minimal — les handlers vivent dans lib/{auth,data,media,translate}.php.
 *  Le bootstrap (session, headers, config, helpers) est dans lib/bootstrap.php.
 * ============================================================
 */

require_once __DIR__ . '/lib/bootstrap.php';
require_once __DIR__ . '/lib/auth.php';
require_once __DIR__ . '/lib/data.php';
require_once __DIR__ . '/lib/media.php';
require_once __DIR__ . '/lib/translate.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';

// -- Public endpoints (no auth) -----------------------------------------------
switch ($action) {
    case 'login':  handleLogin();  break;
    case 'logout': handleLogout(); break;
    case 'check':  handleCheck();  break;
}

// Each handler above ends with jsonResponse() which exits. Reaching this point
// means $action was not one of the public endpoints — fall through to auth.

// -- Auth required for everything below ---------------------------------------
requireAuth();
ensureDataDirs();

switch ($action) {
    case 'get_data':     handleGetData();     break;
    case 'save_data':    handleSaveData();    break;
    case 'upload_image': handleUploadImage(); break;
    case 'upload_pdf':   handleUploadPdf();   break;
    case 'delete_media': handleDeleteMedia(); break;
    case 'list_media':   handleListMedia();   break;
    case 'translate':    handleTranslate();   break;
}

jsonResponse(['error' => 'Action inconnue'], 400);
