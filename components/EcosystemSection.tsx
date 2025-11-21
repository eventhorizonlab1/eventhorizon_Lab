import React, { useRef } from 'react';
import { PARTNERS } from '../constants';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Partner } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

const PartnerCard: React.FC<{ partner: Partner; index: number }> = ({ partner, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useThemeLanguage();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // More pronounced parallax effect for dynamic depth
  const y = useTransform(scrollYProgress, [0, 1], [400, -400]);

  return (
    <motion.div 
       ref={ref}
       style={{ y }}
       className="snap-start shrink-0 w-[70vw] md:w-[22vw] group relative cursor-pointer"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      >
         {/* Card Visual */}
         <div className="relative overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-eh-gray aspect-[4/5] mb-6 transition-colors duration-500">
            <img 
              src={partner.imageUrl} 
              alt={partner.name} 
              className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            {/* Hover Overlay info */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white font-bold tracking-widest uppercase border border-white rounded-full px-4 py-2 text-xs">
                {t('ecosystem_view')}
              </span>
            </div>
         </div>

         {/* Text Under Card */}
         <div className="text-center md:text-left">
           <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
             {partner.name}
           </h3>
           <span className="text-xs font-black text-gray-400 uppercase tracking-widest block">{partner.role}</span>
         </div>
      </motion.div>
    </motion.div>
  );
}

const EcosystemSection: React.FC = () => {
  const { t } = useThemeLanguage();
  
  return (
    <motion.section 
      id="ecosystem" 
      className="py-24 md:py-32"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
       <div className="px-4 md:px-12 max-w-[1800px] mx-auto mb-16">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-black dark:text-white">
          {t('ecosystem_title')}
        </h2>
        <p className="text-gray-500 text-lg">
          {t('ecosystem_subtitle')}
        </p>
      </div>

      <div className="overflow-hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 md:px-12 gap-6 pb-12">
           {PARTNERS.map((partner, index) => (
             <PartnerCard key={partner.id} partner={partner} index={index} />
           ))}
        </div>
      </div>
    </motion.section>
  );
};

export default EcosystemSection;