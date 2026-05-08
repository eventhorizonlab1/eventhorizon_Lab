# Changelog - Backoffice Redesign

## UI / UX
- **Design System** : Implémentation du thème sombre global via `backoffice-design-system.css`. Surcharge des couleurs claires par la palette urbaine (`bg-primary`: #0A0A0A et `accent`: #FF3300).
- **Typographie** : Intégration de `Barlow Condensed` (Titres, Boutons, Navigation), `Inter` (Texte principal) et `JetBrains Mono` (Inputs) sans violer la CSP.
- **Composants** : Reconstruction visuelle des composants via `backoffice-components.css` (bords carrés, ombres nettes, approche "raw").
- **Interactions** : Ajout des animations fluides via `backoffice-animations.css`.
- **Dashboard** : Création d'un onglet par défaut "Dashboard" avec une vue d'ensemble des KPIs (Œuvres, Actus, Sections, Médias) et des raccourcis d'actions rapides.

## Sécurité & Intégrité
- [x] **CSP Intacte** : Aucun Header HTTP n'a été affaibli. L'ajout des Google Fonts exploite les directives `style-src` et `font-src` existantes.
- [x] **Authentification/CSRF** : La session et le token CSRF sont restés intacts (`api.js` et `globals.js` n'ont pas été altérés sur la gestion des tokens).
- [x] **XSS Prevention** : Aucun script inline n'a été ajouté. Les KPIs du Dashboard sont rendus via JS de manière sécurisée dans `ui.js`.
- [x] **Indépendance** : Aucune nouvelle librairie ou framework externe n'a été intégré. Le système utilise une approche de surcharge CSS pour ne pas risquer de casser la fonctionnalité des composants Tailwind compilés (`tailwind-v2.css`).

## Structure CSS
Le double système (Tailwind compilé + CSS manuel) est désormais maîtrisé par 3 couches de surcharges :
1. `backoffice-design-system.css` : Surcharge des variables `--clr-*` et des classes utilitaires claires Tailwind.
2. `backoffice-components.css` : Surcharge du style structurel des éléments clés (Sidebar, Topbar, Modals, etc.).
3. `backoffice-animations.css` : Isolement des micro-interactions.

---
**Note :** Assurez-vous de vérifier visuellement tous les onglets, notamment la gestion des images et le Drag & Drop, pour confirmer que le contraste des éléments est optimal dans ce nouveau thème sombre.
