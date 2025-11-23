
import React, { Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoSection from './components/VideoSection';
import ArticleSection from './components/ArticleSection';
import EcosystemSection from './components/EcosystemSection';
import Footer from './components/Footer';
import { Loader2 } from 'lucide-react';

// OPTIMISATION VERCEL : Lazy loading du composant 3D lourd (Three.js)
// Cela réduit considérablement la taille du bundle initial (First Load JS)
const BlackHoleSection = React.lazy(() => import('./components/BlackHoleSection'));

const App: React.FC = () => {
  return (
    <main className="relative w-full overflow-hidden bg-white dark:bg-eh-black transition-colors duration-500">
      {/* Cinematic Noise Overlay */}
      <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.05] mix-blend-overlay">
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
      */}
      <div className="relative z-10 bg-white dark:bg-eh-black rounded-t-[3rem] -mt-20 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] transition-colors duration-500">
        <VideoSection />
        <ArticleSection />
        <EcosystemSection />
        
        <Suspense fallback={
          <div className="h-[600px] flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-4 text-white/50">
               <Loader2 className="animate-spin w-8 h-8" />
               <span className="text-xs font-mono tracking-widest uppercase">Initialisation de la Singularité...</span>
            </div>
          </div>
        }>
           <BlackHoleSection />
        </Suspense>
        
        <Footer />
      </div>
    </main>
  );
};

export default App;
