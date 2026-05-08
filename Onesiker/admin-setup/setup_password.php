<?php
header('Content-Type: text/html; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    if (strlen($password) < 6) {
        $error = "Le mot de passe doit faire au moins 6 caractères.";
    } else {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $configContent = "<?php\n\n// Fichier généré automatiquement\ndefine('ADMIN_PASSWORD_HASH', '" . addslashes($hash) . "');\n";
        
        if (file_put_contents(__DIR__ . '/config.php', $configContent) !== false) {
            $success = "Mot de passe configuré avec succès ! Vous pouvez maintenant vous connecter au Back Office.";
            // Optionnel: on pourrait supprimer ce fichier après utilisation par sécurité
        } else {
            $error = "Erreur : Impossible d'écrire le fichier config.php. Vérifiez les permissions de votre serveur FTP.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configuration du mot de passe</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f9fafb; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
        h1 { font-size: 1.5rem; margin-top: 0; }
        input[type="password"] { width: 100%; padding: 10px; margin-bottom: 1rem; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box; }
        button { width: 100%; padding: 10px; background: black; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        button:hover { background: #333; }
        .error { color: red; margin-bottom: 1rem; font-size: 0.9rem; }
        .success { color: green; margin-bottom: 1rem; font-size: 0.9rem; font-weight: bold; }
        a { color: blue; text-decoration: none; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Initialisation du mot de passe</h1>
        
        <?php if (!empty($error)): ?>
            <div class="error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>
        
        <?php if (!empty($success)): ?>
            <div class="success"><?= htmlspecialchars($success) ?></div>
            <p><a href="index.html">Retour à la connexion</a></p>
        <?php else: ?>
            <p style="font-size: 0.9rem; color: #6b7280; margin-bottom: 1.5rem;">Veuillez définir le mot de passe pour accéder à votre espace d'administration Onesiker.</p>
            <form method="POST">
                <input type="password" name="password" placeholder="Nouveau mot de passe" required>
                <button type="submit">Enregistrer le mot de passe</button>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>
