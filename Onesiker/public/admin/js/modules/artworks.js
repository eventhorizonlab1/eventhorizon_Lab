// ============================================================================
// MODULE : ARTWORKS (ArtworksModule)
// ============================================================================

window.ArtworksModule = (function() {
    
    function render() {
        const list = document.getElementById('artworks-list');
        if (!list) return;
        
        list.innerHTML = '';
        renderPdfStatus();

        if (!currentData.artworks || currentData.artworks.length === 0) {
            list.innerHTML = `
                <div class="py-12 text-center text-gray-500 italic">
                    Aucune catégorie d'œuvres définie.
                </div>`;
            return;
        }

        currentData.artworks.forEach((cat, catIdx) => {
            const catName = getCategoryName(cat);
            const artworkCount = (cat.images || []).length;

            const catSection = document.createElement('div');
            catSection.className = 'card mb-6 overflow-hidden transition-all hover:shadow-md';
            
            let imagesHtml = '';
            if (cat.images && cat.images.length > 0) {
                cat.images.forEach((img, imgIdx) => {
                    imagesHtml += `
                        <div class="group responsive-card"
                             draggable="true"
                             data-drag-type="artworks"
                             data-cat-index="${catIdx}"
                             data-index="${imgIdx}">
                            <div class="news-card-inner">
                                <div class="drag-handle cursor-move text-gray-500 hover:text-white">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                                </div>

                                <div class="news-card-img rounded-lg bg-hover overflow-hidden border border-gray-50">
                                    <img src="${bustCache(img.src)}" loading="lazy" class="w-full h-full object-cover">
                                </div>

                                <div class="news-card-content flex flex-col justify-center">
                                    <p class="text-sm font-bold text-white truncate">${escHtml(img.title || 'Sans titre')}</p>
                                </div>

                                <div class="news-card-actions">
                                    <!-- Visibility Toggle -->
                                    <label class="flex items-center gap-1.5 cursor-pointer select-none">
                                        <input type="checkbox" data-action="toggle-artwork-visibility" data-cat-index="${catIdx}" data-img-index="${imgIdx}" class="w-4 h-4 text-white rounded border-gray-700 focus:ring-red-500" ${img.visible !== false ? 'checked' : ''}>
                                        <span class="text-[10px] font-black uppercase tracking-widest ${img.visible !== false ? 'text-white' : 'text-gray-500'}">Visible</span>
                                    </label>

                                    <div class="news-card-buttons">
                                        <button data-action="rename-artwork" data-cat-index="${catIdx}" data-index="${imgIdx}" class="btn-action border border-gray-700 text-white hover:bg-hover" title="Renommer"><span>Renommer</span></button>
                                        <button data-action="delete-artwork" data-cat-index="${catIdx}" data-index="${imgIdx}" class="btn-action border border-red-500 text-red-500 hover:bg-red-500 hover:text-white" title="Supprimer"><span>Supprimer</span></button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="news-mobile-order">
                                <button data-action="move-artwork" data-cat-index="${catIdx}" data-index="${imgIdx}" data-dir="-1" title="Monter">↑ Monter</button>
                                <button data-action="move-artwork" data-cat-index="${catIdx}" data-index="${imgIdx}" data-dir="1" title="Descendre">↓ Descendre</button>
                            </div>
                        </div>`;
                });
            }

            catSection.innerHTML = `
                <div class="p-5 border-b border-gray-800 flex flex-wrap items-center justify-between gap-4 bg-hover">
                    <div>
                        <h3 class="text-lg font-black text-white flex items-center gap-2">
                            ${escHtml(catName)}
                            <span class="text-xs font-bold uppercase tracking-widest text-gray-500 bg-hover px-2 py-0.5 rounded-full">${artworkCount}</span>
                        </h3>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="flex items-center card rounded-lg border border-gray-800 p-1 shadow-sm mr-2">
                            <button data-action="move-category" data-index="${catIdx}" data-dir="-1" class="p-1.5 text-gray-500 hover:text-white hover:bg-hover rounded transition-colors" title="Monter la catégorie">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
                            </button>
                            <button data-action="move-category" data-index="${catIdx}" data-dir="1" class="p-1.5 text-gray-500 hover:text-white hover:bg-hover rounded transition-colors" title="Descendre la catégorie">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                        </div>
                        <button data-action="rename-category" data-index="${catIdx}" class="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white card border border-gray-700 rounded-lg hover:bg-hover transition-colors shadow-sm">Renommer</button>
                        <button data-action="delete-category" data-index="${catIdx}" class="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-red-500 card border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-sm">Supprimer</button>
                        <button data-action="add-artwork-image" data-index="${catIdx}" class="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white btn-primary rounded-lg  transition-colors shadow-sm">+ Ajouter</button>
                    </div>
                </div>
                <div class="p-4 card">
                    <div class="grid grid-cols-1 gap-3">
                        ${imagesHtml || '<div class="py-6 text-center text-gray-500 text-sm italic">Aucune œuvre dans cette catégorie.</div>'}
                    </div>
                </div>
            `;
            
            list.appendChild(catSection);
        });
        
        // Add "Add Category" button at the end
        const addBtnContainer = document.createElement('div');
        addBtnContainer.className = 'mt-8 flex justify-center';
        addBtnContainer.innerHTML = `
            <button data-action="add-category" class="group flex items-center gap-2 px-6 py-3 empty-state border-2 border-dashed rounded-xl text-gray-500 hover:border-gray-600 hover:text-white transition-all font-bold">
                <svg class="w-5 h-5 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
                Créer une nouvelle catégorie
            </button>
        `;
        list.appendChild(addBtnContainer);
    }

    // ── Images ────────────────────────────────────────────────────────────────

    function addImage(catIdx) {
        const catName = getCategoryName(currentData.artworks[catIdx]);
        
        const html = `
            <div class="space-y-6">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Titre de l'œuvre (et dimensions)</label>
                    <input type="text" id="art_title" class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="ex: FOCUS - 116X81" required>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Image de l'œuvre</label>
                    <div id="art_preview_container" class="hidden mb-3 p-2 bg-hover rounded-lg border border-gray-800">
                        <img id="art_preview" class="max-h-40 mx-auto rounded shadow-sm">
                    </div>
                    <label class="relative block w-full">
                        <input type="file" id="art_image_file" class="hidden" accept="image/*" data-upload-type="artwork_local_upload">
                        <div class="w-full py-8 border-2 border-dashed border-gray-700 rounded-xl bg-hover text-center cursor-pointer hover:bg-hover hover:border-gray-600 transition-all group">
                            <svg class="w-8 h-8 text-gray-500 group-hover:text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <span class="text-sm font-bold text-gray-500 group-hover:text-white transition-colors">Choisir une image...</span>
                        </div>
                    </label>
                </div>
            </div>`;

        window.pendingArtworkUrl = null;

        UI.openModal(`Ajouter une œuvre — ${catName}`, html, async (e) => {
            e.preventDefault();
            
            if (!window.pendingArtworkUrl) {
                UI.showToast('⚠️ Veuillez sélectionner une image.', true);
                return;
            }

            const url = await window.pendingArtworkUrl;
            if (!url) return;

            const newImg = {
                src: url,
                title: document.getElementById('art_title').value.trim(),
                visible: true
            };

            if (!currentData.artworks[catIdx].images) currentData.artworks[catIdx].images = [];
            currentData.artworks[catIdx].images.unshift(newImg);

            isDirty = true;
            render();
            UI.closeModal();
        });
    }

    async function handleLocalUpload(input) {
        if (!input.files || !input.files[0]) return;

        const preview = document.getElementById('art_preview');
        const container = document.getElementById('art_preview_container');
        const sourceFile = input.files[0];

        let blob;
        try {
            blob = await UI.openCropper(sourceFile, { aspectRatio: 3/4, title: 'Recadrer l\'œuvre (portrait 3:4)' });
        } catch (err) {
            if (err && err.message === 'canceled') {
                input.value = '';
                return;
            }
            throw err;
        }

        // Preview using the cropped blob so the form reflects what will be saved.
        const objectUrl = URL.createObjectURL(blob);
        preview.src = objectUrl;
        container.classList.remove('hidden');

        // Kick off the upload; the form's submit handler awaits this promise.
        window.pendingArtworkUrl = APIModule.handleFileUpload(blob, 'Atelier', { silent: true, filename: sourceFile.name });
    }

    function editImage(catIdx, imgIdx) {
        const img = currentData.artworks[catIdx].images[imgIdx];
        const catName = getCategoryName(currentData.artworks[catIdx]);

        const html = `
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Titre de l'œuvre (et dimensions)</label>
                    <input type="text" id="edit_art_title" class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none transition-all" value="${escHtml(img.title || '')}" required>
                </div>
                <div class="flex items-center gap-3 py-2">
                    <label class="relative flex items-center cursor-pointer select-none">
                        <input type="checkbox" id="edit_art_visible" class="peer sr-only" ${img.visible !== false ? 'checked' : ''}>
                        <div class="w-10 h-5 bg-hover rounded-full peer peer-checked:btn-primary transition-colors"></div>
                        <div class="absolute left-0.5 w-4 h-4 card rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                    <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Visible sur le site</span>
                </div>
                <div class="p-4 bg-hover rounded-lg border border-gray-700">
                    <p class="text-xs text-white font-medium leading-relaxed">
                        <span class="font-black text-lg mr-1">ℹ️</span> Pour changer l'image, supprimez cette œuvre et ajoutez-en une nouvelle.
                    </p>
                </div>
            </div>`;

        UI.openModal(`Édition — ${catName}`, html, (e) => {
            e.preventDefault();
            const newTitle = document.getElementById('edit_art_title').value.trim();
            if (!newTitle) return;
            const isVisible = document.getElementById('edit_art_visible').checked;
            
            currentData.artworks[catIdx].images[imgIdx].title = newTitle;
            currentData.artworks[catIdx].images[imgIdx].visible = isVisible;
            isDirty = true;
            render();
            UI.closeModal();
        });
    }

    async function deleteImage(catIdx, imgIdx) {
        const confirmed = await UI.confirmAction('Supprimer cette œuvre ?', 'L\'œuvre sera retirée de la galerie.', 'Supprimer', 'danger');
        if (!confirmed) return;
        currentData.artworks[catIdx].images.splice(imgIdx, 1);
        isDirty = true;
        render();
    }

    function toggleImageVisibility(catIdx, imgIdx, visible) {
        currentData.artworks[catIdx].images[imgIdx].visible = visible;
        isDirty = true;
        APIModule.saveData('artworks');
        UI.showToast(visible ? "✓ Œuvre rendue visible sur le site." : "✓ Œuvre masquée sur le site.");
    }

    function renameImage(catIdx, imgIdx) {
        const img = currentData.artworks[catIdx].images[imgIdx];
        const oldName = img.title || 'Sans titre';

        const html = `
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Titre de l'œuvre (et dimensions)</label>
                    <input type="text" id="artwork_rename_input" class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none transition-all" value="${escHtml(oldName)}" placeholder="ex: FOCUS - 116X81" required autofocus>
                </div>
            </div>`;

        UI.openModal(`Renommer l'œuvre`, html, (e) => {
            e.preventDefault();
            const newName = document.getElementById('artwork_rename_input').value.trim();
            if (!newName || newName === oldName) { UI.closeModal(); return; }
            img.title = newName;
            isDirty = true;
            render();
            UI.closeModal();
            UI.showToast('✓ Œuvre renommée.');
        });
    }

    function moveImage(catIdx, imgIdx, dir) {
        const arr = currentData.artworks[catIdx].images;
        const newIdx = imgIdx + dir;
        if (newIdx < 0 || newIdx >= arr.length) return;
        
        isDirty = true;
        [arr[imgIdx], arr[newIdx]] = [arr[newIdx], arr[imgIdx]];
        render();
    }

    // ── Catégories ────────────────────────────────────────────────────────────

    function addCategory() {
        const html = `
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nom de la catégorie</label>
                    <input type="text" id="cat_name_input" class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="ex: Grands Formats" required autofocus>
                </div>
            </div>`;

        UI.openModal('Nouvelle Catégorie', html, (e) => {
            e.preventDefault();
            const name = document.getElementById('cat_name_input').value.trim();
            if (!name) return;

            const newId = currentData.artworks.length > 0 ? Math.max(...currentData.artworks.map(c => c.id)) + 1 : 1;
            currentData.artworks.push({ id: newId, name, images: [] });
            isDirty = true;
            render();
            UI.closeModal();
            UI.showToast('✓ Catégorie ajoutée.');
        });
    }

    function renameCategory(catIdx) {
        const cat = currentData.artworks[catIdx];
        const oldName = getCategoryName(cat);

        const html = `
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nouveau nom</label>
                    <input type="text" id="cat_rename_input" class="w-full px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none transition-all" value="${escHtml(oldName)}" required autofocus>
                </div>
            </div>`;

        UI.openModal(`Renommer — ${oldName}`, html, (e) => {
            e.preventDefault();
            const newName = document.getElementById('cat_rename_input').value.trim();
            if (!newName || newName === oldName) { UI.closeModal(); return; }
            cat.name = newName;
            isDirty = true;
            render();
            UI.closeModal();
            UI.showToast('✓ Catégorie renommée.');
        });
    }

    async function deleteCategory(catIdx) {
        const catName = getCategoryName(currentData.artworks[catIdx]);
        const confirmed = await UI.confirmAction(
            `Supprimer "${catName}" ?`,
            'La catégorie et TOUTES ses œuvres seront supprimées.',
            'Supprimer', 'danger'
        );
        if (!confirmed) return;
        
        currentData.artworks.splice(catIdx, 1);
        isDirty = true;
        render();
        UI.showToast('Catégorie supprimée.');
    }

    function moveCategory(catIdx, dir) {
        const arr = currentData.artworks;
        const newIdx = catIdx + dir;
        if (newIdx < 0 || newIdx >= arr.length) return;
        
        isDirty = true;
        [arr[catIdx], arr[newIdx]] = [arr[newIdx], arr[catIdx]];
        render();
    }

    // ── PDF Portfolio ─────────────────────────────────────────────────────────

    function renderPdfStatus() {
        const container = document.getElementById('pdf-current');
        const fallback = document.getElementById('pdf-none');
        const link = document.getElementById('pdf-link');
        const badge = document.getElementById('pdf-badge');
        const deleteBtn = document.querySelector('[data-action="delete-pdf"]');
        if (!container || !link) return;

        if (currentData.atelier_meta && currentData.atelier_meta.pdfUrl) {
            link.href = currentData.atelier_meta.pdfUrl;
            if (badge) {
                badge.textContent = 'Personnalisé';
                badge.className = 'text-xs px-2.5 py-0.5 rounded-full bg-hover text-white font-bold transition-all';
            }
            if (deleteBtn) deleteBtn.classList.remove('hidden');
        } else {
            link.href = '/PDF/Portfolio_Artistique_Onesiker.pdf';
            if (badge) {
                badge.textContent = 'Par défaut';
                badge.className = 'text-xs px-2.5 py-0.5 rounded-full bg-hover text-white font-bold transition-all';
            }
            if (deleteBtn) deleteBtn.classList.add('hidden');
        }
    }

    async function uploadPdf(input) {
        const url = await APIModule.handlePdfUpload(input);
        if (url) {
            if (!currentData.atelier_meta || Array.isArray(currentData.atelier_meta)) {
                currentData.atelier_meta = {};
            }
            currentData.atelier_meta.pdfUrl = url;
            renderPdfStatus();
            await APIModule.saveData('atelier_meta');
        }
    }

    async function deletePdf() {
        const confirmed = await UI.confirmAction('Supprimer ce PDF ?', 'Le lien vers le PDF sera supprimé.', 'Supprimer', 'danger');
        if (!confirmed) return;
        if (currentData.atelier_meta) {
            delete currentData.atelier_meta.pdfUrl;
            renderPdfStatus();
            await APIModule.saveData('atelier_meta');
        }
    }

    return {
        render: render,
        addImage: addImage,
        editImage: editImage,
        renameImage: renameImage,
        deleteImage: deleteImage,
        toggleImageVisibility: toggleImageVisibility,
        moveImage: moveImage,
        handleLocalUpload: handleLocalUpload,
        addCategory: addCategory,
        renameCategory: renameCategory,
        deleteCategory: deleteCategory,
        moveCategory: moveCategory,
        uploadPdf: uploadPdf,
        deletePdf: deletePdf
    };
})();
