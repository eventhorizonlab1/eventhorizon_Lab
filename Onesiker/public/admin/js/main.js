// ============================================================================
// MAIN — Point d'entrée & Délégation d'Événements
// ============================================================================

// Gestionnaire d'erreurs global — utilise UI.showToast si disponible, sinon console
window.onerror = function(msg, url, lineNo, columnNo, error) {
    const info = `${msg} (${url.split('/').pop()}:${lineNo})`;
    console.error("ERREUR JS:", info, error);
    if (window.UI) UI.showToast("Erreur JS : " + msg, true);
    return false;
};

// ── Formulaire de connexion ─────────────────────────────────────────────────
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = APIModule.SPINNER_SVG + ' Connexion…';

    const fd = new FormData();
    fd.append('action', 'login');
    fd.append('password', document.getElementById('password').value);
    
    try {
        const res = await fetch('api.php', { method: 'POST', body: fd });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success) {
            if (data.csrf_token) csrfToken = data.csrf_token;
            document.getElementById('login-container').classList.add('hidden');
            document.getElementById('app-container').classList.remove('hidden');
            document.getElementById('bottom-nav').classList.remove('nav-hidden');
            await APIModule.loadAllData();
        } else {
            const err = document.getElementById('login-error');
            err.innerText = data.error || 'Erreur de connexion.';
            err.classList.remove('hidden');
            btn.disabled = false;
            btn.innerText = 'Connexion';
        }
    } catch(e) {
        const err = document.getElementById('login-error');
        err.innerText = 'Erreur réseau.';
        err.classList.remove('hidden');
        btn.disabled = false;
        btn.innerText = 'Connexion';
    }
});

// Initialisation
APIModule.checkAuth();


// ══════════════════════════════════════════════════════════════════════════════
// DÉLÉGATION GLOBALE — CLICK
// ══════════════════════════════════════════════════════════════════════════════
document.addEventListener('click', async (e) => {
    // 1. Onglets
    const tabBtn = e.target.closest('[data-tab]');
    if (tabBtn) {
        UI.switchTab(tabBtn.dataset.tab);
        return;
    }
    
    // 2. Actions (data-action)
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn) {
        const action = actionBtn.dataset.action;
        const type   = actionBtn.dataset.type;
        const index  = parseInt(actionBtn.dataset.index);

        // ── Sauvegarde ──
        if (action === 'save') {
            if (type === 'layout') LayoutModule.saveLayout();
            else APIModule.saveData(type);
        }
        
        // ── News ──
        else if (action === 'add-news') NewsModule.add();
        else if (action === 'edit-news') NewsModule.edit(index);
        else if (action === 'delete-news') await NewsModule.delete(index);
        else if (action === 'move-news') NewsModule.move(index, parseInt(actionBtn.dataset.dir));
        else if (action === 'toggle-news-visibility') NewsModule.toggleVisibility(index, actionBtn.closest('[data-action]').querySelector('input[type="checkbox"]')?.checked ?? true);
        else if (action === 'translate-news-all') NewsModule.translateAll();
        else if (action === 'translate-news-field') NewsModule.translateField(actionBtn.dataset.field);
        
        // ── Artworks ──
        else if (action === 'add-category') ArtworksModule.addCategory();
        else if (action === 'move-category') ArtworksModule.moveCategory(index, parseInt(actionBtn.dataset.dir));
        else if (action === 'rename-category') ArtworksModule.renameCategory(index);
        else if (action === 'delete-category') ArtworksModule.deleteCategory(index);
        else if (action === 'add-artwork-image') ArtworksModule.addImage(index);
        else if (action === 'rename-artwork') ArtworksModule.renameImage(parseInt(actionBtn.dataset.catIndex), index);
        else if (action === 'delete-artwork') ArtworksModule.deleteImage(parseInt(actionBtn.dataset.catIndex), index);
        else if (action === 'move-artwork') ArtworksModule.moveImage(parseInt(actionBtn.dataset.catIndex), index, parseInt(actionBtn.dataset.dir));
        
        // ── Pages (Hero, Boutique, Bio, Contact) ──
        else if (action === 'move-general-image') PagesModule.moveGeneralImage(type, index, parseInt(actionBtn.dataset.dir));
        else if (action === 'delete-general-image') PagesModule.deleteGeneralImage(type, index);
        else if (action === 'translate') {
            if (type === 'bio') PagesModule.autoTranslateBio();
            else if (type === 'contact') PagesModule.autoTranslateContact();
        }
        else if (action === 'add-gallery') PagesModule.addGallery();
        else if (action === 'add-contact-url') PagesModule.addContactUrl();
        else if (action === 'edit-gallery') PagesModule.editGallery(index);
        else if (action === 'delete-gallery') PagesModule.deleteGallery(index);
        else if (action === 'edit-contact-url') PagesModule.editContactUrl(index);
        else if (action === 'delete-contact-url') PagesModule.deleteContactUrl(index);

        // ── Media ──
        else if (action === 'delete-media') MediaModule.deleteFile(actionBtn.dataset.filename);
        else if (action === 'purge-orphans') MediaModule.purgeOrphans(JSON.parse(actionBtn.dataset.orphanFiles || '[]'));
        else if (action === 'load-media') MediaModule.loadList();
        
        // ── Divers ──
        else if (action === 'logout') APIModule.logout();
        else if (action === 'close-modal') UI.closeModal();
        else if (action === 'delete-pdf') ArtworksModule.deletePdf();
        else if (action === 'add-custom-page') LayoutModule.addCustomPage();
        else if (action === 'edit-custom-page') LayoutModule.editCustomPage(actionBtn.dataset.id);
        else if (action === 'delete-custom-page') LayoutModule.deleteCustomPage(actionBtn.dataset.id);
        else if (action === 'remove-custom-image') LayoutModule.removeCustomImage(index);

        // ── News (modal images) ──
        else if (action === 'trigger-news-upload') NewsModule.triggerUpload();
        else if (action === 'move-news-image') NewsModule.moveImage(index, parseInt(actionBtn.dataset.dir));
        else if (action === 'remove-news-image') NewsModule.removeImage(index);

        // ── Pages (modal-level) ──
        else if (action === 'translate-gallery-modal') PagesModule.autoTranslateGalleryModal();

        return;
    }
    
    // Modal background click
    if (e.target.id === 'modal') UI.closeModal();
});

