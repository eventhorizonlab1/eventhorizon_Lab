# Procédure de déploiement (Back-Office + Frontend)

## Contexte

Le client édite le contenu via le **back-office PHP** hébergé dans `dist/admin/` sur OVH. Ses modifications (textes + images uploadées) sont écrites dans `dist/data/` sur le FTP. Si l'on rebuild localement et qu'on uploade `dist/` en écrasant tout, **les éditions du client sont perdues**.

## Flow recommandé (automatisé)

Le script `scripts/sync-prod-data.mjs` télécharge automatiquement les JSON de prod vers `public/data/` **avant** chaque `vite build` (hook `prebuild`). Il suffit donc, au quotidien :

```bash
# 1. Configurer une seule fois les credentials FTP dans .env (voir .env.example)
cp .env.example .env
# (renseigner FTP_USER / FTP_PASSWORD)

# 2. Builder normalement — le sync FTP s'exécute automatiquement avant
npm run build

# 3. Uploader dist/ sur OVH (ou seulement les fichiers de code modifiés)
```

Variables disponibles (voir [`.env.example`](.env.example)) :

- `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_SECURE` — accès FTP/FTPS.
- `FTP_REMOTE_DATA_DIR` — chemin distant des JSON (défaut `www/data`, à ajuster selon la racine OVH).
- `SYNC_PROD_DATA_STRICT=true` — fait échouer le build si le sync échoue (recommandé en CI).
- `SYNC_PROD_DATA_SKIP=true` — désactive complètement le sync (dev offline).

Sans credentials, le script log un warning et le build continue avec `public/data/` local — utile en dev mais **dangereux pour un déploiement prod**.

## Flow manuel (fallback historique)

Si vous ne voulez pas configurer le FTP dans `.env`, vous pouvez :

### Méthode A — Récupérer les data avant build

1. Télécharger `dist/data/` depuis le FTP OVH.
2. Écraser `public/data/` local avec ce contenu.
3. `SYNC_PROD_DATA_SKIP=true npm run build`.
4. Uploader `dist/` sur le FTP.

### Méthode B — Uploader sans toucher aux data

Lors de l'upload sur OVH, **exclure le dossier `dist/data/`**. Le serveur conserve les édits du client.

## Mots de passe et accès admin

Le mot de passe administrateur est stocké **bcrypté** dans `public/admin/config.php` (variable `ADMIN_PASSWORD_HASH`). Ce fichier est ignoré par `.htaccess` (accès web bloqué).

Pour générer / modifier le hash :

```php
<?php echo password_hash('votreNouveauMotDePasse', PASSWORD_BCRYPT);
```

Puis remplacer la valeur de `ADMIN_PASSWORD_HASH` dans `config.php`.

> **Note** : la version précédente de cette doc indiquait que le mot de passe était stocké en clair "ligne 4 de api.php". C'est faux — il a toujours été dans `config.php` (séparé) et bcrypté. Cette doc a été mise à jour.

## Sécurités en place côté admin

- Rate-limit IP (5 tentatives, blocage 15 min) → `rate_limits.json`
- Token CSRF sur chaque mutation
- Headers stricts (CSP, HSTS, X-Frame-Options, etc.) via `.htaccess`
- Sessions HttpOnly + SameSite=Lax + secure (si HTTPS)
- Sanitisation HTML stricte sur les contenus utilisateur (whitelist tags)
