import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useJsonData } from '../hooks/useJsonData';
import { getAlt, getSrc, isVisible, type ImageEntry } from '../lib/imageAlt';

export default function Shop() {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = (useJsonData<ImageEntry[]>('boutique') ?? []).filter(isVisible);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [slides.length]);
  
  return (
    <section id="shop" className="py-16 md:py-32 bg-[#fcfcfc]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tighter mb-2 md:mb-4">{t.shop.title}</h2>
          <p className="text-gray-500 uppercase tracking-widest text-xs sm:text-sm">{t.shop.subtitle}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center group"
        >
          <a 
            href="https://onesiker.sumupstore.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full aspect-[4/3] md:aspect-[21/9] relative bg-gray-100 flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl mb-8 group cursor-pointer"
          >
            <AnimatePresence>
              {slides.map((entry, i) =>
                i === currentSlide ? (
                  <motion.img
                    key={getSrc(entry)}
                    src={getSrc(entry)}
                    alt={getAlt(entry, language, t.shop.title)}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : null
              )}
            </AnimatePresence>
            {currentSlide === 2 && slides.length > 0 && (
              <span className="absolute bottom-2 right-3 z-20 text-white/70 text-[10px] sm:text-xs font-medium tracking-wide drop-shadow-md select-none pointer-events-none">
                ©LEVEL UP FILM
              </span>
            )}
          </a>
          
          {/* Content */}
          <a 
            href="https://onesiker.sumupstore.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-black cursor-pointer hover:text-gray-600 transition-colors"
          >
            <span className="text-sm md:text-base font-bold uppercase tracking-widest underline underline-offset-8">{t.shop.enter}</span>
            <ExternalLink size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