// ══════════════════════════════════════════════════════════════════════════════
// DÉLÉGATION GLOBALE — CHANGE (unified — un seul listener)
// ══════════════════════════════════════════════════════════════════════════════
document.addEventListener('change', async (e) => {
    // 1. Uploads via data-upload-type
    const uploadInput = e.target.closest('[data-upload-type]');
    if (uploadInput) {
        const type = uploadInput.dataset.uploadType;
        
        if (type === 'pdf') {
            ArtworksModule.uploadPdf(uploadInput);
        } else if (type === 'artwork_item_image') {
            // Géré directement par ArtworksModule.addImage
        } else if (type === 'news_item_image') {
            NewsModule.uploadImage(uploadInput);
        } else if (type === 'custom_page') {
            LayoutModule.handleCustomUpload(uploadInput);
        } else if (type === 'artwork_local_upload') {
            ArtworksModule.handleLocalUpload(uploadInput);
        } else {
            // hero, boutique, bio_images
            PagesModule.uploadGenericImage(uploadInput, type);
        }
        return;
    }

    // 2. Visibilité des Œuvres (checkbox)
    const artToggle = e.target.closest('[data-action="toggle-artwork-visibility"]');
    if (artToggle) {
        const catIdx = parseInt(artToggle.dataset.catIndex);
        const imgIdx = parseInt(artToggle.dataset.imgIndex);
        ArtworksModule.toggleImageVisibility(catIdx, imgIdx, artToggle.checked);
        return;
    }

    // 3. Visibilité News (checkbox via data-action)
    const newsToggle = e.target.closest('[data-action="toggle-news-cb"]');
    if (newsToggle) {
        const idx = parseInt(newsToggle.dataset.index);
        NewsModule.toggleVisibility(idx, newsToggle.checked);
        return;
    }

    // 4. Visibilité Hero/Boutique (checkbox via data-action)
    const heroBoutiqueToggle = e.target.closest('[data-action="toggle-general-image-visibility"]');
    if (heroBoutiqueToggle) {
        const type = heroBoutiqueToggle.dataset.type;
        const idx = parseInt(heroBoutiqueToggle.dataset.index);
        PagesModule.toggleGeneralVisibility(type, idx, heroBoutiqueToggle.checked);
        return;
    }

    // 5. Layout visibility checkbox
    if (e.target.matches('.layout-visible-cb')) {
        isDirty = true;
        return;
    }
});

// ══════════════════════════════════════════════════════════════════════════════
// DÉLÉGATION GLOBALE — INPUT
// ══════════════════════════════════════════════════════════════════════════════
document.addEventListener('input', (e) => {
    // Layout title inputs
    if (e.target.matches('.layout-title-fr, .layout-title-en')) {
        isDirty = true;
        return;
    }
    // Custom image title in layout modal
    if (e.target.matches('.custom-img-title')) {
        const idx = parseInt(e.target.dataset.imgIndex);
        if (window.currentCustomImages && window.currentCustomImages[idx]) {
            window.currentCustomImages[idx].title = e.target.value;
        }
        return;
    }
    // Alt FR / Alt EN inputs (hero, boutique)
    const altInput = e.target.closest('[data-action="alt-input"]');
    if (altInput) {
        const type = altInput.dataset.type;
        const idx = parseInt(altInput.dataset.index);
        const field = altInput.dataset.field;
        const arr = currentData[type];
        if (Array.isArray(arr) && arr[idx] && (field === 'alt_fr' || field === 'alt_en')) {
            if (typeof arr[idx] === 'string') arr[idx] = { src: arr[idx], alt_fr: '', alt_en: '' };
            arr[idx][field] = altInput.value;
            isDirty = true;
        }
        return;
    }
});

// ══════════════════════════════════════════════════════════════════════════════
// NAVIGATION — Dirty State Guard
// ══════════════════════════════════════════════════════════════════════════════
window.addEventListener('beforeunload', (e) => {
    if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
    }
});
