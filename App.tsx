
import React, { Suspense, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoSection from './components/VideoSection';
import ArticleSection from './components/ArticleSection';
import EcosystemSection from './components/EcosystemSection';
import Footer from './components/Footer';
import { Loader2 } from 'lucide-react';
import { useThemeLanguage } from './context/ThemeLanguageContext';

// OPTIMISATION VERCEL : Lazy loading du composant 3D lourd (Three.js)
// Cela réduit considérablement la taille du bundle initial (First Load JS)
const BlackHoleSection = React.lazy(() => import('./components/BlackHoleSection'));

const App: React.FC = () => {
  const { t, language } = useThemeLanguage();

  // React 19: Manually update html lang attribute as it is outside the root
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <main className="relative w-full overflow-hidden bg-white dark:bg-eh-black transition-colors duration-500">
      {/* React 19 Native Metadata Support */}
      <title>Event Horizon - L'Industrie Spatiale Européenne</title>
      <meta name="description" content={t('footer_desc')} />
      <meta name="theme-color" content="#0a0a0a" />

      {/* Cinematic Noise Overlay 
          Z-INDEX STRATEGY: 
          z-30: Placed above Background/Hero (z-0 to z-20) and Content (z-10), 
          but BELOW Header (z-50) and Modals (z-10000).
          This keeps the UI crisp and accessible while maintaining the film look on the atmosphere.
      */}
      <div className="fixed inset-0 z-30 pointer-events-none opacity-[0.05] mix-blend-overlay">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        ></div>
      </div>

      <Header />
      <Hero />
      
      {/* 
        Adjusted negative margin to -mt-20 to pull the white/black card up over the 90vh Hero.
        This ensures consistent overlap and visual flow.
        z-10 places content under the Noise (z-30) for cinematic integration.
      */}
      <div className="relative z-10 bg-white dark:bg-eh-black rounded-t-[3rem] -mt-20 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] transition-colors duration-500">
        <VideoSection />
        <ArticleSection />
        <EcosystemSection />
        
        <Suspense fallback={
          <section className="pt-0 md:pt-0 pb-16 md:pb-24 max-w-[1800px] mx-auto px-4 md:px-12">
            {/* Title Skeleton */}
            <div className="mb-12 border-l-4 border-gray-200 dark:border-white/10 pl-6 -ml-4 md:ml-0">
                <div className="h-10 w-64 bg-gray-200 dark:bg-white/5 rounded mb-4 animate-pulse"></div>
                <div className="h-6 w-96 bg-gray-100 dark:bg-white/5 rounded animate-pulse"></div>
            </div>
            
            {/* Main Viewport Skeleton matching aspect ratio of the 3D component */}
            <div className="mb-12 relative w-full aspect-square md:aspect-[21/9] bg-gray-100 dark:bg-black rounded-[2rem] border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-lg">
                <div className="flex flex-col items-center gap-4 text-gray-400 dark:text-white/50">
                    <Loader2 className="animate-spin w-8 h-8" />
                    <span className="text-xs font-mono tracking-widest uppercase">{t('bh_loading')}</span>
                </div>
            </div>
            
            {/* Controls Skeleton */}
            <div className="bg-white dark:bg-eh-gray p-8 rounded-[2rem] border border-gray-200 dark:border-white/5 h-64 animate-pulse"></div>
          </section>
        }>
           <BlackHoleSection />
        </Suspense>
        
        <Footer />
      </div>
    </main>
  );
};

export default App;
