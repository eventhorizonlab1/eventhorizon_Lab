<?php
header('Content-Type: application/json; charset=utf-8');

// CORS restreint au domaine de production uniquement
$allowedOrigins = ['https://onesiker.org', 'https://www.onesiker.org'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Récupérer l'email de destination depuis contact.json
$toEmail = 'contact.onesiker@gmail.com'; // fallback
$contactJsonPath = __DIR__ . '/data/contact.json';
if (file_exists($contactJsonPath)) {
    $contactData = json_decode(file_get_contents($contactJsonPath), true);
    if ($contactData && isset($contactData['email']) && !empty($contactData['email'])) {
        $toEmail = $contactData['email'];
    }
}

// Les données peuvent venir de $_POST ou d'un flux php://input (si JSON)
// Stripping newlines (header injection) + limite de longueur
$name    = mb_substr(str_replace(["\r", "\n", "\0"], '', $_POST['name'] ?? ''), 0, 200);
$email   = mb_substr(str_replace(["\r", "\n", "\0"], '', $_POST['email'] ?? ''), 0, 200);
$message = mb_substr($_POST['message'] ?? '', 0, 5000);

// Si les données sont vides, on essaie de lire du JSON (au cas où le frontend enverrait du JSON)
if (empty($name) && empty($email) && empty($message)) {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if ($data) {
        $name    = mb_substr(str_replace(["\r", "\n", "\0"], '', $data['name'] ?? ''), 0, 200);
        $email   = mb_substr(str_replace(["\r", "\n", "\0"], '', $data['email'] ?? ''), 0, 200);
        $message = mb_substr($data['message'] ?? '', 0, 5000);
    }
}

// Validation basique
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Veuillez remplir tous les champs.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Adresse email invalide.']);
    exit;
}

// Rate limiting (max 5 messages per hour per IP) — avec verrou en lecture/écriture
$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitFile = __DIR__ . '/data/contact_limits.json';

// Lecture avec verrou partagé (LOCK_SH) pour éviter les race conditions
function readRateLimits(string $path): array {
    if (!file_exists($path)) return [];
    $fp = @fopen($path, 'rb');
    if ($fp === false) return [];
    flock($fp, LOCK_SH);
    $contents = stream_get_contents($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return json_decode($contents ?: '[]', true) ?: [];
}

$limits = readRateLimits($rateLimitFile);

// Nettoyage des anciennes entrées (plus vieilles d'une heure)
$now = time();
foreach ($limits as $k => $v) {
    if ($now - ($v['time'] ?? 0) > 3600) unset($limits[$k]);
}

if (isset($limits[$ip])) {
    if ($limits[$ip]['count'] >= 5) {
        http_response_code(429);
        echo json_encode(['ok' => false, 'error' => 'Trop de requêtes. Veuillez réessayer plus tard.']);
        exit;
    }
    $limits[$ip]['count']++;
    $limits[$ip]['time'] = $now;
} else {
    $limits[$ip] = ['count' => 1, 'time' => $now];
}

file_put_contents($rateLimitFile, json_encode($limits), LOCK_EX);

// Préparer l'email
$subject = "Nouveau message de contact - Onesiker";

// On utilise l'email du serveur ou un email noreply pour éviter les problèmes SPF/DMARC
$serverName = $_SERVER['SERVER_NAME'] ?? 'onesiker.com';
$fromEmail = "noreply@" . $serverName;

$headers = [];
$headers[] = "From: Onesiker Contact Form <$fromEmail>";
$headers[] = "Reply-To: $name <$email>";
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=utf-8";

$body = "Nouveau message reçu via le formulaire de contact Onesiker.\n\n";
$body .= "Nom : $name\n";
$body .= "Email : $email\n";
$body .= "Message :\n";
$body .= "------------------------------------------------------\n";
$body .= wordwrap($message, 70, "\n") . "\n";
$body .= "------------------------------------------------------\n";

// Envoi de l'email
$success = mail($toEmail, $subject, $body, implode("\r\n", $headers));

if ($success) {
    http_response_code(200);
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Erreur lors de l\'envoi de l\'email.']);
}
