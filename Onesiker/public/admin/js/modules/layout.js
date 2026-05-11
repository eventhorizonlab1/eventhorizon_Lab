// ============================================================================
// MODULE LAYOUT (LayoutModule) — Gestion du Menu et des Sections
// ============================================================================

window.LayoutModule = (function() {

    let layoutData = { sections: [] };
    let customPagesData = {};

    async function load() {
        try {
            const ts = Date.now();
            const [layoutRes, customPagesRes] = await Promise.all([
                fetch(`api.php?action=get_data&type=layout&t=${ts}`).then(r=>r.json()),
                fetch(`api.php?action=get_data&type=custom_pages&t=${ts}`).then(r=>r.json())
            ]);
            
            layoutData = (layoutRes && layoutRes.sections) ? layoutRes : { sections: [] };
            
            // Normalize legacy 'native' type → use section id as type (news, shop, bio, artworks, contact)
            const TYPE_FROM_ID = { news: 'news', shop: 'shop', bio: 'bio', artworks: 'artworks', contacts: 'contact' };
            layoutData.sections.forEach(sec => {
                if (sec.type === 'native' && TYPE_FROM_ID[sec.id]) {
                    sec.type = TYPE_FROM_ID[sec.id];
                }
            });
            customPagesData = (customPagesRes && !Array.isArray(customPagesRes)) ? customPagesRes : {};
            
            render();
        } catch (e) {
            console.error("Layout load error:", e);
        }
    }

    function render() {
        const container = document.getElementById('layout-list');
        if (!container) return;

        if (!layoutData.sections || layoutData.sections.length === 0) {
            container.innerHTML = '<div class="py-12 text-center text-gray-500 italic text-sm">Aucune section configurée.</div>';
            return;
        }


        container.innerHTML = layoutData.sections.map((section, idx) => {
            const isCustom = section.type === 'custom';
            
            const NATIVE_DEFAULTS = {
                'news': { fr: 'Actualités', en: 'News' },
                'shop': { fr: 'Boutique', en: 'Shop' },
                'bio': { fr: 'Onesiker', en: 'Onesiker' },
                'artworks': { fr: 'Atelier', en: 'Artworks' },
                'contacts': { fr: 'Contact', en: 'Contact' }
            };
            
            // Auto-convert legacy string titles to object format
            if (typeof section.title === 'string') {
                section.title = { fr: section.title, en: '' };
            } else if (!section.title || typeof section.title !== 'object') {
                section.title = { fr: '', en: '' };
            }

            // Fallback pour les sections natives si elles ont été vidées par erreur
            if (!isCustom) {
                if ((!section.title.fr || typeof section.title.fr !== 'string' || !section.title.fr.trim()) && NATIVE_DEFAULTS[section.id]) {
                    section.title.fr = NATIVE_DEFAULTS[section.id].fr;
                }
                if ((!section.title.en || typeof section.title.en !== 'string' || !section.title.en.trim()) && NATIVE_DEFAULTS[section.id]) {
                    section.title.en = NATIVE_DEFAULTS[section.id].en;
                }
            }

            const titleFr = section.title.fr || '';
            const titleEn = section.title.en || '';

            return `
                <div class="card border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm hover:border-gray-700 transition-all draggable-item group"
                     data-index="${idx}">
                    
                    <div class="flex items-center gap-4 flex-1 w-full">
                        <span class="drag-handle text-2xl text-gray-500 group-hover:text-white cursor-grab active:cursor-grabbing px-1 select-none" title="Glisser pour réordonner">⠿</span>
                        <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Titre FR</label>
                                <input type="text" autocomplete="off" class="layout-title-fr w-full border border-gray-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none text-white" data-index="${idx}">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Titre EN</label>
                                <input type="text" autocomplete="off" class="layout-title-en w-full border border-gray-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none text-white" data-index="${idx}">
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-4 shrink-0 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                        <label class="flex items-center gap-2 cursor-pointer select-none group/cb">
                            <div class="relative flex items-center justify-center">
                                <input type="checkbox" class="layout-visible-cb peer sr-only" data-index="${idx}" ${section.visible ? 'checked' : ''}>
                                <div class="w-10 h-5 bg-hover rounded-full peer peer-checked:btn-primary transition-colors"></div>
                                <div class="absolute left-1 w-3 h-3 card rounded-full transition-transform peer-checked:translate-x-5"></div>
                            </div>
                            <span class="text-xs font-bold uppercase tracking-widest text-gray-500 peer-checked:text-white">Visible</span>
                        </label>

                        <div class="h-8 w-px bg-hover hidden md:block"></div>

                        <div class="flex items-center gap-1">
                            ${isCustom ? `
                                <button data-action="edit-custom-page" data-id="${section.id}" class="p-2 text-white hover:bg-hover rounded-lg transition-colors" title="Éditer le contenu">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                </button>
                                <button data-action="delete-custom-page" data-id="${section.id}" class="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Supprimer la section">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                            ` : `
                                <span class="px-3 py-1 bg-hover text-gray-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Natif</span>
                            `}
                        </div>
                    </div>
                </div>`;
        }).join('');

        // Force l'application des valeurs pour contrer le cache de restauration de formulaire du navigateur
        layoutData.sections.forEach((section, idx) => {
            const frInput = container.querySelector(`.layout-title-fr[data-index="${idx}"]`);
            const enInput = container.querySelector(`.layout-title-en[data-index="${idx}"]`);
            if (frInput) frInput.value = (section.title && section.title.fr) ? section.title.fr : '';
            if (enInput) enInput.value = (section.title && section.title.en) ? section.title.en : '';
        });

        attachDragListeners(container);
    }

    function syncInputs() {
        document.querySelectorAll('.layout-title-fr').forEach(input => {
            const idx = input.dataset.index;
            const sec = layoutData.sections[idx];
            if (sec) {
                if (typeof sec.title === 'string') sec.title = { fr: sec.title, en: '' };
                else if (!sec.title) sec.title = { fr: '', en: '' };
                sec.title.fr = input.value;
            }
        });
        document.querySelectorAll('.layout-title-en').forEach(input => {
            const idx = input.dataset.index;
            const sec = layoutData.sections[idx];
            if (sec && sec.title) sec.title.en = input.value;
        });
        document.querySelectorAll('.layout-visible-cb').forEach(cb => {
            const idx = cb.dataset.index;
            if (layoutData.sections[idx]) layoutData.sections[idx].visible = cb.checked;
        });
    }

    async function saveLayout() {
        syncInputs();
        
        const btn = document.querySelector('button[data-action="save"][data-type="layout"]');
        const oldText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Sauvegarde...`;

        try {
            const fd = new FormData();
            fd.append('action', 'save_data');
            fd.append('type', 'layout');
            fd.append('data', JSON.stringify(layoutData));
            fd.append('csrf_token', csrfToken);

            const res = await fetch('api.php', { method: 'POST', body: fd });
            const data = await res.json();
            
            if (data.success) {
                UI.showToast('Structure du menu enregistrée !');
                isDirty = false;
            } else {
                UI.showToast(data.error || 'Erreur lors de la sauvegarde.', true);
            }
        } catch (e) {
            UI.showToast('Erreur réseau.', true);
        } finally {
            btn.disabled = false;
            btn.innerHTML = oldText;
        }
    }

    function addCustomPage() {
        const id = 'custom_' + Date.now();
        layoutData.sections.unshift({
            id: id,
            type: 'custom',
            title: { fr: 'Nouvelle Section', en: 'New Section' },
            visible: true
        });
        customPagesData[id] = {
            title_fr: '', title_en: '',
            content_fr: '', content_en: '',
            images: []
        };
        render();
        UI.showToast('Section ajoutée en haut de liste.');
        isDirty = true;
    }

    async function deleteCustomPage(id) {
        const confirmed = await UI.confirmAction('Supprimer cette section ?', 'La section personnalisée et tout son contenu seront supprimés.', 'Supprimer', 'danger');
        if (!confirmed) return;
        
        layoutData.sections = layoutData.sections.filter(s => s.id !== id);
        delete customPagesData[id];
        
        // On sauvegarde tout de suite pour éviter les incohérences
        try {
            const fdL = new FormData();
            fdL.append('action', 'save_data'); fdL.append('type', 'layout');
            fdL.append('data', JSON.stringify(layoutData)); fdL.append('csrf_token', csrfToken);
            
            const fdC = new FormData();
            fdC.append('action', 'save_data'); fdC.append('type', 'custom_pages');
            fdC.append('data', JSON.stringify(customPagesData)); fdC.append('csrf_token', csrfToken);
            
            await Promise.all([
                fetch('api.php', { method: 'POST', body: fdL }),
                fetch('api.php', { method: 'POST', body: fdC })
            ]);
            
            render();
            UI.showToast('Section supprimée.');
        } catch (err) {
            UI.showToast('Erreur lors de la suppression.', true);
        }
    }

    function editCustomPage(id) {
        const page = customPagesData[id] || { title_fr: '', title_en: '', content_fr: '', content_en: '', images: [] };
        if (!page.images) page.images = [];

        const html = `
            <input type="hidden" id="custom_page_id" value="${id}">
            <div class="space-y-6">
                <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <p class="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b pb-2">🇫🇷 Français</p>
                        <input type="text" id="custom_title_fr" class="w-full border rounded-lg px-4 py-2 text-sm" placeholder="Titre principal" value="${escHtml(page.title_fr || '')}">
                        <textarea id="custom_content_fr" class="w-full border rounded-lg px-4 py-2 text-sm h-32" placeholder="Contenu textuel">${escHtml(page.content_fr || '')}</textarea>
                    </div>
                    <div class="space-y-4">
                        <p class="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b pb-2">🇬🇧 Anglais</p>
                        <input type="text" id="custom_title_en" class="w-full border rounded-lg px-4 py-2 text-sm" placeholder="Main title" value="${escHtml(page.title_en || '')}">
                        <textarea id="custom_content_en" class="w-full border rounded-lg px-4 py-2 text-sm h-32" placeholder="Text content">${escHtml(page.content_en || '')}</textarea>
                    </div>
                </div>
                
                <div class="bg-hover p-6 rounded-xl border border-gray-800">
                    <p class="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Galerie d'images</p>
                    <div id="custom-images-list" class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4"></div>
                    <label class="block w-full border-2 border-dashed border-gray-700 p-6 text-center cursor-pointer hover:card hover:border-gray-600 rounded-xl transition-all group">
                        <input type="file" id="custom_upload" class="hidden" data-upload-type="custom_page" accept="image/*">
                        <span class="text-xs font-bold text-gray-500 group-hover:text-white tracking-widest uppercase">+ Ajouter une image</span>
                    </label>
                </div>
            </div>`;

        UI.openModal(`Édition Contenu Section`, html, async (e) => {
            e.preventDefault();
            const pId = document.getElementById('custom_page_id').value;
            const section = layoutData.sections.find(s => s.id === pId);
            
            customPagesData[pId] = {
                title_fr: document.getElementById('custom_title_fr').value,
                title_en: document.getElementById('custom_title_en').value,
                content_fr: document.getElementById('custom_content_fr').value,
                content_en: document.getElementById('custom_content_en').value,
                images: window.currentCustomImages || []
            };

            if (section) {
                section.title.fr = customPagesData[pId].title_fr;
                section.title.en = customPagesData[pId].title_en;
            }

            try {
                const fdC = new FormData();
                fdC.append('action', 'save_data'); fdC.append('type', 'custom_pages');
                fdC.append('data', JSON.stringify(customPagesData)); fdC.append('csrf_token', csrfToken);
                
                const fdL = new FormData();
                fdL.append('action', 'save_data'); fdL.append('type', 'layout');
                fdL.append('data', JSON.stringify(layoutData)); fdL.append('csrf_token', csrfToken);

                await Promise.all([
                    fetch('api.php', { method: 'POST', body: fdC }),
                    fetch('api.php', { method: 'POST', body: fdL })
                ]);

                UI.showToast('Section enregistrée.');
                render();
                UI.closeModal();
            } catch (err) {
                UI.showToast('Erreur de sauvegarde.', true);
            }
        });

        window.currentCustomImages = [...(page.images || [])];
        renderCustomImages();
    }

    function renderCustomImages() {
        const container = document.getElementById('custom-images-list');
        if (!container) return;
        container.innerHTML = window.currentCustomImages.map((img, idx) => `
            <div class="relative group card border border-gray-800 rounded-lg overflow-hidden shadow-sm">
                <img src="${bustCache(img.url)}" class="w-full h-32 object-cover">
                <div class="p-2">
                    <input type="text" class="custom-img-title w-full border-none p-0 text-[10px] focus:ring-0 placeholder-gray-300" placeholder="Légende..." value="${escHtml(img.title || '')}" data-img-index="${idx}">
                </div>
                <button type="button" data-action="remove-custom-image" data-index="${idx}" class="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">&times;</button>
            </div>`).join('');
    }

    async function handleCustomUpload(input) {
        if (!input.files.length) return;
        const sourceFile = input.files[0];
        let blob;
        try {
            blob = await UI.openCropper(sourceFile, { aspectRatio: 1, title: 'Recadrer (carré 1:1)' });
        } catch (err) {
            if (err && err.message === 'canceled') { input.value = ''; return; }
            throw err;
        }
        try {
            const url = await APIModule.handleFileUpload(blob, 'CustomPage', { filename: sourceFile.name });
            if (url) {
                window.currentCustomImages.unshift({ url, title: '' });
                renderCustomImages();
            }
        } catch (err) {}
        input.value = '';
    }

    function removeCustomImage(index) {
        window.currentCustomImages.splice(index, 1);
        renderCustomImages();
    }

    // ── Drag & Drop ───────────────────────────────────────────────────────────
    // Les events sont attachés via JS (pas inline) pour contrôler passive:false
    // et éviter les conflits avec les <input> enfants.
    let dragSrcIndex = null;

    function attachDragListeners(container) {
        container.querySelectorAll('.draggable-item').forEach(row => {
            const handle = row.querySelector('.drag-handle');
            if (!handle) return;

            // ── Desktop drag (HTML5) ──────────────────────────────────────────
            // On active draggable seulement via la poignée pour éviter
            // que les <input> bloquent le drag
            handle.addEventListener('mousedown', () => { row.setAttribute('draggable', 'true'); });
            row.addEventListener('dragstart', e => {
                dragSrcIndex = parseInt(row.dataset.index);
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(dragSrcIndex));
                row.classList.add('opacity-40');
            });
            row.addEventListener('dragend', () => {
                row.setAttribute('draggable', 'false');
                container.querySelectorAll('.draggable-item').forEach(el =>
                    el.classList.remove('border-gray-600', 'border-2', 'opacity-40')
                );
                dragSrcIndex = null;
            });
            row.addEventListener('dragover', e => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                row.classList.add('border-gray-600', 'border-2');
            });
            row.addEventListener('dragleave', e => {
                if (!row.contains(e.relatedTarget))
                    row.classList.remove('border-gray-600', 'border-2');
            });
            row.addEventListener('drop', e => {
                e.preventDefault();
                e.stopPropagation();
                container.querySelectorAll('.draggable-item').forEach(el =>
                    el.classList.remove('border-gray-600', 'border-2', 'opacity-40')
                );
                const dropIdx = parseInt(row.dataset.index);
                if (dragSrcIndex === null || isNaN(dropIdx) || dragSrcIndex === dropIdx) return;
                syncInputs();
                const [moved] = layoutData.sections.splice(dragSrcIndex, 1);
                layoutData.sections.splice(dropIdx, 0, moved);
                dragSrcIndex = null;
                isDirty = true;
                render();
            });

            // ── Touch drag (iOS/Safari) ───────────────────────────────────────
            let touchIdx = null, touchClone = null, touchEl = null;

            handle.addEventListener('touchstart', e => {
                if (e.touches.length !== 1) return;
                touchEl  = row;
                touchIdx = parseInt(row.dataset.index);
                row.classList.add('opacity-40');
                touchClone = row.cloneNode(true);
                Object.assign(touchClone.style, {
                    position: 'fixed', pointerEvents: 'none', zIndex: '9999',
                    width: row.offsetWidth + 'px', opacity: '0.85',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)', borderRadius: '12px',
                    transition: 'none'
                });
                document.body.appendChild(touchClone);
                _placeClone(touchClone, e.touches[0]);
            }, { passive: true });

            handle.addEventListener('touchmove', e => {
                e.preventDefault();
                if (!touchClone) return;
                _placeClone(touchClone, e.touches[0]);
                touchClone.style.display = 'none';
                const under = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
                touchClone.style.display = '';
                container.querySelectorAll('.draggable-item').forEach(el => el.classList.remove('border-gray-600', 'border-2'));
                const target = under && under.closest('.draggable-item');
                if (target && target !== touchEl) target.classList.add('border-gray-600', 'border-2');
            }, { passive: false });

            handle.addEventListener('touchend', e => {
                if (touchClone) { touchClone.remove(); touchClone = null; }
                if (touchEl) touchEl.classList.remove('opacity-40');
                const t = e.changedTouches[0];
                const under  = document.elementFromPoint(t.clientX, t.clientY);
                const target = under && under.closest('.draggable-item');
                container.querySelectorAll('.draggable-item').forEach(el => el.classList.remove('border-gray-600', 'border-2'));
                if (target && target !== touchEl) {
                    const dropIdx = parseInt(target.dataset.index);
                    if (!isNaN(dropIdx) && touchIdx !== dropIdx) {
                        syncInputs();
                        const [moved] = layoutData.sections.splice(touchIdx, 1);
                        layoutData.sections.splice(dropIdx, 0, moved);
                        isDirty = true;
                        render();
                    }
                }
                touchEl = null; touchIdx = null;
            }, { passive: true });
        });
    }

    function _placeClone(clone, touch) {
        clone.style.left = (touch.clientX - clone.offsetWidth  / 2) + 'px';
        clone.style.top  = (touch.clientY - clone.offsetHeight / 2) + 'px';
    }

    return {
        load,
        render,
        saveLayout,
        addCustomPage,
        deleteCustomPage,
        editCustomPage,
        removeCustomImage,
        handleCustomUpload
    };
})();
