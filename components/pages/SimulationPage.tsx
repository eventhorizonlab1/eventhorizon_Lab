import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

// Lazy load BlackHoleSection
const BlackHoleSection = React.lazy(() => import('../BlackHoleSection'));

const SimulationPage: React.FC = () => {
    const { t } = useThemeLanguage();

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {/* Back Button */}
            <Link
                to="/"
                className="absolute top-6 left-6 z-[1000] flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white font-bold uppercase tracking-widest text-xs transition-all hover:scale-105"
            >
                <ArrowLeft size={16} />
                <span>{t('common_back') || 'Back to Home'}</span>
            </Link>

            {/* Simulation Container */}
            <Suspense fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 gap-4">
                    <Loader2 className="animate-spin w-10 h-10" />
                    <span className="text-sm font-mono tracking-[0.2em] uppercase">Initializing Singularity...</span>
                </div>
            }>
                <BlackHoleSection />
            </Suspense>
        </div>
    );
};

export default SimulationPage;
