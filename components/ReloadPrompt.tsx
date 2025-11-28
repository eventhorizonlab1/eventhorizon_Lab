import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { RefreshCw, X } from 'lucide-react';

const ReloadPrompt: React.FC = () => {
    const { t } = useThemeLanguage();
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    if (!offlineReady && !needRefresh) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] p-4 bg-white dark:bg-eh-black border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl flex flex-col gap-3 max-w-xs animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                        {offlineReady ? 'App ready to work offline' : 'New content available'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {offlineReady
                            ? 'Event Horizon is now cached for offline use.'
                            : 'Click reload to update to the latest version.'}
                    </p>
                </div>
                <button onClick={close} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                    <X size={16} />
                </button>
            </div>

            {needRefresh && (
                <button
                    onClick={() => updateServiceWorker(true)}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
                >
                    <RefreshCw size={14} className="animate-spin-slow" />
                    Reload
                </button>
            )}
        </div>
    );
};

export default ReloadPrompt;
