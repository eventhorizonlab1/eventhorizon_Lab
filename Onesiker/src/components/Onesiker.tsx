import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useJsonData } from '../hooks/useJsonData';

export default function Onesiker() {
  const { t, language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const bioData = useJsonData<any>('bio');

  const content = bioData && bioData[language] ? bioData[language] : t.about;
  const images = useMemo(
    () => (bioData && bioData.images && bioData.images.length > 0 ? bioData.images : []),
    [bioData],
  );

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <section id="bio" className="py-16 md:py-32 bg-white text-black overflow-hidden overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold tracking-tighter mb-4">{content.title}</h2>
            <p className="text-gray-500 uppercase tracking-widest text-xs sm:text-sm mb-6">{content.baseline}</p>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-gray-500 mb-6 md:mb-8 font-display italic">
              {content.subtitle}
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="hidden md:block">
                {content.paragraphs && content.paragraphs.slice(0, 1).map((p: string, i: number) => (
                  <p key={i} className="text-gray-600 font-light leading-relaxed max-w-md">
                    {p}
                  </p>
                ))}
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <div className="md:hidden">
                      {content.paragraphs && content.paragraphs.slice(0, 1).map((p: string, i: number) => (
                        <p key={i} className="text-gray-600 font-light leading-relaxed max-w-md">
                          {p}
                        </p>
                      ))}
                    </div>
                    {content.paragraphs && content.paragraphs.slice(1).map((p: string, i: number) => (
                      <p key={i} className="text-gray-600 font-light leading-relaxed max-w-md">
                        {p}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-medium uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
            >
              {isExpanded ? t.about.readLess : t.about.readMore}
            </button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="order-1 lg:order-2 relative w-4/5 sm:w-2/3 lg:w-3/4 mx-auto group"
          >
            <div className="aspect-[4/5] overflow-hidden relative bg-gray-100">
              <AnimatePresence>
                {images.length > 0 && (
                  <motion.img 
                    key={currentImageIndex}
                    src={images[currentImageIndex]} 
                    alt={`Onesiker Featured ${currentImageIndex + 1}`} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                )}
              </AnimatePresence>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-8 -left-8 w-48 h-48 border border-black/10 -z-10 hidden md:block"></div>
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-black/5 -z-10 hidden md:block"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
