import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import Hero from './components/Hero';
import VideoSection from './components/VideoSection';
import ArticleSection from './components/ArticleSection';
import EcosystemSection from './components/EcosystemSection';
import Footer from './components/Footer';
import ReloadPrompt from './components/ReloadPrompt';
import SimulationPage from './components/pages/SimulationPage';
import SmoothScroll from './components/SmoothScroll';

import { useThemeLanguage } from './context/ThemeLanguageContext';
import { useCinematic } from './context/CinematicContext';

const GlobalLoader = ({ isLoaded }: { isLoaded: boolean }) => (
  <AnimatePresence>
    {!isLoaded && (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-t-2 border-white/20 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-2 border-white/40 rounded-full animate-spin-reverse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold tracking-[0.3em] text-white uppercase">Event Horizon</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">System Initialization</span>
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const { t, language, isLoaded } = useThemeLanguage();
  const { isCinematic } = useCinematic();

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <SmoothScroll>
          <GlobalLoader isLoaded={isLoaded} />
          <ReloadPrompt />

          <main id="main-content" className="relative w-full overflow-hidden bg-white dark:bg-eh-black transition-colors duration-500">
            <Helmet htmlAttributes={{ lang: language }}>
              <title>{t('meta_title')}</title>
              <meta name="description" content={t('meta_description')} />
              <meta property="og:title" content={t('meta_og_title')} />
              <meta property="og:description" content={t('meta_description')} />
              <meta name="theme-color" content="#0a0a0a" />
            </Helmet>

            <Routes>
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/" element={
                <>
                  <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
                    <Header />
                    <Hero />
                    <main>
                      <section id="videos" className="py-20 bg-gray-50 dark:bg-zinc-900 transition-colors duration-500">
                        <VideoSection />
                      </section>
                      <section id="articles" className="py-20 bg-white dark:bg-black transition-colors duration-500">
                        <ArticleSection />
                      </section>
                      <section id="ecosystem" className="py-20 bg-gray-50 dark:bg-zinc-900 transition-colors duration-500">
                        <EcosystemSection />
                      </section>
                    </main>
                    <Footer />
                  </div>
                </>
              } />
            </Routes>
          </main>
        </SmoothScroll>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
