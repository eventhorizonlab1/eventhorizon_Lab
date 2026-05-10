import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useJsonData } from '../hooks/useJsonData';
import { getAlt, getSrc, isVisible, type ImageEntry } from '../lib/imageAlt';

// Convention: each Hero image has a paired <name>_mobile.webp at ≤800px wide.
// scripts/convert_hero_mobile.mjs regenerates them. If a freshly uploaded image
// has no mobile variant, the browser falls back to the main src silently.
const mobileVariantOf = (src: string) => src.replace(/(\.[a-z0-9]+)(\?.*)?$/i, '_mobile$1$2');

export default function Hero() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = (useJsonData<ImageEntry[]>('hero') ?? []).filter(isVisible);

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [images.length]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const currentEntry = images[currentImageIndex];
  const currentSrc = currentEntry ? getSrc(currentEntry) : '';

  return (
    <section ref={ref} aria-label={t.hero.subtitle} className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0 bg-white"
      >
        <AnimatePresence>
          {images.length > 0 && currentEntry && (
            <motion.img
              key={currentImageIndex}
              src={currentSrc}
              srcSet={`${mobileVariantOf(currentSrc)} 800w, ${currentSrc} 1920w`}
              sizes="100vw"
              alt={getAlt(currentEntry, language, '')}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.2, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover grayscale"
              fetchPriority={currentImageIndex === 0 ? 'high' : 'auto'}
              referrerPolicy="no-referrer"
            />
          )}
        </AnimatePresence>
      </motion.div>
      
      <div className="relative z-10 text-center text-black px-6">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter mb-4 md:mb-6"
        >
          Onesiker
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-base sm:text-lg md:text-xl font-light tracking-widest uppercase max-w-2xl mx-auto text-gray-600 px-4"
        >
          {t.hero.subtitle}
        </motion.p>
      </div>
    </section>
  );
}
