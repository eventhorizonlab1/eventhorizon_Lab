// ============================================================================
// MODULE : ACTUALITÉS (NewsModule)
// ============================================================================

window.NewsModule = (function() {
    let modalNewsImages = []; // État local des images de la news en cours d'édition
    let editingItemIndex = null;

    // ── Rendu de la liste ─────────────────────────────────────────────────────

    function render() {
        const list = document.getElementById('news-list');
        if (!list) return;

        if (!currentData.news || currentData.news.length === 0) {
            list.innerHTML = `
                <div class="col-span-full py-20 text-center card rounded-xl border-2 border-dashed border-gray-800">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-hover mb-4">
                        <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                        </svg>
                    </div>
                    <p class="text-gray-500 font-medium text-lg">Aucune actualité pour le moment</p>
                    <p class="text-gray-500 text-sm mt-1">Cliquez sur le bouton "+" pour en ajouter une.</p>
                </div>`;
            return;
        }

        list.innerHTML = '';
        currentData.news.forEach((item, idx) => {
            if (!item) return;

            const firstImage = (item.images && item.images.length > 0) ? item.images[0] : null;
            const dateStr = item.date ? formatDate(item.date) : 'Pas de date';

            const card = document.createElement('div');
            card.className = 'responsive-card';
            card.innerHTML = `
                <div class="news-card-wrapper card border ${item.visible !== false ? 'border-gray-800' : 'border-gray-800 opacity-60'} rounded-xl shadow-sm hover:shadow-md transition-shadow relative" draggable="true" data-index="${idx}">
                    <div class="news-card-inner">
                        <!-- Handle Drag (Desktop only) -->
                        <div class="drag-handle cursor-move text-gray-500 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                        </div>

                        <!-- Image Preview -->
                        <div class="news-card-img bg-hover rounded-lg overflow-hidden border border-gray-800">
                            ${firstImage ? `<img src="${bustCache(firstImage)}" loading="lazy" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>`}
                        </div>

                        <!-- Content -->
                        <div class="news-card-content">
                            <div class="flex flex-wrap items-center gap-2 mb-1">
                                <span class="text-[10px] font-bold uppercase tracking-wider text-white bg-hover px-2 py-0.5 rounded">${dateStr}</span>
                                ${item.images && item.images.length > 1 ? `<span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-hover px-2 py-0.5 rounded">+ ${item.images.length - 1} photo(s)</span>` : ''}
                            </div>
                            <div class="flex items-center gap-2 min-w-0">
                                <h4 class="font-bold text-white truncate min-w-0">${escHtml(item.title_fr || 'Sans titre')}</h4>
                                ${item.link ? `
                                    <a href="${item.link}" target="_blank" class="flex-shrink-0 text-blue-500 hover:text-white" title="Lien externe : ${item.link}">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                    </a>
                                ` : ''}
                            </div>
                            <p class="text-sm text-gray-500 truncate mt-0.5 min-w-0">${escHtml(item.excerpt_fr || 'Pas de description')}</p>
                        </div>

                        <!-- Actions -->
                        <div class="news-card-actions">
                            <label class="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" class="news-visible-cb w-4 h-4 text-white rounded border-gray-700 focus:ring-red-500" data-action="toggle-news-cb" data-index="${idx}" ${item.visible !== false ? 'checked' : ''}>
                                <span class="text-[10px] font-black uppercase tracking-widest ${item.visible !== false ? 'text-white' : 'text-gray-500'}">Visible</span>
                            </label>

                            <div class="news-card-buttons">
                                <button data-action="edit-news" data-index="${idx}" class="btn-action bg-hover text-white hover:btn-primary hover:text-white">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                    <span>Modifier</span>
                                </button>
                                <button data-action="delete-news" data-index="${idx}" class="btn-action bg-red-50 text-red-500 hover:bg-red-600 hover:text-white">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    <span>Supprimer</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Mobile Navigation (Order) -->
                    <div class="news-mobile-order">
                        <button data-action="move-news" data-index="${idx}" data-dir="-1">↑ Monter</button>
                        <button data-action="move-news" data-index="${idx}" data-dir="1">↓ Descendre</button>
                    </div>
                </div>
            `;

            // Event delegation via data-action — no direct bindings needed

            // Drag and drop handlers
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragover', handleDragOver);
            card.addEventListener('drop', handleDrop);
            card.addEventListener('dragend', handleDragEnd);

            list.appendChild(card);
        });
    }

    // ── Actions ───────────────────────────────────────────────────────────────

    function move(idx, dir) {
        const arr = currentData.news;
        const newIdx = idx + dir;
        if (newIdx < 0 || newIdx >= arr.length) return;
        
        isDirty = true;
        [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
        render();
    }

    async function deleteItem(idx) {
        const confirmed = await UI.confirmAction(
            'Supprimer cette actualité ?',
            'Cette action est irréversible. L\'actualité sera supprimée après enregistrement.',
            'Supprimer', 'danger'
        );
        if (!confirmed) return;
        currentData.news.splice(idx, 1);
        isDirty = true;
        render();
        UI.showToast('Actualité supprimée. N\'oubliez pas d\'enregistrer.');
    }

    function editItem(index) {
        // CORRECTION : On vérifie si l'index est null ou undefined pour déterminer s'il s'agit d'une nouvelle news
        const isNew = (index === null || index === undefined);
        editingItemIndex = isNew ? null : index;
        
        const item = isNew ? { title_fr: '', title_en: '', excerpt_fr: '', excerpt_en: '', date: new Date().toISOString().split('T')[0], images: [] } : currentData['news'][index];

        modalNewsImages = (item && item.images) ? [...item.images] : [];

        const html = `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <label class="flex items-center gap-2 cursor-pointer select-none group/cb">
                        <div class="relative flex items-center justify-center">
                            <input type="checkbox" id="edit_visible" class="peer sr-only" ${item.visible !== false ? 'checked' : ''}>
                            <div class="w-10 h-5 bg-hover rounded-full peer peer-checked:btn-primary transition-colors"></div>
                            <div class="absolute left-1 w-3 h-3 card rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </div>
                        <span class="text-xs font-bold uppercase tracking-widest text-gray-500 peer-checked:text-white">Visible sur le site</span>
                    </label>
                    <button type="button" id="news-translate-all-btn" data-action="translate-news-all" class="flex items-center gap-2 px-4 py-2 bg-hover text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-hover transition-colors cursor-pointer relative z-10">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
                        Traduire FR → EN
                    </button>
                </div>
                <!-- Date et Titres -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Date de publication</label>
                        <input type="date" id="edit_date" value="${item.date || ''}"
                               class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-blue-500 transition-all outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Titre (FR)</label>
                        <input type="text" id="edit_title_fr" value="${escHtml(item.title_fr || '')}" required
                               class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-blue-500 transition-all outline-none">
                    </div>
                    <div class="relative">
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Titre (EN)</label>
                        <input type="text" id="edit_title_en" value="${escHtml(item.title_en || '')}"
                               class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-blue-500 transition-all outline-none">
                        <button type="button" data-action="translate-news-field" data-field="title" class="absolute right-2 top-8 p-1 text-blue-500 hover:bg-hover rounded cursor-pointer z-10" title="Traduire via Google">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
                        </button>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Lien externe (Site Web, Boutique, Instagram...)</label>
                        <input type="url" id="edit_link" value="${item.link || ''}" placeholder="https://..."
                               class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-blue-500 transition-all outline-none">
                    </div>
                </div>

                <!-- Descriptions -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Description (FR)</label>
                        <textarea id="edit_excerpt_fr" rows="4" required
                                  class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-blue-500 transition-all outline-none resize-none">${escHtml(item.excerpt_fr || '')}</textarea>
                    </div>
                    <div class="relative">
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Description (EN)</label>
                        <textarea id="edit_excerpt_en" rows="4"
                                  class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-blue-500 transition-all outline-none resize-none">${escHtml(item.excerpt_en || '')}</textarea>
                        <button type="button" data-action="translate-news-field" data-field="excerpt" class="absolute right-2 top-8 p-1 text-blue-500 hover:bg-hover rounded cursor-pointer z-10" title="Traduire via Google">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
                        </button>
                    </div>
                </div>

                <!-- Images Management -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-500">Galerie photos</label>
                        <label id="news-upload-label" class="cursor-pointer px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm border" 
                               style="background-color: #2563eb; color: white; border-color: #1d4ed8;">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
                            <span class="text-[10px] font-bold uppercase tracking-widest">Ajouter des photos</span>
                            <input type="file" id="news-upload-input" data-upload-type="news_item_image" style="opacity:0;position:absolute;z-index:-1;width:1px;height:1px;overflow:hidden;" accept="image/*" multiple>
                        </label>
                    </div>
                    <div id="modal-news-images-grid" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-4 bg-hover rounded-xl border-2 border-dashed border-gray-800 min-h-[150px]">
                        <!-- Rendu dynamique -->
                    </div>
                </div>
            </div>`;

            UI.openModal(isNew ? 'Nouvelle Actualité' : 'Édition Actualité', html, async (e) => {
                e.preventDefault();
                
                const newItem = {
                    ...item,
                    date:       document.getElementById('edit_date').value,
                    title_fr:   document.getElementById('edit_title_fr').value,
                    title_en:   document.getElementById('edit_title_en').value,
                    excerpt_fr: document.getElementById('edit_excerpt_fr').value,
                    excerpt_en: document.getElementById('edit_excerpt_en').value,
                    link:       document.getElementById('edit_link').value,
                    visible:    document.getElementById('edit_visible').checked,
                    images:     [...modalNewsImages]
                };

            if (isNew) {
                // Génération d'un ID unique
                const newId = currentData.news.length > 0 ? Math.max(...currentData.news.filter(n => n && n.id).map(n => n.id)) + 1 : 1;
                newItem.id = newId;
                currentData.news.unshift(newItem);
            } else {
                currentData.news[editingItemIndex] = newItem;
            }

            // Synchronisation des dates formatées pour le frontend (date_fr, date_en)
            const dateVal = document.getElementById('edit_date').value;
            if (dateVal) {
                const d = new Date(dateVal);
                if (!isNaN(d.getTime())) {
                    newItem.date_fr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
                    newItem.date_en = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                }
            }

            isDirty = true;
            render();
            UI.closeModal();
            APIModule.saveData('news');
        });

        renderModalImages();
    }

    function renderModalImages() {
        const grid = document.getElementById('modal-news-images-grid');
        if (!grid) return;

        if (modalNewsImages.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-10 text-gray-500 group cursor-pointer" data-action="trigger-news-upload">
                    <div class="w-12 h-12 rounded-full bg-hover flex items-center justify-center mb-3 group-hover:bg-hover group-hover:text-blue-500 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    </div>
                    <p class="text-xs font-bold uppercase tracking-wider">Cliquez ici pour ajouter des photos</p>
                    <p class="text-[10px] mt-1 italic">JPG, PNG ou WEBP acceptés</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = modalNewsImages.map((url, index) => `
            <div class="relative group aspect-square rounded-lg overflow-hidden border border-gray-800 card shadow-sm transition-transform hover:scale-105">
                <img src="${bustCache(url)}" loading="lazy" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button type="button" data-action="move-news-image" data-index="${index}" data-dir="-1" class="p-1 text-white hover:text-blue-300" title="Vers le début">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button type="button" data-action="move-news-image" data-index="${index}" data-dir="1" class="p-1 text-white hover:text-blue-300" title="Vers la fin">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <button type="button" data-action="remove-news-image" data-index="${index}" class="p-1 text-white hover:text-red-400" title="Retirer">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                </div>
                ${index === 0 ? `<div class="absolute top-0 left-0 btn-primary text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-br shadow-sm">Couverture</div>` : ''}
            </div>
        `).join('');
    }

    async function uploadImage(input) {
        if (!input || !input.files || input.files.length === 0) return;
        
        UI.showToast("Envoi en cours...", false);
        
        const label = input.closest('label') || document.getElementById('news-upload-label');
        if (!label) return;

        const oldHtml = label.innerHTML;
        label.classList.add('opacity-50', 'pointer-events-none');
        
        try {
            const total = input.files.length;
            for (let i = 0; i < total; i++) {
                label.innerHTML = `<div class="flex items-center gap-2">
                    <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                    <span class="text-[10px] font-bold uppercase">Préparation ${i+1}/${total}...</span>
                </div>`;
                
                const url = await APIModule.handleFileUpload(input.files[i], 'Actualite', { silent: true });
                if (url) {
                    modalNewsImages.push(url);
                    renderModalImages();
                }
            }
        } catch(e) {
            console.error("Upload crash:", e);
            UI.showToast("Erreur lors de l'upload.", true);
        } finally {
            label.innerHTML = oldHtml;
            label.classList.remove('opacity-50', 'pointer-events-none');
            input.value = '';
        }
    }

    function moveImage(idx, dir) {
        const newIdx = idx + dir;
        if (newIdx < 0 || newIdx >= modalNewsImages.length) return;
        [modalNewsImages[idx], modalNewsImages[newIdx]] = [modalNewsImages[newIdx], modalNewsImages[idx]];
        renderModalImages();
    }

    function removeImage(idx) {
        modalNewsImages.splice(idx, 1);
        renderModalImages();
    }

    async function translateField(field) {
        console.log(`Translating field: ${field}`);
        const frInput = document.getElementById(`edit_${field}_fr`);
        const enInput = document.getElementById(`edit_${field}_en`);
        if (!frInput || !enInput) {
            console.error(`Inputs not found for ${field}`);
            return false;
        }
        if (!frInput.value.trim()) {
            return false;
        }

        const btn = enInput.nextElementSibling;
        const isButton = btn && (btn.tagName === 'BUTTON' || btn.querySelector('button'));
        
        if (isButton) {
            btn.classList.add('animate-pulse', 'opacity-50');
        }
        
        try {
            const translated = await UI.translateText(frInput.value);
            if (translated) {
                enInput.value = translated;
                console.log(`Translated ${field} successfully`);
                return true;
            }
        } catch (e) {
            console.error(`Translation error for ${field}`, e);
        } finally {
            if (isButton) {
                btn.classList.remove('animate-pulse', 'opacity-50');
            }
        }
        return false;
    }

    async function translateAll() {
        console.log("Translating all news fields...");
        
        const frTitle = document.getElementById('edit_title_fr');
        const frExcerpt = document.getElementById('edit_excerpt_fr');
        
        if ((!frTitle || !frTitle.value.trim()) && (!frExcerpt || !frExcerpt.value.trim())) {
            UI.showToast("Veuillez d'abord remplir le Titre (FR) ou la Description (FR).", true);
            return;
        }

        const btn = document.getElementById('news-translate-all-btn');
        if (!btn) return;
        
        const oldHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Traduction...`;
        
        try {
            // Requêtes séquentielles pour éviter le blocage de l'API Google (erreur 429)
            const resultTitle = await translateField('title');
            const resultExcerpt = await translateField('excerpt');
            const results = [resultTitle, resultExcerpt];
            
            if (results.some(r => r === true)) {
                UI.showToast('✓ Traduction terminée.');
            } else {
                UI.showToast('Aucun texte traduit.', true);
            }
        } catch(e) {
            console.error("Global translation error", e);
            UI.showToast('Erreur lors de la traduction.', true);
        } finally {
            btn.disabled = false;
            btn.innerHTML = oldHtml;
        }
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    }

    function toggleVisibility(idx, visible) {
        if (currentData.news[idx]) {
            currentData.news[idx].visible = visible;
            isDirty = true;
            APIModule.saveData('news');
        }
    }

    // ── Drag & Drop ──────────────────────────────────────────────────────────

    function handleDragStart(e) {
        e.currentTarget.classList.add('opacity-40', 'scale-95');
        e.dataTransfer.setData('text/plain', e.currentTarget.dataset.index);
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const card = e.currentTarget;
        if (card) card.classList.add('border-gray-600', 'bg-hover');
    }

    function handleDrop(e) {
        e.preventDefault();
        const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
        const toIdx   = parseInt(e.currentTarget.dataset.index);
        
        if (fromIdx !== toIdx) {
            const arr = currentData.news;
            const item = arr.splice(fromIdx, 1)[0];
            arr.splice(toIdx, 0, item);
            isDirty = true;
            render();
        }
    }

    function handleDragEnd(e) {
        document.querySelectorAll('#news-list > div').forEach(c => {
            c.classList.remove('opacity-40', 'scale-95', 'border-gray-600', 'bg-hover');
        });
    }

    function triggerUpload() {
        const input = document.getElementById('news-upload-input');
        if (input) input.click();
    }

    return {
        render: render,
        add: () => editItem(null),
        edit: editItem,
        delete: deleteItem,
        move: move,
        toggleVisibility: toggleVisibility,
        uploadImage: uploadImage,
        triggerUpload: triggerUpload,
        moveImage: moveImage,
        removeImage: removeImage,
        translateField: translateField,
        translateAll: translateAll
    };
})();
