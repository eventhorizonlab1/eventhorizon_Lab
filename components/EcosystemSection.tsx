
import React, { useRef } from 'react';
import { PARTNERS } from '../constants';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Partner } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

const PartnerCard: React.FC<{ partner: Partner; index: number }> = React.memo(({ partner, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useThemeLanguage();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Reduced parallax effect to minimize gap below the section
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const role = t(`partner_${partner.id}_role`);

  return (
    <motion.div 
       ref={ref}
       style={{ y }}
       className="snap-start shrink-0 w-[60vw] md:w-[20vw] group relative cursor-pointer"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      >
         {/* Card Visual - Full Color */}
         <div className="relative overflow-hidden rounded-xl bg-white dark:bg-white/5 aspect-[4/5] mb-6 transition-colors duration-500 border border-gray-100 dark:border-white/10 shadow-sm">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <img 
                src={partner.imageUrl} 
                alt={partner.name} 
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
            </div>
            {/* Hover Overlay info */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
              <span className="text-white font-bold tracking-widest uppercase border border-white/50 rounded-full px-4 py-2 text-xs bg-black/50">
                {t('ecosystem_view')}
              </span>
            </div>
         </div>

         {/* Text Under Card */}
         <div className="text-center md:text-left pl-1">
           <h3 className="text-xl font-bold uppercase tracking-tight mb-1 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
             {partner.name}
           </h3>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block border-t border-gray-200 dark:border-gray-800 pt-2 inline-block min-w-[50px]">{role}</span>
         </div>
      </motion.div>
    </motion.div>
  );
});

const EcosystemSection: React.FC = () => {
  const { t } = useThemeLanguage();
  
  return (
    <motion.section 
      id="ecosystem" 
      className="pt-16 md:pt-24 pb-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
       <div className="px-4 md:px-12 max-w-[1800px] mx-auto mb-12 border-l-4 border-black dark:border-white pl-6">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-black dark:text-white">
          {t('ecosystem_title')}
        </h2>
        <p className="text-gray-500 text-base md:text-lg">
          {t('ecosystem_subtitle')}
        </p>
      </div>

      <div className="overflow-hidden">
        {/* Reduced bottom padding from pb-12 to pb-6 */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 md:px-12 gap-6 pb-6">
           {PARTNERS.map((partner, index) => (
             <PartnerCard key={partner.id} partner={partner} index={index} />
           ))}
        </div>
      </div>
    </motion.section>
  );
};

export default EcosystemSection;
