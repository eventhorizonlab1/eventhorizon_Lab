
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Image as ImageIcon, Loader2, Atom, Orbit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useThemeLanguage } from '../context/ThemeLanguageContext';

// -- COMPOSANT DE CHARGEMENT COSMIQUE AVANCÉ (SPIRAL GALAXY) --
const CosmicLoader = () => {
  const [loadingPhase, setLoadingPhase] = useState(0);
  
  const phases = [
    "INITIALISATION DU SYSTÈME...",
    "CALIBRAGE DES CAPTEURS QUANTIQUES...",
    "SYNTHÈSE DE LA MATIÈRE...",
    "RENDU HAUTE RÉSOLUTION...",
    "FINALISATION..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingPhase((prev) => (prev + 1) % phases.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] relative overflow-hidden bg-black rounded-[2rem] border border-white/10 shadow-2xl">
      
      {/* 1. Fond dynamique (Deep Space) */}
      <motion.div 
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-black"
      />
      
      {/* 2. Galaxie Spirale CSS */}
      <div className="relative flex items-center justify-center w-64 h-64 mb-8 perspective-1000">
          <motion.div 
            className="relative w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformStyle: "preserve-3d", rotateX: "60deg" }}
          >
             {/* Core */}
             <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full blur-md -translate-x-1/2 -translate-y-1/2 shadow-[0_0_30px_white] z-10" />
             
             {/* Spiral Arms - Generated with CSS Gradients/Masks logic simulated via divs */}
             {[...Array(3)].map((_, i) => (
               <motion.div
                 key={i}
                 className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full border-t-2 border-l-2 border-transparent"
                 style={{ 
                    borderColor: i === 0 ? 'rgba(100, 200, 255, 0.4)' : 'rgba(200, 100, 255, 0.4)',
                    borderTopColor: i === 0 ? 'rgba(100, 200, 255, 0.8)' : 'rgba(200, 100, 255, 0.8)',
                    rotate: `${i * 120}deg`,
                    x: "-50%",
                    y: "-50%"
                 }}
               />
             ))}

             {/* Star Particles in Orbit */}
             {[...Array(40)].map((_, i) => {
                 const radius = 30 + Math.random() * 100;
                 const angle = Math.random() * 360;
                 const size = Math.random() * 3;
                 return (
                    <motion.div 
                       key={`star-${i}`}
                       className="absolute top-1/2 left-1/2 rounded-full bg-white"
                       style={{ 
                           width: size, 
                           height: size,
                           x: radius * Math.cos(angle * Math.PI / 180),
                           y: radius * Math.sin(angle * Math.PI / 180),
                           opacity: Math.random()
                       }}
                       animate={{ 
                           scale: [1, 1.5, 1],
                           opacity: [0.4, 1, 0.4]
                       }}
                       transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                    />
                 )
             })}
          </motion.div>
      </div>

      {/* 3. Indicateur textuel style HUD */}
      <div className="relative z-20 flex flex-col items-center gap-3 bg-black/50 backdrop-blur-md px-8 py-4 rounded-xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Loader2 className="animate-spin" size={14} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">NEURAL NET ACTIVE</span>
        </div>
        
        <div className="h-6 relative overflow-hidden flex justify-center items-center w-72 text-center">
            <AnimatePresence mode='wait'>
            <motion.p 
                key={loadingPhase}
                initial={{ y: 10, opacity: 0, filter: "blur(2px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -10, opacity: 0, filter: "blur(2px)" }}
                transition={{ duration: 0.3 }}
                className="text-sm font-bold uppercase tracking-[0.15em] text-white whitespace-nowrap"
            >
                {phases[loadingPhase]}
            </motion.p>
            </AnimatePresence>
        </div>
        
        {/* Barre de progression glitch */}
        <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden relative mt-2">
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
      </div>
    </div>
  );
};

const ImageGenSection: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useThemeLanguage();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const styleKeywords = [
        "nebula", 
        "galaxy", 
        "cosmic dust", 
        "shimmering stars", 
        "deep space", 
        "European Space Agency style", 
        "cinematic lighting", 
        "photorealistic", 
        "highly detailed", 
        "space industry aesthetic", 
        "8k resolution", 
        "dramatic atmosphere",
        "volumetric lighting",
        "vertical composition"
      ];

      const enhancedPrompt = `${prompt}, ${styleKeywords.join(", ")}`;

      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: enhancedPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '9:16',
        },
      });

      const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
      
      if (base64ImageBytes) {
        setGeneratedImage(`data:image/jpeg;base64,${base64ImageBytes}`);
      } else {
        throw new Error("No image returned");
      }
    } catch (err: any) {
      console.error("Generation Error:", err);
      
      let msgKey = 'studio_error_generic';
      const errorText = (err.message || err.toString()).toLowerCase();

      if (errorText.includes('safety') || errorText.includes('filter') || errorText.includes('block')) {
        msgKey = 'studio_error_safety';
      } else if (errorText.includes('quota') || errorText.includes('429') || errorText.includes('resource exhausted')) {
        msgKey = 'studio_error_quota';
      } else if (errorText.includes('timeout') || errorText.includes('deadline exceeded')) {
        msgKey = 'studio_error_timeout';
      }

      setError(t(msgKey));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="studio" className="py-24 px-4 md:px-12 max-w-[1800px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left: Controls */}
        <div className="sticky top-24">
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-black dark:text-white transition-colors">
              {t('studio_title')}
            </h2>
            <p className="text-gray-500 text-lg max-w-md">
              {t('studio_desc')}
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-eh-gray p-8 rounded-[2rem] relative overflow-hidden transition-colors duration-500">
            <div className="relative z-10">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                {t('studio_label')}
              </label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('studio_placeholder')}
                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white/30 transition-colors min-h-[120px] resize-none mb-6"
              />
              
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full py-4 rounded-full font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                  isGenerating || !prompt.trim()
                    ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <span className="relative flex h-3 w-3 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
                    </span>
                    <span>{t('studio_btn_generating')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>{t('studio_btn_generate')}</span>
                  </>
                )}
              </button>
              
              {error && (
                <p className="mt-4 text-red-500 dark:text-red-400 text-sm font-bold text-center animate-pulse">
                  {error}
                </p>
              )}
            </div>

             {/* Abstract decorative circle - tweaked for light/dark */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gray-200 dark:bg-white/5 rounded-full blur-3xl pointer-events-none transition-colors"></div>
          </div>
        </div>

        {/* Right: Display - Adjusted for Vertical Aspect Ratio (9:16) */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md aspect-[9/16] rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-eh-gray flex items-center justify-center group shadow-2xl transition-colors duration-500">
            {generatedImage ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-full"
              >
                <img 
                  src={generatedImage} 
                  alt="Generated Space Concept" 
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a 
                    href={generatedImage} 
                    download={`event-horizon-studio-${Date.now()}.jpg`}
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    <Download size={16} />
                    {t('studio_download')}
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center text-gray-400 dark:text-gray-600 gap-4 p-6 text-center w-full h-full justify-center">
                {isGenerating ? (
                   <CosmicLoader />
                ) : (
                  <>
                    <ImageIcon size={48} strokeWidth={1} className="opacity-50" />
                    <p className="text-sm font-medium">{t('studio_empty')}</p>
                  </>
                )}
              </div>
            )}
            
            {/* Corner accents */}
            {!isGenerating && (
              <>
                <div className="absolute top-6 left-6 w-2 h-2 bg-gray-300 dark:bg-white/20 rounded-full"></div>
                <div className="absolute top-6 right-6 w-2 h-2 bg-gray-300 dark:bg-white/20 rounded-full"></div>
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-gray-300 dark:bg-white/20 rounded-full"></div>
                <div className="absolute bottom-6 right-6 w-2 h-2 bg-gray-300 dark:bg-white/20 rounded-full"></div>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ImageGenSection;
