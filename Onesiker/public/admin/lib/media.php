<?php
/**
 * Auth-required media endpoints: upload_image, upload_pdf, delete_media,
 * list_media. All paths are anchored to getUploadsDir() so the data directory
 * can be relocated by editing bootstrap.php once.
 */

const ADMIN_UPLOAD_ERRORS = [
    UPLOAD_ERR_INI_SIZE   => 'Fichier trop volumineux (limite serveur).',
    UPLOAD_ERR_FORM_SIZE  => 'Fichier trop volumineux.',
    UPLOAD_ERR_PARTIAL    => 'Upload interrompu.',
    UPLOAD_ERR_NO_FILE    => 'Aucun fichier reçu.',
    UPLOAD_ERR_NO_TMP_DIR => 'Dossier temporaire manquant.',
    UPLOAD_ERR_CANT_WRITE => "Impossible d'écrire sur le serveur.",
];

function handleUploadImage(): void {
    verifyCsrfToken();
    $uploadsDir = getUploadsDir();

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        $code = $_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE;
        jsonResponse(['error' => ADMIN_UPLOAD_ERRORS[$code] ?? "Erreur d'upload inconnue."], 400);
    }

    if (!file_exists($uploadsDir) && !mkdir($uploadsDir, 0755, true)) {
        jsonResponse(['error' => 'Impossible de créer le dossier uploads. Verifiez les permissions parentes.'], 500);
    }
    if (!chmod($uploadsDir, 0755)) error_log("chmod 0755 failed on $uploadsDir");

    $file = $_FILES['image'];
    if ($file['size'] > 10485760) {
        jsonResponse(['error' => "L'image depasse la taille maximale autorisee (10 Mo)."], 400);
    }

    $finfo    = new finfo(FILEINFO_MIME_TYPE);
    $mimeReal = $finfo->file($file['tmp_name']);
    $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!in_array($mimeReal, $allowedMimes)) {
        jsonResponse(['error' => "Format invalide ($mimeReal). Seuls JPG, PNG, WEBP et GIF sont acceptes."], 400);
    }

    $sectionRaw = $_POST['folder'] ?? $_POST['section'] ?? '';
    $sectionName = 'Image';
    if      (stripos($sectionRaw, 'Hero')      !== false) $sectionName = 'Hero';
    elseif  (stripos($sectionRaw, 'Boutique')  !== false) $sectionName = 'Boutique';
    elseif  (stripos($sectionRaw, 'Bio')       !== false) $sectionName = 'Bio';
    elseif  (stripos($sectionRaw, 'Atelier')   !== false) $sectionName = 'Atelier';
    elseif  (stripos($sectionRaw, 'Actualite') !== false) $sectionName = 'Actualite';

    // Pattern: Onesiker_{Section}{n}.{ext}
    $highest = 0;
    $existingFiles = is_dir($uploadsDir) ? scandir($uploadsDir) : [];
    foreach ($existingFiles as $f) {
        if (preg_match('/^Onesiker_' . preg_quote($sectionName, '/') . '(\d+)\.(webp|jpg|jpeg|png|gif)$/i', $f, $m)) {
            $val = (int) $m[1];
            if ($val > $highest) $highest = $val;
        }
    }
    $next = $highest + 1;
    $baseFilename = "Onesiker_{$sectionName}{$next}";

    $tempPath = $file['tmp_name'];
    $finalExtension = ($mimeReal === 'image/png') ? 'png'
        : (($mimeReal === 'image/webp') ? 'webp'
        : (($mimeReal === 'image/gif')  ? 'gif' : 'jpg'));

    $finalFilename  = $baseFilename . '.' . $finalExtension;
    $destination    = $uploadsDir . '/' . $finalFilename;
    $conversionDone = false;

    if ($mimeReal !== 'image/webp' && function_exists('imagewebp')) {
        // GD emits warnings on corrupt input; keep them silent here but log the
        // failure path so we can spot a broken upload pipeline.
        $img = false;
        if ($mimeReal === 'image/jpeg')      $img = @imagecreatefromjpeg($tempPath);
        elseif ($mimeReal === 'image/png')   $img = @imagecreatefrompng($tempPath);

        if ($img !== false) {
            if ($mimeReal === 'image/png') {
                imagepalettetotruecolor($img);
                imagealphablending($img, true);
                imagesavealpha($img, true);
            }
            $webpDestination = $uploadsDir . '/' . $baseFilename . '.webp';
            if (@imagewebp($img, $webpDestination, 80)) {
                $finalFilename  = $baseFilename . '.webp';
                $destination    = $webpDestination;
                $conversionDone = true;
            } else {
                error_log("imagewebp failed for $baseFilename ($mimeReal)");
            }
            unset($img); // imagedestroy is deprecated since PHP 8.5
        } else {
            error_log("GD image decode failed for $baseFilename ($mimeReal)");
        }
    }

    if (!$conversionDone) {
        $finalFilename = $baseFilename . '.' . $finalExtension;
        $destination = $uploadsDir . '/' . $finalFilename;
        if (!move_uploaded_file($tempPath, $destination)) {
            $error = error_get_last();
            jsonResponse(['error' => "Erreur lors de l'enregistrement : " . ($error['message'] ?? 'inconnue')], 500);
        }
    }

    if (!chmod($destination, 0644)) error_log("chmod 0644 failed on $destination");

    jsonResponse(['success' => true, 'url' => '/data/uploads/' . $finalFilename]);
}

