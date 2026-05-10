// ============================================================================
// VARIABLES GLOBALES ET ÉTAT
// ============================================================================

// ── État applicatif ─────────────────────────────────────────────────────────
let currentData = { news: [], artworks: [], hero: [], boutique: [], bio: {}, contact: {}, atelier_meta: {} };
let activeTab = localStorage.getItem('adminActiveTab') || 'dashboard';
let editingItemIndex = null;
let editingCategoryIndex = null;
let csrfToken = ''; // Token CSRF reçu du serveur à la connexion

// isDirty exposé via globalThis (pas `let`) pour intercepter chaque écriture et refléter l'état sur les boutons "Enregistrer".
let _isDirtyValue = false;
function refreshDirtyUI() {
    document.querySelectorAll('button[data-action="save"]').forEach(btn => {
        btn.classList.toggle('btn-dirty', _isDirtyValue);
    });
}
Object.defineProperty(globalThis, 'isDirty', {
    get() { return _isDirtyValue; },
    set(v) {
        const changed = _isDirtyValue !== v;
        _isDirtyValue = v;
        if (changed) refreshDirtyUI();
    },
    configurable: true,
});

// ── Cache busting par session ───────────────────────────────────────────────
// Un seul timestamp par session — les images sont correctement cachées
// entre deux rendus, mais rafraîchies à chaque rechargement de page.
const SESSION_TS = Date.now();

// Noms des catégories d'œuvres — lus dynamiquement depuis le JSON (cat.name) avec fallback
const CATEGORY_NAMES = { 1: 'Blueism', 2: 'Collabs', 3: 'Noir & Blanc', 4: 'Drips', 5: 'Throw up', 6: 'Miami Vibes', 7: 'Grands Formats' };

function getCategoryName(cat) {
    return cat.name || CATEGORY_NAMES[cat.id] || 'Catégorie ' + cat.id;
}

// Helper pour ajouter un timestamp aux URLs d'images (cache-busting)
function bustCache(url) {
    if (!url) return "";
    if (url.includes('?')) return url + '&t=' + SESSION_TS;
    return url + '?t=' + SESSION_TS;
}

// Force un nouveau cache-bust (après upload par exemple)
function bustCacheFresh(url) {
    if (!url) return "";
    if (url.includes('?')) return url + '&t=' + Date.now();
    return url + '?t=' + Date.now();
}

// Echappement HTML pour prévenir les XSS lors d'injections via innerHTML
// À utiliser sur toutes les données provenant des JSON/formulaires dans les templates HTML
function escHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Gestionnaire de promesses rejetées — log uniquement (pas d'alert bloquant)
window.onunhandledrejection = function(event) {
    const log = "PROMISE REJETÉE: " + (event.reason || 'inconnue');
    console.error(log, event.reason);
    // UI.showToast sera disponible plus tard — on reporte l'affichage après chargement
    setTimeout(() => {
        if (window.UI) UI.showToast('Erreur inattendue. Voir la console.', true);
    }, 100);
};
