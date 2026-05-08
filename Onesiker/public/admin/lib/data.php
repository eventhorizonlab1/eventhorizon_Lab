<?php
/**
 * Auth-required endpoints: get_data + save_data.
 *
 * save_data validates per-type structure and runs sanitizeHtml on every rich-text
 * field BEFORE persisting. The whitelist of types lives in ALLOWED_DATA_TYPES
 * (defined in bootstrap.php). To add a new type, extend that constant AND add a
 * branch in validateAndSanitize() below.
 */

function handleGetData(): void {
    $type = $_GET['type'] ?? '';
    if (!in_array($type, ALLOWED_DATA_TYPES, true)) {
        jsonResponse(['error' => 'Type de donnees invalide'], 400);
    }

    $file = getDataDir() . '/' . $type . '.json';
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Cache-Control: post-check=0, pre-check=0', false);
    header('Pragma: no-cache');
    header('Content-Type: application/json; charset=utf-8');
    $contents = readWithLock($file);
    echo $contents !== '' ? $contents : '[]';
    exit;
}

function handleSaveData(): void {
    verifyCsrfToken();

    $type = $_POST['type'] ?? '';
    if (!in_array($type, ALLOWED_DATA_TYPES, true)) {
        jsonResponse(['error' => 'Type de donnees invalide'], 400);
    }

    $rawData = $_POST['data'] ?? '';
    $decoded = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        jsonResponse(['error' => 'JSON invalide : ' . json_last_error_msg()], 400);
    }

    $validation = validateAndSanitize($type, $decoded);
    if ($validation !== true) {
        jsonResponse(['error' => 'Validation des donnees echouee : ' . $validation], 400);
    }

    $file = getDataDir() . '/' . $type . '.json';
    if (!writeWithLock($file, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        jsonResponse(['error' => "Erreur d'ecriture du fichier. Verifiez les permissions."], 500);
    }

    jsonResponse(['success' => true]);
}

/**
 * Validates the decoded payload against the per-type schema and runs the HTML
 * sanitizer over every rich-text field. Mutates $decoded by reference.
 *
 * Returns true on success, or a string describing the validation failure.
 *
 * @return true|string
 */
function validateAndSanitize(string $type, &$decoded) {
    if ($type === 'hero' || $type === 'boutique') {
        if (!is_array($decoded)) return 'Doit etre un tableau.';
    } elseif ($type === 'news') {
        if (!is_array($decoded)) return 'Doit etre un tableau.';
        foreach ($decoded as &$item) {
            if (isset($item['excerpt_fr'])) $item['excerpt_fr'] = sanitizeHtml($item['excerpt_fr']);
            if (isset($item['excerpt_en'])) $item['excerpt_en'] = sanitizeHtml($item['excerpt_en']);
        }
    } elseif ($type === 'artworks') {
        if (!is_array($decoded)) return 'Doit etre un tableau.';
        foreach ($decoded as &$cat) {
            if (!is_array($cat) || !isset($cat['id'])) {
                return 'Chaque categorie doit avoir un ID.';
            }
            if (isset($cat['images']) && is_array($cat['images'])) {
                foreach ($cat['images'] as &$img) {
                    if (isset($img['title'])) $img['title'] = sanitizeHtml($img['title']);
                }
            }
        }
    } elseif ($type === 'bio') {
        if (!is_array($decoded)) return 'Doit etre un objet.';
        if (!isset($decoded['fr'], $decoded['en'])) return 'Traductions manquantes.';
    } elseif ($type === 'contact') {
        if (!is_array($decoded)) return 'Doit etre un objet.';
        if (!isset($decoded['fr'], $decoded['en'])) return 'Traductions manquantes.';
        if (isset($decoded['galleries']) && is_array($decoded['galleries'])) {
            foreach ($decoded['galleries'] as &$gal) {
                if (isset($gal['details_fr'])) $gal['details_fr'] = sanitizeHtml($gal['details_fr']);
                if (isset($gal['details_en'])) $gal['details_en'] = sanitizeHtml($gal['details_en']);
            }
        }
    } elseif ($type === 'atelier_meta') {
        if (!is_array($decoded)) return 'Doit etre un objet.';
    } elseif ($type === 'layout') {
        if (!is_array($decoded) || !isset($decoded['sections'])) {
            return "Doit etre un objet avec 'sections'.";
        }
    } elseif ($type === 'custom_pages') {
        if (!is_array($decoded)) return 'Doit etre un objet ou tableau.';
    } elseif ($type === 'legal') {
        if (!is_array($decoded)) return 'Doit etre un objet.';
        if (!isset($decoded['fr'], $decoded['en'])) return 'Traductions FR/EN manquantes.';
    }
    return true;
}
