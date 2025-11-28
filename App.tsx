
import React, { Suspense } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
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

import { useCinematic } from './context/CinematicContext';

const App: React.FC = () => {
  const { t, language } = useThemeLanguage();
  const { isCinematic } = useCinematic();



  return (
    <HelmetProvider>
      <main className="relative w-full overflow-hidden bg-white dark:bg-eh-black transition-colors duration-500">
        <Helmet htmlAttributes={{ lang: language }}>
          <title>{t('meta_title')}</title>
          <meta name="description" content={t('meta_description')} />
          <meta property="og:title" content={t('meta_og_title')} />
          <meta property="og:description" content={t('meta_description')} />
          <meta name="theme-color" content="#0a0a0a" />
        </Helmet>

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
        <div className={`relative ${isCinematic ? 'z-[100]' : 'z-10'} bg-white dark:bg-eh-black rounded-t-[3rem] -mt-20 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] transition-colors duration-500`}>
          <VideoSection />
          <ArticleSection />
          <EcosystemSection />

          <Suspense fallback={
            <section className="pt-0 md:pt-0 pb-16 md:pb-24 max-w-[1800px] mx-auto px-4 md:px-12">
              {/* Title Skeleton - Updated to match BlackHoleSection alignment (pl-3 md:pl-6 and negative margins) */}
              <div className="mb-12 border-l-4 border-gray-200 dark:border-white/10 pl-3 md:pl-6 -ml-4 md:-ml-7">
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

              {/* Mobile Buttons Skeleton (Hidden on Desktop) to prevent CLS */}
              <div className="flex md:hidden justify-center gap-4 mt-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/5 animate-pulse"></div>
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/5 animate-pulse"></div>
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/5 animate-pulse"></div>
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
    </HelmetProvider>
  );
};

export default App;
