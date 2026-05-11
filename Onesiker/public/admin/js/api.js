// ============================================================================
// MODULE API (APIModule) — Communications avec api.php
// ============================================================================

window.APIModule = (function() {

    async function checkAuth() {
        try {
            const res = await fetch('api.php?action=check');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.auth) {
                if (data.csrf_token) csrfToken = data.csrf_token;
                document.getElementById('login-container').classList.add('hidden');
                document.getElementById('app-container').classList.remove('hidden');
                document.getElementById('bottom-nav').classList.remove('nav-hidden');
                await loadAllData();
            }
        } catch (e) {
            console.error("Auth check failed", e);
        }
    }

    async function logout() {
        if (isDirty) {
            const confirmed = await UI.confirmAction(
                'Changements non sauvegardés',
                'Vous avez des modifications non enregistrées. Voulez-vous vraiment vous déconnecter\u00a0?',
                'Déconnexion', 'danger'
            );
            if (!confirmed) return;
        }
        
        const fd = new FormData();
        fd.append('action', 'logout');
        fd.append('csrf_token', csrfToken);
        await fetch('api.php', { method: 'POST', body: fd });
        location.reload();
    }

    async function loadAllData() {
        UI.showLoadingOverlay(true);
        const types = ['news', 'artworks', 'hero', 'boutique', 'bio', 'contact', 'atelier_meta'];
        const ts = Date.now();
        
        for (const type of types) {
            try {
                const res = await fetch(`api.php?action=get_data&type=${type}&t=${ts}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (data !== null) {
                    if (Array.isArray(data) && (type === 'bio' || type === 'contact' || type === 'atelier_meta')) {
                        currentData[type] = {};
                    } else {
                        currentData[type] = data;
                    }
                }
            } catch (e) {
                console.error(`Error loading ${type}`, e);
            }
        }
        
        if (window.LayoutModule) await LayoutModule.load();
        UI.renderAll();
        UI.showLoadingOverlay(false);
    }

    // ── Spinner SVG réutilisable ────────────────────────────────────────────
    const SPINNER_SVG = `<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>`;

    async function saveData(type) {
        if (type === 'bio' && window.PagesModule) PagesModule.syncBioFormToData();
        if (type === 'contact' && window.PagesModule) PagesModule.syncContactFormToData();

        const saveBtns = document.querySelectorAll(`button[data-action="save"][data-type="${type}"]`);
        saveBtns.forEach(btn => { 
            btn.disabled = true; 
            btn._oldContent = btn.innerHTML; 
            btn.innerHTML = SPINNER_SVG; 
        });

        const fd = new FormData();
        fd.append('action', 'save_data');
        fd.append('csrf_token', csrfToken);
        fd.append('type', type);
        fd.append('data', JSON.stringify(currentData[type]));
        
        try {
            const res = await fetch('api.php', { method: 'POST', body: fd });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.success) {
                UI.showToast('Enregistré avec succès');
                isDirty = false;
                // Si c'est structurel (news/artworks), on recharge pour rafraichir
                if (['news', 'artworks'].includes(type)) await loadAllData();
            } else {
                UI.showToast(data.error || 'Erreur inconnue', true);
            }
        } catch(e) {
            UI.showToast('Erreur réseau.', true);
        } finally {
            saveBtns.forEach(btn => { btn.disabled = false; btn.innerHTML = btn._oldContent || 'Enregistrer'; });
        }
    }

    async function handleFileUpload(inputElement, sectionName = '', options = {}) {
        // Accepts a Blob (covers File and cropper-output blobs), or a standard <input type="file">.
        const rawFile = (inputElement instanceof Blob) ? inputElement : (inputElement.files ? inputElement.files[options.index || 0] : null);
        if (!rawFile) return null;

        const isDom = inputElement instanceof HTMLElement;
        const label = isDom ? (inputElement.closest('label') || inputElement.parentNode) : null;
        const textSpan = label ? (label.querySelector('span') || label) : null;
        const oldHtml = textSpan ? textSpan.innerHTML : '';

        if (textSpan && !options.silent) {
            textSpan.innerHTML = '<span class="animate-pulse">Traitement...</span>';
        }

        try {
            const compressedBlob = await compressImage(rawFile, 1600, 1600, 0.8);
            const fd = new FormData();
            fd.append('action', 'upload_image');
            fd.append('csrf_token', csrfToken);
            if (sectionName) fd.append('section', sectionName);

            // Blobs from the cropper have no .name — fall back to a generic one.
            const baseName = (rawFile.name || options.filename || 'cropped.webp').replace(/\.[^/.]+$/, '');
            const fileName = baseName + '.webp';
            fd.append('image', compressedBlob, fileName);
            
            const res = await fetch('api.php', { method: 'POST', body: fd });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            
            if (data.success) {
                if (textSpan && !options.silent) textSpan.innerHTML = oldHtml;
                return bustCacheFresh(data.url);
            } else {
                UI.showToast(data.error, true);
                if (textSpan && !options.silent) textSpan.innerHTML = oldHtml;
                return null;
            }
        } catch(e) {
            console.error("Upload error details:", e);
            UI.showToast('Erreur upload : ' + (e.message || 'réseau'), true);
            if (textSpan && !options.silent) textSpan.innerHTML = oldHtml;
            return null;
        } finally {
            if (isDom && !options.skipReset) {
                inputElement.value = '';
            }
        }
    }

    async function handlePdfUpload(inputElement) {
        const rawFile = (inputElement instanceof File) ? inputElement : (inputElement.files ? inputElement.files[0] : null);
        if (!rawFile) return null;

        const isDom = inputElement instanceof HTMLElement;
        const label = isDom ? (inputElement.closest('label') || inputElement.parentNode) : null;
        const textSpan = label ? (label.querySelector('span') || label) : null;
        const oldHtml = textSpan ? textSpan.innerHTML : '';

        if (textSpan) {
            textSpan.innerHTML = '<span class="animate-pulse">Upload PDF...</span>';
        }

        try {
            const fd = new FormData();
            fd.append('action', 'upload_pdf');
            fd.append('csrf_token', csrfToken);
            fd.append('pdf', rawFile);

            const res = await fetch('api.php', { method: 'POST', body: fd });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            if (data.success) {
                if (textSpan) textSpan.innerHTML = oldHtml;
                return bustCacheFresh(data.url);
            } else {
                UI.showToast(data.error || 'Erreur upload PDF', true);
                if (textSpan) textSpan.innerHTML = oldHtml;
                return null;
            }
        } catch (e) {
            console.error("PDF Upload error", e);
            UI.showToast('Erreur réseau upload PDF.', true);
            if (textSpan) textSpan.innerHTML = oldHtml;
            return null;
        } finally {
            if (isDom) inputElement.value = '';
        }
    }

    async function compressImage(file, maxWidth, maxHeight, quality) {
        return new Promise((resolve) => {
            if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return resolve(file);
            
            const timeout = setTimeout(() => {
                console.warn("Compression timeout, using original file");
                resolve(file);
            }, 5000);

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onerror = () => {
                    clearTimeout(timeout);
                    resolve(file);
                };
                img.onload = () => {
                    clearTimeout(timeout);
                    let w = img.width, h = img.height;
                    if (w > h) { if (w > maxWidth) { h *= maxWidth / w; w = maxWidth; } }
                    else { if (h > maxHeight) { w *= maxHeight / h; h = maxHeight; } }
                    const canvas = document.createElement('canvas');
                    canvas.width = w; canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    canvas.toBlob(blob => resolve(blob || file), 'image/webp', quality);
                };
                img.src = e.target.result;
            };
            reader.onerror = () => {
                clearTimeout(timeout);
                resolve(file);
            };
            reader.readAsDataURL(file);
        });
    }

    return {
        checkAuth, logout, loadAllData, saveData, handleFileUpload, handlePdfUpload, SPINNER_SVG
    };
})();
