// ============================================================================
// MODULE MÉDIAS (MediaModule) — Gestionnaire de fichiers uploadés
// ============================================================================

window.MediaModule = (function() {

    async function loadList() {
        const grid = document.getElementById('media-grid');
        if (!grid) return;

        grid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <svg class="animate-spin h-10 w-10 mb-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span class="text-sm font-bold uppercase tracking-widest">Chargement de la bibliothèque…</span>
            </div>`;

        try {
            const res = await fetch('api.php?action=list_media&t=' + Date.now());
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            renderGrid(data);
        } catch (e) {
            console.error('Erreur loadMediaList:', e);
            grid.innerHTML = `
                <div class="col-span-full bg-red-50 border border-red-100 rounded-xl p-8 text-center">
                    <p class="text-red-500 font-bold mb-2">Erreur lors du chargement des médias</p>
                    <p class="text-red-400 text-sm">${e.message || 'Problème de connexion au serveur.'}</p>
                    <button data-action="load-media" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold uppercase tracking-wider">Réessayer</button>
                </div>`;
        }
    }

    function renderGrid(data) {
        const grid = document.getElementById('media-grid');
        const stats = document.getElementById('media-stats');
        const purgeBtn = document.getElementById('media-purge-btn');
        if (!grid) return;

        // ── Stats ─────────────────────────────────────────────────────────────
        if (stats) {
            stats.innerHTML = `
                <div class="flex flex-wrap gap-3 items-center">
                    <div class="flex items-center gap-2 card px-3 py-1.5 rounded-lg border border-gray-800 shadow-sm">
                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-500">Total</span>
                        <span class="text-sm font-bold text-white">${data.total}</span>
                    </div>
                    <div class="flex items-center gap-2 card px-3 py-1.5 rounded-lg border border-gray-800 shadow-sm">
                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-500">Poids</span>
                        <span class="text-sm font-bold text-white">${formatSize(data.total_size)}</span>
                    </div>
                    ${data.orphans > 0 ? `
                    <div class="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg border border-red-500 shadow-sm animate-pulse">
                        <span class="text-[10px] font-black uppercase tracking-widest text-red-400">Orphelins</span>
                        <span class="text-sm font-bold text-red-500">${data.orphans}</span>
                    </div>` : `
                    <div class="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 shadow-sm">
                        <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        <span class="text-[10px] font-black uppercase tracking-widest text-green-400">Nettoyé</span>
                    </div>`}
                </div>`;
        }

        // ── Purge Button ──────────────────────────────────────────────────────
        if (purgeBtn) {
            if (data.orphans > 0) {
                purgeBtn.classList.remove('hidden');
                purgeBtn.onclick = () => purgeOrphans(data.files.filter(f => !f.used));
            } else {
                purgeBtn.classList.add('hidden');
            }
        }

        // ── Files Grid ────────────────────────────────────────────────────────
        if (!data.files || data.files.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-20 text-center text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"/>
                    </svg>
                    <p class="font-bold uppercase tracking-widest text-xs">Aucun média trouvé</p>
                </div>`;
            return;
        }

        grid.innerHTML = data.files.map(f => renderCard(f)).join('');
    }

    function renderCard(file) {
        const isImage = ['webp', 'jpg', 'jpeg', 'png', 'gif'].includes(file.ext);
        const isPdf = file.ext === 'pdf';
        const used = file.used;

        return `
            <div class="group relative card rounded-xl border ${used ? 'border-gray-800' : 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]'} overflow-hidden transition-all hover:shadow-md">
                <!-- Thumbnail Area -->
                <div class="aspect-square bg-hover flex items-center justify-center overflow-hidden relative">
                    ${isImage ? `
                        <img src="${bustCache(file.url)}" class="w-full h-full object-cover transition-transform group-hover:scale-110">
                    ` : `
                        <div class="flex flex-col items-center">
                            <svg class="w-12 h-12 ${isPdf ? 'text-red-400' : 'text-gray-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                            </svg>
                            <span class="text-[8px] font-black uppercase tracking-widest mt-1 ${isPdf ? 'text-red-500' : 'text-gray-500'}">${file.ext}</span>
                        </div>
                    `}

                    <!-- Hover Actions Overlay -->
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <a href="${file.url}" target="_blank" class="p-2 card/20 hover:card/40 rounded-full text-white backdrop-blur-sm transition-all" title="Voir en grand">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </a>
                        ${!used ? `
                        <button data-action="delete-media" data-filename="${file.name.replace(/'/g, "\\'").replace(/"/g, '&quot;')}" class="p-2 bg-red-500/20 hover:bg-red-500 hover:text-white0/80 rounded-full text-white backdrop-blur-sm transition-all" title="Supprimer">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>` : ''}
                    </div>
                </div>

                <!-- Info Area -->
                <div class="p-2 text-[10px]">
                    <p class="font-mono text-gray-500 truncate mb-1" title="${file.name}">${file.name}</p>
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-gray-500 uppercase tracking-tighter">${formatSize(file.size)}</span>
                        ${used ? `
                            <span class="text-green-400 font-bold uppercase tracking-widest text-[8px] bg-green-50 px-1 rounded">Utilisé</span>
                        ` : `
                            <span class="text-red-500 font-bold uppercase tracking-widest text-[8px] bg-red-50 px-1 rounded animate-pulse">Orphelin</span>
                        `}
                    </div>
                </div>
            </div>`;
    }

    async function deleteFile(filename) {
        const confirmed = await UI.confirmAction('Supprimer ce fichier ?', `"${filename}" sera définitivement supprimé.`, 'Supprimer', 'danger');
        if (!confirmed) return;

        try {
            const fd = new FormData();
            fd.append('action', 'delete_media');
            fd.append('csrf_token', csrfToken);
            fd.append('filename', filename);

            const res = await fetch('api.php', { method: 'POST', body: fd });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            if (data.success) {
                UI.showToast('✓ Fichier supprimé');
                loadList();
            } else {
                UI.showToast('⚠️ ' + (data.error || 'Erreur'), true);
            }
        } catch (e) {
            UI.showToast('Erreur réseau.', true);
        }
    }

    async function purgeOrphans(orphans) {
        const confirmed = await UI.confirmAction('Purger les fichiers orphelins ?', `${orphans.length} fichier(s) inutilisé(s) seront supprimés.`, 'Purger', 'danger');
        if (!confirmed) return;
        
        let successCount = 0;
        for (const f of orphans) {
            const fd = new FormData();
            fd.append('action', 'delete_media');
            fd.append('csrf_token', csrfToken);
            fd.append('filename', f.name);
            
            try {
                const res = await fetch('api.php', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.success) successCount++;
            } catch(e) {}
        }
        
        UI.showToast(`✓ ${successCount} fichiers supprimés.`);
        loadList();
    }

    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }

    return {
        loadList: loadList,
        deleteFile: deleteFile,
        purgeOrphans: purgeOrphans
    };
})();