function handleUploadPdf(): void {
    verifyCsrfToken();
    $uploadsDir = getUploadsDir();

    if (!isset($_FILES['pdf']) || $_FILES['pdf']['error'] !== UPLOAD_ERR_OK) {
        $code = $_FILES['pdf']['error'] ?? UPLOAD_ERR_NO_FILE;
        jsonResponse(['error' => ADMIN_UPLOAD_ERRORS[$code] ?? "Erreur d'upload inconnue."], 400);
    }

    $file = $_FILES['pdf'];
    $finfo    = new finfo(FILEINFO_MIME_TYPE);
    $mimeReal = $finfo->file($file['tmp_name']);
    if ($mimeReal !== 'application/pdf') {
        jsonResponse(['error' => 'Format invalide. Seul le format PDF est accepte.'], 400);
    }

    $highest = 0;
    $existingFiles = scandir($uploadsDir);
    if ($existingFiles !== false) {
        foreach ($existingFiles as $f) {
            if (preg_match('/^(\d+)_Onesiker_Portfolio\d+\.pdf$/i', $f, $m)) {
                if ((int) $m[1] > $highest) $highest = (int) $m[1];
            }
        }
    }
    $next = $highest + 1;
    $filename    = $next . '_Onesiker_Portfolio' . $next . '.pdf';
    $destination = $uploadsDir . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        jsonResponse(['error' => 'Erreur lors de la sauvegarde du fichier sur le serveur.'], 500);
    }

    if (!chmod($destination, 0644)) error_log("chmod 0644 failed on $destination");

    jsonResponse(['success' => true, 'url' => '/data/uploads/' . $filename]);
}

function handleDeleteMedia(): void {
    verifyCsrfToken();
    $uploadsDir = getUploadsDir();

    $filename = basename($_POST['filename'] ?? '');
    if ($filename === '' || $filename === '.' || $filename === '..') {
        jsonResponse(['error' => 'Nom de fichier invalide.'], 400);
    }

    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    if (!in_array($ext, ['webp', 'jpg', 'jpeg', 'png', 'pdf'], true)) {
        jsonResponse(['error' => 'Type de fichier non autorise.'], 400);
    }

    $targetPath  = realpath($uploadsDir . '/' . $filename);
    $uploadsReal = realpath($uploadsDir);
    if ($targetPath === false || strpos($targetPath, $uploadsReal . DIRECTORY_SEPARATOR) !== 0) {
        jsonResponse(['error' => 'Chemin de fichier invalide.'], 400);
    }

    $referenced = scanReferencedUploads();
    if (in_array($filename, $referenced, true)) {
        jsonResponse(['error' => 'Ce fichier est encore utilise dans le site. Retirez-le des contenus avant de le supprimer.'], 409);
    }

    if (!unlink($targetPath)) {
        jsonResponse(['error' => 'Impossible de supprimer le fichier. Verifiez les permissions.'], 500);
    }

    jsonResponse(['success' => true]);
}

function handleListMedia(): void {
    $uploadsDir = getUploadsDir();
    $rawFiles = is_dir($uploadsDir)
        ? array_diff(scandir($uploadsDir), ['.', '..', '.DS_Store', '.keep'])
        : [];

    $referenced = scanReferencedUploads();

    $files     = [];
    $totalSize = 0;
    $orphans   = 0;

    foreach ($rawFiles as $f) {
        $fullPath = $uploadsDir . '/' . $f;
        if (!is_file($fullPath)) continue;

        $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
        if (!in_array($ext, ['webp', 'jpg', 'jpeg', 'png', 'pdf'], true)) continue;

        $size = filesize($fullPath);
        $used = in_array($f, $referenced, true);
        $totalSize += $size;
        if (!$used) $orphans++;

        $files[] = [
            'name' => $f,
            'url'  => '/data/uploads/' . rawurlencode($f),
            'size' => $size,
            'date' => filemtime($fullPath),
            'ext'  => $ext,
            'used' => $used,
        ];
    }

    usort($files, function ($a, $b) {
        if ($a['used'] !== $b['used']) return $a['used'] ? 1 : -1;
        return $b['date'] - $a['date'];
    });

    jsonResponse([
        'files'      => $files,
        'total'      => count($files),
        'orphans'    => $orphans,
        'total_size' => $totalSize,
    ]);
}

/**
 * Scans every JSON data file for /data/uploads/<filename> references and
 * returns the deduplicated set. Used by delete_media (refuse-if-referenced)
 * and list_media (orphan detection).
 *
 * @return string[]
 */
function scanReferencedUploads(): array {
    // Decode first (raw JSON has `\/` escapes); stop capture at `?` so cache-busted URLs match scandir output.
    // Delimiter `~` not `#` — PCRE2 (PHP 8.x) silently fails to compile when the delimiter also lives in the char class.
    $referenced = [];
    $dataDir = getDataDir();
    foreach (ALLOWED_DATA_TYPES as $type) {
        $content = readWithLock($dataDir . '/' . $type . '.json');
        if ($content === '') continue;
        $decoded = json_decode($content, true);
        if ($decoded === null) continue;

        array_walk_recursive($decoded, function ($value) use (&$referenced) {
            if (is_string($value) && preg_match_all('~/data/uploads/([^"\'\s>?#]+)~', $value, $m)) {
                foreach ($m[1] as $name) $referenced[] = rawurldecode(trim($name));
            }
        });
    }
    return array_unique($referenced);
}
