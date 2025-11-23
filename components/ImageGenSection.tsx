
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useThemeLanguage } from '../context/ThemeLanguageContext';

// -- COMPOSANT DE CHARGEMENT COSMIQUE AVANCÉ --
const CosmicLoader = () => {
  const { t } = useThemeLanguage();
  const [loadingPhase, setLoadingPhase] = useState(0);
  
  const phases = [
    "Initialisation des capteurs quantiques...",
    "Alignement des prismes stellaires...",
    "Condensation de la poussière cosmique...",
    "Synthèse des nébuleuses...",
    "Rendu haute résolution..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingPhase((prev) => (prev + 1) % phases.length);
    }, 1200); // Ralentissement pour laisser le temps de lire
    return () => clearInterval(interval);
  }, []);

  // Génération de particules aléatoires pour le champ d'étoiles
  const stars = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 2 + 1,
    delay: Math.random() * 2
  }));

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] relative overflow-hidden bg-black/5 dark:bg-black/20 rounded-[2rem]">
      
      {/* 1. Fond dynamique (Deep Space) */}
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-radial from-indigo-900/20 via-transparent to-transparent blur-3xl"
      />

      {/* 2. Champ d'étoiles scintillant */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{ 
            top: star.top, 
            left: star.left, 
            width: star.size, 
            height: star.size 
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ 
            duration: star.duration, 
            repeat: Infinity, 
            delay: star.delay,
            ease: "easeInOut" 
          }}
        />
      ))}

      {/* 3. La Galaxie en formation (Centre de l'animation) */}
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        
        {/* Noyau Hyper-lumineux */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8], filter: ["blur(4px)", "blur(8px)", "blur(4px)"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-8 h-8 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.8)] z-30"
        />

        {/* Anneau d'accrétion interne (Rapide) */}
        <motion.div
          className="absolute inset-0 border-[3px] border-transparent border-t-cyan-400 border-b-blue-500 rounded-full opacity-80"
          style={{ width: '100%', height: '100%' }}
          animate={{ rotate: 360, scale: [0.9, 1, 0.9] }}
          transition={{ rotate: { duration: 3, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
        />

        {/* Anneau intermédiaire (Moyen + Tilt) */}
        <motion.div
          className="absolute border-[2px] border-transparent border-r-purple-500 border-l-pink-500 rounded-full opacity-60"
          style={{ width: '140%', height: '140%' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />

        {/* Anneau externe (Lent + Particules de poussière) */}
        <motion.div
          className="absolute border-[1px] border-dashed border-white/20 rounded-full"
          style={{ width: '180%', height: '180%' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
           {/* Planètes en orbite */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full blur-[1px]"></div>
        </motion.div>

        {/* Effet de scan vertical */}
        <motion.div 
           className="absolute w-full h-2 bg-blue-500/30 blur-md"
           style={{ width: '200%' }}
           animate={{ top: ['-50%', '150%'] }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* 4. Indicateur textuel style terminal */}
      <div className="relative z-20 flex flex-col items-center space-y-2">
        <div className="h-6 overflow-hidden relative flex justify-center items-center w-full px-4 text-center">
            <AnimatePresence mode='wait'>
            <motion.p 
                key={loadingPhase}
                initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
                transition={{ duration: 0.4 }}
                className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300 whitespace-nowrap"
            >
                {phases[loadingPhase]}
            </motion.p>
            </AnimatePresence>
        </div>
        
        {/* Barre de progression indéterminée */}
        <div className="w-32 h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
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
      
      // Construct a rich prompt with specific cosmic keywords for impactful visuals
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
