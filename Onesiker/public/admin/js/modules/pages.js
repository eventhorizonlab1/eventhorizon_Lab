// ============================================================================
// MODULE PAGES (PagesModule) — Gestion Hero, Boutique, Bio, Contact
// ============================================================================

window.PagesModule = (function() {

    // ── Rendu Centralisé ──────────────────────────────────────────────────────

    function render(type) {
        if (type === 'hero' || type === 'boutique') renderSimpleImages(type);
        if (type === 'bio') renderBio();
        if (type === 'contact') renderContact();
    }

    // ── Hero & Boutique ───────────────────────────────────────────────────────

    function renderSimpleImages(type) {
        const list = document.getElementById(`${type}-images-container`);
        if (!list) return;

        const arr = currentData[type] || [];

        // Backward-compat : convertit les anciennes entrées chaîne en {src, alt_fr, alt_en}
        // pour que les nouveaux champs alt soient édités à plat.
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] === 'string') {
                arr[i] = { src: arr[i], alt_fr: '', alt_en: '' };
                isDirty = true;
            }
        }

        if (arr.length === 0) {
            list.innerHTML = `<div class="py-12 text-center text-gray-500 italic text-sm">Aucune image dans cette section.</div>`;
            return;
        }

        list.innerHTML = arr.map((entry, idx) => {
            const url = entry.src || '';
            const filename = url.split('/').pop();
            const altFr = entry.alt_fr || '';
            const altEn = entry.alt_en || '';
            const visible = entry.visible !== false;
            return `
                <div class="responsive-card card border border-gray-800 rounded-xl shadow-sm hover:shadow-md hover:border-gray-700 transition-all draggable-item${visible ? '' : ' opacity-60'}" draggable="true" data-drag-type="${type}" data-index="${idx}">
                    <div class="news-card-inner items-center">
                        <!-- Desktop Drag Handle -->
                        <div class="drag-handle cursor-move text-gray-500 hover:text-white">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                        </div>

                        <div class="news-card-img rounded-lg bg-hover overflow-hidden border border-gray-800">
                            <img src="${bustCache(url)}" loading="lazy" class="w-full h-full object-cover">
                        </div>

                        <div class="news-card-content">
                            <p class="text-[10px] font-mono text-gray-500 truncate mb-2">${filename}</p>
                            <div class="grid grid-cols-1 gap-1">
                                <input type="text"
                                    class="w-full px-2 py-1 text-xs rounded border border-gray-700 bg-hover text-white outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Alt FR (description lecteur d'écran)"
                                    value="${escHtml(altFr)}"
                                    maxlength="200"
                                    data-action="alt-input" data-type="${type}" data-index="${idx}" data-field="alt_fr">
                                <input type="text"
                                    class="w-full px-2 py-1 text-xs rounded border border-gray-700 bg-hover text-white outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Alt EN (screen-reader description)"
                                    value="${escHtml(altEn)}"
                                    maxlength="200"
                                    data-action="alt-input" data-type="${type}" data-index="${idx}" data-field="alt_en">
                            </div>
                        </div>

                        <div class="news-card-actions">
                            <label class="flex items-center gap-1.5 cursor-pointer select-none">
                                <input type="checkbox" data-action="toggle-general-image-visibility" data-type="${type}" data-index="${idx}" class="w-4 h-4 text-white rounded border-gray-700 focus:ring-red-500" ${visible ? 'checked' : ''}>
                                <span class="text-[10px] font-black uppercase tracking-widest ${visible ? 'text-white' : 'text-gray-500'}">Visible</span>
                            </label>
                            <div class="news-card-buttons">
                                <button data-action="delete-general-image" data-type="${type}" data-index="${idx}" class="btn-action border border-red-500 text-red-500 hover:bg-red-500 hover:text-white" title="Supprimer"><span>Supprimer</span></button>
                            </div>
                        </div>
                    </div>
                    <!-- Mobile Navigation (Order) -->
                    <div class="news-mobile-order">
                        <button data-action="move-general-image" data-type="${type}" data-index="${idx}" data-dir="-1">↑ Monter</button>
                        <button data-action="move-general-image" data-type="${type}" data-index="${idx}" data-dir="1">↓ Descendre</button>
                    </div>
                </div>`;
        }).join('');

        UI.makeDraggable(list, (dragIdx, dropIdx) => {
            const arr = currentData[type];
            const item = arr.splice(dragIdx, 1)[0];
            arr.splice(dropIdx, 0, item);
            isDirty = true;
            renderSimpleImages(type);
        });
    }

    async function deleteGeneralImage(type, idx) {
        const confirmed = await UI.confirmAction('Supprimer cette image ?', 'Cette action est irréversible.', 'Supprimer', 'danger');
        if (!confirmed) return;
        
        isDirty = true;
        if (type === 'bio_images') {
            currentData.bio.images.splice(idx, 1);
            renderBio();
        } else {
            currentData[type].splice(idx, 1);
            renderSimpleImages(type);
        }
    }

    function moveGeneralImage(type, idx, dir) {
        let arr = type === 'bio_images' ? currentData.bio.images : currentData[type];
        if (idx + dir < 0 || idx + dir >= arr.length) return;

        isDirty = true;
        [arr[idx], arr[idx + dir]] = [arr[idx + dir], arr[idx]];

        if (type === 'bio_images') renderBio();
        else renderSimpleImages(type);
    }

    function toggleGeneralVisibility(type, idx, visible) {
        const arr = currentData[type];
        if (!Array.isArray(arr) || arr[idx] === undefined) return;
        // Promote legacy string entries to {src, alt_fr, alt_en, visible} so the new field has somewhere to live.
        if (typeof arr[idx] === 'string') {
            arr[idx] = { src: arr[idx], alt_fr: '', alt_en: '', visible };
        } else {
            arr[idx].visible = visible;
        }
        renderSimpleImages(type);
        isDirty = true;
        APIModule.saveData(type);
        UI.showToast(visible ? '✓ Image rendue visible sur le site.' : '✓ Image masquée sur le site.');
    }

    async function uploadGenericImage(input, type) {
        if (!input || !input.files || !input.files[0]) return;
        let section = 'Hero';
        let aspectRatio = null;
        let cropperTitle = null;
        if (type === 'hero')            { section = 'Hero';     aspectRatio = 16/9; cropperTitle = 'Recadrer Hero (16:9)'; }
        else if (type === 'boutique')   { section = 'Boutique'; aspectRatio = 21/9; cropperTitle = 'Recadrer Boutique (21:9)'; }
        else if (type === 'bio_images') { section = 'Bio'; /* no cropping in scope */ }

        const sourceFile = input.files[0];
        let uploadSource = input;
        let uploadOpts = {};
        if (aspectRatio) {
            let blob;
            try {
                blob = await UI.openCropper(sourceFile, { aspectRatio, title: cropperTitle });
            } catch (err) {
                if (err && err.message === 'canceled') { input.value = ''; return; }
                throw err;
            }
            uploadSource = blob;
            uploadOpts = { filename: sourceFile.name };
        }

        const url = await APIModule.handleFileUpload(uploadSource, section, uploadOpts);
        if (url) {
            if (type === 'hero' || type === 'boutique') {
                if (!currentData[type]) currentData[type] = [];
                currentData[type].unshift({ src: url, alt_fr: '', alt_en: '' });
                renderSimpleImages(type);
            } else if (type === 'bio_images') {
                if (!currentData.bio) currentData.bio = {};
                if (!currentData.bio.images) currentData.bio.images = [];
                currentData.bio.images.unshift(url);
                renderBio();
            }
            isDirty = true;
            UI.showToast('✓ Image ajoutée. N\'oubliez pas d\'enregistrer.');
        }
        input.value = '';
    }

    // ── BIO ───────────────────────────────────────────────────────────────────

    function renderBio() {
        if (!currentData.bio) currentData.bio = { fr: {}, en: {}, images: [] };
        const fr = currentData.bio.fr || {};
        const en = currentData.bio.en || {};
        
        document.getElementById('bio_title_fr').value = fr.title || '';
        document.getElementById('bio_baseline_fr').value = fr.baseline || '';
        document.getElementById('bio_subtitle_fr').value = fr.subtitle || '';
        document.getElementById('bio_paragraphs_fr').value = (fr.paragraphs || []).join('\n\n');

        document.getElementById('bio_title_en').value = en.title || '';
        document.getElementById('bio_baseline_en').value = en.baseline || '';
        document.getElementById('bio_subtitle_en').value = en.subtitle || '';
        document.getElementById('bio_paragraphs_en').value = (en.paragraphs || []).join('\n\n');

        const list = document.getElementById('bio-images-container');
        if (list) {
            list.innerHTML = '';
            const arr = currentData.bio.images || [];
            arr.forEach((url, idx) => {
                const filename = url.split('/').pop();
                list.innerHTML += `
                    <div class="responsive-card card border border-gray-800 rounded-xl shadow-sm hover:border-gray-700 transition-all draggable-item" draggable="true" data-drag-type="bio_images" data-index="${idx}">
                        <div class="news-card-inner items-center">
                            <div class="drag-handle cursor-move text-gray-500 hover:text-white">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                            </div>
                            <div class="news-card-img rounded-lg bg-hover overflow-hidden border border-gray-800">
                                <img src="${bustCache(url)}" loading="lazy" class="w-full h-full object-cover">
                            </div>
                            <div class="news-card-content">
                                <p class="text-[10px] font-mono text-gray-500 truncate" title="${url}">${filename}</p>
                            </div>
                            <div class="news-card-actions">
                                <div class="news-card-buttons">
                                    <button data-action="delete-general-image" data-type="bio_images" data-index="${idx}" class="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500 hover:text-white rounded-lg">&times;</button>
                                </div>
                            </div>
                        </div>
                        <div class="news-mobile-order">
                            <button data-action="move-general-image" data-type="bio_images" data-index="${idx}" data-dir="-1">↑ Monter</button>
                            <button data-action="move-general-image" data-type="bio_images" data-index="${idx}" data-dir="1">↓ Descendre</button>
                        </div>
                    </div>`;
            });
            UI.makeDraggable(list, (dragIdx, dropIdx) => {
                const arr = currentData.bio.images;
                const item = arr.splice(dragIdx, 1)[0];
                arr.splice(dropIdx, 0, item);
                isDirty = true;
                renderBio();
            });
        }
    }

    function syncBioFormToData() {
        currentData.bio.fr = {
            title: document.getElementById('bio_title_fr').value,
            baseline: document.getElementById('bio_baseline_fr').value,
            subtitle: document.getElementById('bio_subtitle_fr').value,
            paragraphs: document.getElementById('bio_paragraphs_fr').value.split('\n\n').filter(p => p.trim() !== '')
        };
        currentData.bio.en = {
            title: document.getElementById('bio_title_en').value,
            baseline: document.getElementById('bio_baseline_en').value,
            subtitle: document.getElementById('bio_subtitle_en').value,
            paragraphs: document.getElementById('bio_paragraphs_en').value.split('\n\n').filter(p => p.trim() !== '')
        };
    }

    async function autoTranslateBio() {
        const btn = document.querySelector('button[data-action="translate"][data-type="bio"]');
        const oldText = btn.innerHTML;
        btn.innerHTML = `<svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Traduction...`;
        
        try {
            document.getElementById('bio_title_en').value = await UI.translateText(document.getElementById('bio_title_fr').value);
            document.getElementById('bio_baseline_en').value = await UI.translateText(document.getElementById('bio_baseline_fr').value);
            document.getElementById('bio_subtitle_en').value = await UI.translateText(document.getElementById('bio_subtitle_fr').value);
            
            const frParas = document.getElementById('bio_paragraphs_fr').value.split('\n\n').filter(p => p.trim() !== '');
            const enParas = [];
            for (let p of frParas) {
                enParas.push(await UI.translateText(p));
            }
            document.getElementById('bio_paragraphs_en').value = enParas.join('\n\n');
            UI.showToast('✓ Traduction Bio terminée.');
        } catch(e) {
            UI.showToast('Erreur de traduction.', true);
        }
        btn.innerHTML = oldText;
    }

    // ── CONTACT ───────────────────────────────────────────────────────────────

    function renderContact() {
        if (!currentData.contact) currentData.contact = { fr: {}, en: {}, address: {}, galleries: [] };
        const fr = currentData.contact.fr || {};
        const en = currentData.contact.en || {};
        const addr = currentData.contact.address || {};
        
        document.getElementById('contact_email').value = currentData.contact.email || '';

        document.getElementById('contact_title_fr').value = fr.title || '';
        document.getElementById('contact_desc_fr').value = fr.desc || '';
        document.getElementById('contact_intro_fr').value = fr.formIntro || '';
        document.getElementById('contact_gal_title_fr').value = fr.galleriesTitle || '';
        
        document.getElementById('contact_addr_title').value = addr.title || '';
        document.getElementById('contact_addr_fr').value = addr.lines_fr || '';
        
        document.getElementById('contact_title_en').value = en.title || '';
        document.getElementById('contact_desc_en').value = en.desc || '';
        document.getElementById('contact_intro_en').value = en.formIntro || '';
        document.getElementById('contact_gal_title_en').value = en.galleriesTitle || '';
        document.getElementById('contact_addr_en').value = addr.lines_en || '';

        renderGalleries();
        renderContactUrls();
    }

    function syncContactFormToData() {
        currentData.contact.email = document.getElementById('contact_email').value;
        currentData.contact.fr = {
            title: document.getElementById('contact_title_fr').value,
            desc: document.getElementById('contact_desc_fr').value,
            formIntro: document.getElementById('contact_intro_fr').value,
            galleriesTitle: document.getElementById('contact_gal_title_fr').value
        };
        currentData.contact.en = {
            title: document.getElementById('contact_title_en').value,
            desc: document.getElementById('contact_desc_en').value,
            formIntro: document.getElementById('contact_intro_en').value,
            galleriesTitle: document.getElementById('contact_gal_title_en').value
        };
        currentData.contact.address = {
            title: document.getElementById('contact_addr_title').value,
            lines_fr: document.getElementById('contact_addr_fr').value,
            lines_en: document.getElementById('contact_addr_en').value
        };
    }

    async function autoTranslateContact() {
        const btn = document.querySelector('button[data-action="translate"][data-type="contact"]');
        const oldText = btn.innerHTML;
        btn.innerHTML = `<svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Traduction...`;
        try {
            document.getElementById('contact_title_en').value = await UI.translateText(document.getElementById('contact_title_fr').value);
            document.getElementById('contact_desc_en').value = await UI.translateText(document.getElementById('contact_desc_fr').value);
            document.getElementById('contact_intro_en').value = await UI.translateText(document.getElementById('contact_intro_fr').value);
            document.getElementById('contact_gal_title_en').value = await UI.translateText(document.getElementById('contact_gal_title_fr').value);
            document.getElementById('contact_addr_en').value = await UI.translateText(document.getElementById('contact_addr_fr').value);
            UI.showToast('✓ Traduction Contact terminée.');
        } catch(e) { UI.showToast('Erreur de traduction.', true); }
        btn.innerHTML = oldText;
    }

    function renderGalleries() {
        const list = document.getElementById('galleries-list');
        if (!list) return;
        list.innerHTML = '';
        const arr = currentData.contact.galleries || [];
        arr.forEach((gal, idx) => {
            list.innerHTML += `
                <div class="card border border-gray-800 p-4 rounded-xl shadow-sm flex justify-between items-center group hover:border-gray-700 transition-all">
                    <div>
                        <h4 class="font-black text-white text-sm uppercase tracking-wider">${escHtml(gal.name_fr || 'Galerie')}</h4>
                        <div class="text-[10px] text-gray-500 mt-1 line-clamp-1">${gal.details_fr || ''}</div>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="edit-gallery" data-index="${idx}" class="p-2 text-gray-500 hover:text-white hover:bg-hover rounded-lg transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button data-action="delete-gallery" data-index="${idx}" class="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </div>`;
        });
    }

    function addGallery() { editGallery(null); }

    function editGallery(index) {
        const isNew = (index === null || index === undefined);
        const item = isNew ? {} : currentData.contact.galleries[index];
        
        const html = `
                <div class="space-y-6">
                    <div class="flex justify-end">
                        <button type="button" data-action="translate-gallery-modal" class="flex items-center gap-2 px-4 py-2 bg-hover text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-hover transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
                            Traduire FR → EN
                        </button>
                    </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nom (FR)</label>
                        <input type="text" id="edit_gal_name_fr" class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none" value="${escHtml(item.name_fr || '')}" required>
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nom (EN)</label>
                        <input type="text" id="edit_gal_name_en" class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none" value="${escHtml(item.name_en || '')}">
                    </div>
                </div>

                <div class="responsive-grid-2 bg-hover p-6 rounded-xl border border-gray-800 shadow-inner">
                    <div class="flex-1">${galleryDetailFields('fr', '🇫🇷 INFOS FRANÇAIS', item.details_fr)}</div>
                    <div class="flex-1">${galleryDetailFields('en', '🇬🇧 INFOS ANGLAIS', item.details_en)}</div>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">URL externe (Optionnel)</label>
                    <input type="url" id="edit_gal_url" class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none" value="${escHtml(item.url || '')}" placeholder="https://...">
                    <p class="text-[10px] text-gray-500 mt-2 italic">Si renseigné, un lien de visite s'affichera sur le site.</p>
                </div>
            </div>`;

        UI.openModal(isNew ? "Nouvelle Galerie" : "Édition Galerie", html, (e) => {
            e.preventDefault();
            const newItem = {
                name_fr:    document.getElementById('edit_gal_name_fr').value.trim(),
                name_en:    document.getElementById('edit_gal_name_en').value.trim(),
                details_fr: buildGalleryHTML('edit_gal_name_fr', '_fr'),
                details_en: buildGalleryHTML('edit_gal_name_en', '_en'),
                url:        document.getElementById('edit_gal_url').value.trim()
            };
            
            if (!currentData.contact.galleries) currentData.contact.galleries = [];
            if (isNew) currentData.contact.galleries.unshift(newItem);
            else currentData.contact.galleries[index] = newItem;
            
            isDirty = true;
            renderGalleries();
            UI.closeModal();
        });
    }

    async function deleteGallery(idx) {
        const confirmed = await UI.confirmAction('Supprimer cette galerie ?', 'La galerie sera supprimée.', 'Supprimer', 'danger');
        if (!confirmed) return;
        currentData.contact.galleries.splice(idx, 1);
        isDirty = true;
        renderGalleries();
    }

    // ── URLs Réseaux Sociaux ──────────────────────────────────────────────────

    function renderContactUrls() {
        const list = document.getElementById('contact-urls-list');
        if (!list) return;
        list.innerHTML = '';
        const urls = currentData.contact.urls || [];
        if (urls.length === 0) {
            list.innerHTML = '<div class="py-6 text-center text-gray-500 italic text-sm">Aucun lien social ajouté.</div>';
            return;
        }
        
        urls.forEach((item, idx) => {
            list.innerHTML += `
                <div class="card border border-gray-800 p-3 rounded-xl flex justify-between items-center shadow-sm group hover:border-gray-700 transition-all draggable-item"
                     draggable="true"
                     data-drag-type="contact_urls"
                     data-index="${idx}">
                    <div class="flex items-center gap-4">
                        <span class="text-gray-500 group-hover:text-white cursor-move">☰</span>
                        <div>
                            <h4 class="font-bold text-white text-sm">${item.name}</h4>
                            <a href="${item.url}" target="_blank" class="text-[10px] text-blue-500 hover:underline">${item.url}</a>
                        </div>
                    </div>
                    <div class="flex gap-1">
                        <button data-action="edit-contact-url" data-index="${idx}" class="p-2 text-gray-500 hover:text-white rounded-lg">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button data-action="delete-contact-url" data-index="${idx}" class="p-2 text-gray-500 hover:text-red-500 rounded-lg">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </div>`;
        });

        UI.makeDraggable(list, (dragIdx, dropIdx) => {
            const arr = currentData.contact.urls;
            const item = arr.splice(dragIdx, 1)[0];
            arr.splice(dropIdx, 0, item);
            isDirty = true;
            renderContactUrls();
        });
    }

    function addContactUrl() { editContactUrl(null); }

    function editContactUrl(idx) {
        const isNew = (idx === null || idx === undefined);
        const item = isNew ? { name: '', url: '' } : currentData.contact.urls[idx];
        
        const html = `
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nom (ex: Instagram, Facebook)</label>
                    <input type="text" id="edit_url_name" class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none" value="${item.name || ''}" required>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Lien complet (https://...)</label>
                    <input type="url" id="edit_url_link" class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none" value="${item.url || ''}" required>
                </div>
            </div>`;

        UI.openModal(isNew ? "Nouveau Lien" : "Édition Lien", html, (e) => {
            e.preventDefault();
            const newItem = {
                name: document.getElementById('edit_url_name').value.trim(),
                url:  document.getElementById('edit_url_link').value.trim()
            };
            if (!currentData.contact.urls) currentData.contact.urls = [];
            if (isNew) currentData.contact.urls.unshift(newItem);
            else currentData.contact.urls[idx] = newItem;
            
            isDirty = true;
            renderContactUrls();
            UI.closeModal();
        });
    }

    async function deleteContactUrl(idx) {
        const confirmed = await UI.confirmAction('Supprimer ce lien ?', 'Le lien sera supprimé.', 'Supprimer', 'danger');
        if (!confirmed) return;
        currentData.contact.urls.splice(idx, 1);
        isDirty = true;
        renderContactUrls();
    }

    // ── Internal Helpers ──────────────────────────────────────────────────────

    function galleryDetailFields(langCode, langLabel, details) {
        const d = parseGalleryDetails(details);
        const sfx = '_' + langCode;
        return `
            <div class="space-y-4">
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-gray-800 pb-2">${langLabel}</p>
                <div>
                    <label class="block text-[10px] font-bold uppercase text-gray-500 mb-1">Sous-titre <span class="font-normal lowercase">(ex: Miami Vibes)</span></label>
                    <input type="text" id="edit_gal_subtitle${sfx}" class="w-full border-b border-gray-800 p-1 text-sm outline-none focus:border-blue-500 transition-colors" value="${escHtml(d.subtitle)}" placeholder="Miami Vibes">
                </div>
                <div>
                    <label class="block text-[10px] font-bold uppercase text-gray-500 mb-1">Adresse</label>
                    <input type="text" id="edit_gal_address${sfx}" class="w-full border-b border-gray-800 p-1 text-sm outline-none focus:border-blue-500 transition-colors" value="${escHtml(d.address)}">
                </div>
                <div>
                    <label class="block text-[10px] font-bold uppercase text-gray-500 mb-1">Téléphone</label>
                    <input type="text" id="edit_gal_phone${sfx}" class="w-full border-b border-gray-800 p-1 text-sm outline-none focus:border-blue-500 transition-colors" value="${escHtml(d.phone)}">
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-[10px] font-bold uppercase text-gray-500 mb-1">Site Web (URL)</label>
                        <input type="url" id="edit_gal_wurl${sfx}" class="w-full border-b border-gray-800 p-1 text-sm outline-none focus:border-blue-500 transition-colors" value="${escHtml(d.website_url)}">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold uppercase text-gray-500 mb-1">Label lien</label>
                        <input type="text" id="edit_gal_wlabel${sfx}" class="w-full border-b border-gray-800 p-1 text-sm outline-none focus:border-blue-500 transition-colors" value="${escHtml(d.website_label)}">
                    </div>
                </div>
            </div>`;
    }

    function parseGalleryDetails(html) {
        if (!html) return { subtitle: '', address: '', phone: '', website_url: '', website_label: '' };
        let s = html.replace(/<strong[^>]*>[^<]*<\/strong>\s*/i, '');
        let website_url = '', website_label = '';
        const aMatch = s.match(/<a\s+href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/i);
        if (aMatch) {
            website_url = aMatch[1];
            website_label = aMatch[2];
            s = s.replace(aMatch[0], '').replace(/(<br\s*\/?>\s*)+$/, '');
        }
        const parts = s.split(/<br\s*\/?>/i).map(p => p.trim()).filter(p => p !== '');
        let subtitle = '', address = '', phone = '';
        if (parts.length >= 1 && parts[0].startsWith('(') && parts[0].endsWith(')')) {
            subtitle = parts[0].slice(1, -1);
            parts.shift();
        }
        if (parts.length >= 1) { address = parts[0]; parts.shift(); }
        if (parts.length >= 1) { phone = parts[0]; }
        return { subtitle, address, phone, website_url, website_label };
    }

    function buildGalleryHTML(nameId, suffix) {
        const name     = (document.getElementById(nameId)?.value || '').trim();
        const subtitle = (document.getElementById('edit_gal_subtitle' + suffix)?.value || '').trim();
        const address  = (document.getElementById('edit_gal_address'  + suffix)?.value || '').trim();
        const phone    = (document.getElementById('edit_gal_phone'    + suffix)?.value || '').trim();
        const wUrl     = (document.getElementById('edit_gal_wurl'     + suffix)?.value || '').trim();
        const wLabel   = (document.getElementById('edit_gal_wlabel'   + suffix)?.value || '').trim();

        let html = `<strong class="font-medium text-gray-500">${name}</strong>`;
        if (subtitle) html += ` (${subtitle})`;
        if (address)  html += `<br />${address}`;
        if (phone)    html += `<br />${phone}`;
        if (wUrl) {
            const label = wLabel || wUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            html += `<br /><a href="${wUrl}" target="_blank" rel="noopener noreferrer" class="text-black hover:underline">${label}</a>`;
        }
        return html;
    }

    async function autoTranslateGalleryModal() {
        const btn = document.querySelector('button[data-action="translate-gallery-modal"]');
        const old = btn.innerHTML;
        btn.innerHTML = "Traduction...";
        try {
            document.getElementById('edit_gal_name_en').value     = await UI.translateText(document.getElementById('edit_gal_name_fr').value);
            document.getElementById('edit_gal_subtitle_en').value = await UI.translateText(document.getElementById('edit_gal_subtitle_fr').value);
            document.getElementById('edit_gal_address_en').value  = await UI.translateText(document.getElementById('edit_gal_address_fr').value);
            document.getElementById('edit_gal_phone_en').value    = document.getElementById('edit_gal_phone_fr').value;
            document.getElementById('edit_gal_wurl_en').value     = document.getElementById('edit_gal_wurl_fr').value;
            document.getElementById('edit_gal_wlabel_en').value   = document.getElementById('edit_gal_wlabel_fr').value;
        } catch(e) {}
        btn.innerHTML = old;
    }

    return {
        render: render,
        deleteGeneralImage: deleteGeneralImage,
        moveGeneralImage: moveGeneralImage,
        toggleGeneralVisibility: toggleGeneralVisibility,
        uploadGenericImage: uploadGenericImage,
        autoTranslateBio: autoTranslateBio,
        autoTranslateContact: autoTranslateContact,
        addGallery: addGallery,
        editGallery: editGallery,
        deleteGallery: deleteGallery,
        autoTranslateGalleryModal: autoTranslateGalleryModal,
        addContactUrl: addContactUrl,
        editContactUrl: editContactUrl,
        deleteContactUrl: deleteContactUrl,
        syncBioFormToData: syncBioFormToData,
        syncContactFormToData: syncContactFormToData
    };
})();
