// ============================================================================
// UI & UTILITAIRES (Module UI)
// ============================================================================

window.UI = (function() {

    // ── Toast Notification ──────────────────────────────────────────────────
    function showToast(message, isError = false) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast-item ${isError ? 'toast-error' : 'toast-success'}`;
        
        const icon = isError 
            ? '<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>'
            : '<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>';

        toast.innerHTML = icon + '<span>' + escHtml(message) + '</span>';

        // Animation entrée
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        container.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });

        // Auto-dismiss
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // ── Loading Overlay (avec skeleton optionnel) ────────────────────────────
    function showLoadingOverlay(show) {
        let overlay = document.getElementById('admin-loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'admin-loading-overlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner"></div>
                <p class="loading-text">Chargement…</p>
            `;
            document.body.appendChild(overlay);
        }
        overlay.style.opacity = show ? '1' : '0';
        overlay.style.pointerEvents = show ? 'all' : 'none';
    }

    // ── Skeleton Loading ────────────────────────────────────────────────────
    function renderSkeleton(container, count = 3, type = 'card') {
        let html = '';
        for (let i = 0; i < count; i++) {
            if (type === 'card') {
                html += `<div class="skeleton-card">
                    <div class="skeleton-img skeleton-shimmer"></div>
                    <div class="skeleton-line skeleton-shimmer" style="width:70%"></div>
                    <div class="skeleton-line skeleton-shimmer" style="width:50%"></div>
                </div>`;
            } else {
                html += `<div class="skeleton-row">
                    <div class="skeleton-circle skeleton-shimmer"></div>
                    <div style="flex:1">
                        <div class="skeleton-line skeleton-shimmer" style="width:60%"></div>
                        <div class="skeleton-line skeleton-shimmer" style="width:40%;margin-top:8px"></div>
                    </div>
                </div>`;
            }
        }
        if (typeof container === 'string') container = document.getElementById(container);
        if (container) container.innerHTML = html;
    }

    // ── Confirmation Modal Custom (remplace confirm()) ──────────────────────
    function confirmAction(title, message, confirmText = 'Confirmer', style = 'danger') {
        return new Promise((resolve) => {
            // Supprimer tout précédent
            const existing = document.getElementById('confirm-modal');
            if (existing) existing.remove();

            const btnClass = style === 'danger' ? 'confirm-btn-danger' : 'confirm-btn-primary';

            const modal = document.createElement('div');
            modal.id = 'confirm-modal';
            modal.className = 'confirm-overlay';
            modal.innerHTML = `
                <div class="confirm-dialog">
                    <div class="confirm-icon ${style === 'danger' ? 'confirm-icon-danger' : 'confirm-icon-info'}">
                        ${style === 'danger' 
                            ? '<svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>'
                            : '<svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'}
                    </div>
                    <h3 class="confirm-title">${escHtml(title)}</h3>
                    <p class="confirm-message">${escHtml(message)}</p>
                    <div class="confirm-actions">
                        <button type="button" class="confirm-btn-cancel" data-confirm="cancel">Annuler</button>
                        <button type="button" class="${btnClass}" data-confirm="ok">${escHtml(confirmText)}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Animation d'entrée
            requestAnimationFrame(() => modal.classList.add('confirm-visible'));

            function handleClick(e) {
                const btn = e.target.closest('[data-confirm]');
                if (!btn) return;
                const result = btn.dataset.confirm === 'ok';
                modal.classList.remove('confirm-visible');
                setTimeout(() => { modal.remove(); resolve(result); }, 200);
            }

            modal.addEventListener('click', (e) => {
                // Clic en dehors = annuler
                if (e.target === modal) {
                    modal.classList.remove('confirm-visible');
                    setTimeout(() => { modal.remove(); resolve(false); }, 200);
                    return;
                }
                handleClick(e);
            });
        });
    }

    // ── Empty State réutilisable ────────────────────────────────────────────
    function emptyState(message, cta = '') {
        return `<div class="empty-state">
            <svg class="empty-state-icon" viewBox="0 0 80 80" fill="none">
                <rect x="12" y="20" width="56" height="40" rx="6" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 32h56M28 20v-8a4 4 0 014-4h16a4 4 0 014 4v8" stroke="currentColor" stroke-width="2"/>
                <circle cx="40" cy="42" r="6" stroke="currentColor" stroke-width="2"/>
                <path d="M34 42h-10M46 42h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p class="empty-state-text">${message}</p>
            ${cta ? `<p class="empty-state-cta">${cta}</p>` : ''}
        </div>`;
    }

    // ── Modals ──────────────────────────────────────────────────────────────
    function openModal(title, html, onSubmit) {
        const modal = document.getElementById('modal');
        const titleEl = document.getElementById('modal-title');
        const fieldsEl = document.getElementById('form-fields');
        const form = document.getElementById('edit-form');

        if (!modal || !titleEl || !fieldsEl || !form) return;

        titleEl.innerText = title;
        fieldsEl.innerHTML = html;
        form.onsubmit = onSubmit;
        
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = document.getElementById('modal');
        if (modal) modal.classList.add('hidden');
        document.body.style.overflow = '';
        editingItemIndex = null;
        editingCategoryIndex = null;
    }

    // ── Traduction ──────────────────────────────────────────────────────────
    async function translateText(text, sl='fr', tl='en') {
        if (!text || !text.trim()) return '';

        try {
            const fd = new FormData();
            fd.append('action', 'translate');
            fd.append('csrf_token', csrfToken);
            fd.append('text', text);
            fd.append('sl', sl);
            fd.append('tl', tl);

            const res = await fetch('api.php', { method: 'POST', body: fd });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();

            if (json.translated) return json.translated;

            console.error('Proxy translate error:', json.error);
            UI.showToast('Erreur traduction : ' + (json.error || 'inconnue'), true);
        } catch(e) {
            console.error('translateText failed', e);
            UI.showToast('Erreur réseau lors de la traduction.', true);
        }

        return text;
    }

    // ── Gestion des onglets ─────────────────────────────────────────────────
    async function switchTab(tab, bypassCheck = false) {
        if (!bypassCheck && isDirty) {
            const confirmed = await UI.confirmAction(
                'Modifications non sauvegardées',
                'Vous avez des changements non enregistrés. Voulez-vous changer d\'onglet\u00a0?',
                'Continuer sans sauvegarder', 'danger'
            );
            if (!confirmed) return;
            isDirty = false;
        }

        activeTab = tab;
        localStorage.setItem('adminActiveTab', tab);

        // UI Tabs
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('button[data-tab]').forEach(el => {
            el.classList.remove('tab-active', 'text-black', 'bnav-active');
            el.classList.add('text-gray-500');
        });

        const tabEl = document.getElementById(`${tab}-tab`);
        if (tabEl) tabEl.classList.remove('hidden');

        const activeBtns = document.querySelectorAll(`button[data-tab="${tab}"]`);
        activeBtns.forEach(btn => {
            btn.classList.add(btn.closest('#bottom-nav') ? 'bnav-active' : 'tab-active', 'text-black');
            btn.classList.remove('text-gray-500');
        });

        // Mise à jour titre topbar
        const topbarTitle = document.getElementById('topbar-title');
        if (topbarTitle && tabEl) {
            topbarTitle.textContent = tabEl.dataset.title || tab;
        }

        // Mise à jour breadcrumb desktop
        const breadcrumb = document.getElementById('desktop-breadcrumb');
        if (breadcrumb && tabEl) {
            breadcrumb.textContent = tabEl.dataset.title || tab;
        }

        // Trigger loading/rendering specific to tab
        if (tab === 'media') MediaModule.loadList();
        if (tab === 'layout') LayoutModule.render();
        if (tab === 'dashboard') renderDashboard();
    }

    function renderDashboard() {
        const container = document.getElementById('dashboard-kpis');
        if (!container) return;

        const totalArtworks = (currentData.artworks || []).reduce((acc, cat) => acc + (cat.images ? cat.images.length : 0), 0);
        const totalNews = (currentData.news || []).length;
        const totalMedia = window.MediaModule && window.MediaModule.cachedList ? window.MediaModule.cachedList.length : '--';
        const totalSections = (currentData.layout || []).filter(s => s.visible).length;

        container.innerHTML = `
            <div class="card p-6 flex flex-col items-center justify-center">
                <span class="text-4xl font-display font-bold text-white mb-2">${totalArtworks}</span>
                <span class="text-xs text-gray-500 uppercase tracking-widest">Œuvres</span>
            </div>
            <div class="card p-6 flex flex-col items-center justify-center">
                <span class="text-4xl font-display font-bold text-white mb-2">${totalNews}</span>
                <span class="text-xs text-gray-500 uppercase tracking-widest">Actus</span>
            </div>
            <div class="card p-6 flex flex-col items-center justify-center">
                <span class="text-4xl font-display font-bold text-white mb-2">${totalSections}</span>
                <span class="text-xs text-gray-500 uppercase tracking-widest">Sections</span>
            </div>
            <div class="card p-6 flex flex-col items-center justify-center">
                <span class="text-4xl font-display font-bold text-white mb-2">${totalMedia}</span>
                <span class="text-xs text-gray-500 uppercase tracking-widest">Médias</span>
            </div>
        `;
    }

    function renderAll() {
        if (window.NewsModule) NewsModule.render();
        if (window.ArtworksModule) ArtworksModule.render();
        if (window.PagesModule) {
            PagesModule.render('hero');
            PagesModule.render('boutique');
            PagesModule.render('bio');
            PagesModule.render('contact');
        }
        if (window.LayoutModule) LayoutModule.render();
        
        renderDashboard();
        switchTab(activeTab, true);
    }

    return {
        showToast,
        showLoadingOverlay,
        renderSkeleton,
        confirmAction,
        emptyState,
        openModal,
        closeModal,
        translateText,
        switchTab,
        renderAll
    };
})();
