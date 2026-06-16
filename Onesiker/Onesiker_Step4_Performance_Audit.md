# Audit Performance & Hardening (Étape 4)

### Résumé de l'Audit

Cette dernière étape de l'audit s'est concentrée sur les deux aspects critiques finaux de la plateforme : les performances d'optimisation (images et build scripts) et le renforcement des mécanismes de sécurité existants (CSRF).

### 1. Optimisation Automatique des Images (Pipeline Upload)
- **Problème Identifié** : Les images uploadées depuis le back-office passaient uniquement par la bibliothèque PHP `GD` (`imagewebp()`). Bien que fonctionnelle, cette bibliothèque est connue pour sa lenteur et sa consommation mémoire excessive sur de gros fichiers (parfois causant des échecs silencieux).
- **Solution Apportée** : Implémentation d'une approche hybride Node.js (Sharp) / PHP :
  - Création du script `scripts/optimize-single.cjs` utilisant **Sharp** (une librairie Node.js réputée pour ses excellentes performances de traitement d'images via libvips).
  - Modification de `public/admin/lib/media.php` pour tenter en priorité d'exécuter Sharp via `exec('node ...')`. Sharp compresse l'image en WebP beaucoup plus rapidement et avec une meilleure qualité.
  - Mise en place du "Fallback" (Solution de secours) : Si Node n'est pas disponible (hébergement mutualisé standard OVH), le script détecte l'échec et repasse automatiquement sur l'ancienne méthode avec la librairie `GD` native de PHP.
- **Résultat** : Un pipeline d'upload blindé et optimisé qui tire parti du meilleur outil disponible selon l'environnement de déploiement.

### 2. Minification des Assets du Back-Office (Build Scripts)
- **Problème Identifié** : Le projet utilise Vite/React pour le front-office. Cependant, le Back-Office PHP (`public/admin/`) contient des fichiers CSS/JS non compilés. Lors du `vite build`, ces fichiers étaient simplement copiés dans `dist/admin/` de façon "brute", pénalisant le chargement du back-office en production.
- **Solution Apportée** : Intégration d'un plugin Vite personnalisé (`minifyAdminAssetsPlugin`) directement dans `vite.config.ts`.
  - Lors de l'étape finale du bundle (`closeBundle`), ce plugin scrute le dossier généré `dist/admin/`.
  - Il détecte les fichiers `.js` et `.css` et fait appel au moteur interne `esbuild` de Vite pour les minifier à la volée.
- **Résultat** : Une réduction significative de la taille des fichiers CSS/JS du back-office déployés en production (gain de temps de chargement sur réseau lent/mobile) et une intégration parfaite au pipeline `npm run build` existant sans nécessiter d'outils externes additionnels.

### 3. Hardening Infrastructure & Vérification CSRF
- **Problème Identifié** : Revue du fichier `api.php` et `APIModule` côté JS. Bien que les tokens soient envoyés de manière adéquate, deux failles de logique ont été repérées côté backend où le `verifyCsrfToken()` était manquant.
- **Solutions Apportées** :
  - **Traduction (`translate.php`)** : La fonction `handleTranslate()` exécutait une requête POST externe et mutait le cache local/consommait les quotas sans vérifier le jeton CSRF. La vérification a été forcée.
  - **Déconnexion (`auth.php`)** : La fonction `handleLogout()` tuait la session sans vérifier le token. Elle est désormais protégée pour prévenir le "Logout CSRF" (un attaquant forçant silencieusement la déconnexion de l'administrateur).
- **Résultat** : Une étanchéité complète des requêtes POST du back-office. Aucun appel modifiant un état (interne ou externe) ne peut être exécuté sans jeton d'authentification cryptographique valide.

### Conclusion de l'Étape 4 (et de l'audit)
L'ensemble de l'écosystème Onesiker Back-Office a été remis à niveau. L'UI est sombre, premium et responsive ; le glisser-déposer est robuste sur toutes les plateformes ; le système est hautement optimisé et la sécurité (CSRF) a été totalement finalisée. Le back-office est désormais paré pour la production de manière pérenne.
