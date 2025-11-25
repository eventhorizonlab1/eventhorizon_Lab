


import React, { useRef, useState, useEffect } from 'react';
import { PARTNERS } from '../constants';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Partner } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, Building2, ExternalLink } from 'lucide-react';

const PartnerModalContent: React.FC<{ partner: Partner; onClose: () => void }> = ({ partner, onClose }) => {
    const { t } = useThemeLanguage();
    
    // Lock scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const role = t(`partner_${partner.id}_role`);
    const description = t(`partner_${partner.id}_desc`);

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-[#111] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative border border-gray-100 dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="relative h-48 md:h-64 overflow-hidden bg-gray-50 dark:bg-white/5 flex items-center justify-center p-12">
                <img 
                    src={partner.imageUrl} 
                    alt={partner.name} 
                    className="w-full h-full object-contain"
                />
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/10 dark:bg-black/40 hover:bg-black/20 dark:hover:bg-black/60 backdrop-blur-md rounded-full text-black dark:text-white transition-colors border border-black/5 dark:border-white/10"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                         <div>
                            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest mb-2 rounded-full shadow-lg">
                                {role}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white tracking-tighter">{partner.name}</h2>
                         </div>
                         
                         <a 
                            href={partner.websiteUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-black dark:text-white transition-colors"
                         >
                            <span>{t('ecosystem_website')}</span>
                            <ExternalLink size={14} />
                         </a>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-gray-100 dark:bg-white/5 p-3 rounded-xl shrink-0">
                            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Profil Partenaire</h3>
                            <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {description}
                            </p>
                        </div>
                    </div>
                    
                    {/* Mobile Only Button */}
                    <a 
                        href={partner.websiteUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest text-black dark:text-white transition-colors w-full"
                    >
                        <span>{t('ecosystem_website')}</span>
                        <ExternalLink size={14} />
                    </a>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
                    <button onClick={onClose} className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                        Fermer
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const PartnerCard: React.FC<{ partner: Partner; index: number; onClick: (p: Partner) => void }> = React.memo(({ partner, index, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useThemeLanguage();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const role = t(`partner_${partner.id}_role`);

  return (
    <motion.div 
       ref={ref}
       style={{ y }}
       className="snap-start shrink-0 w-[60vw] md:w-[20vw] group relative cursor-pointer"
       onClick={() => onClick(partner)}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      >
         {/* Card Visual - Updated for Logos */}
         <div className="relative overflow-hidden rounded-xl bg-white dark:bg-white/90 aspect-[4/5] mb-6 transition-colors duration-500 border border-gray-100 dark:border-white/10 shadow-sm p-8 flex items-center justify-center">
            <img 
                src={partner.imageUrl} 
                alt={partner.name} 
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 opacity-100"
            />
            {/* Hover Overlay info */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
              <span className="text-white font-bold tracking-widest uppercase border border-white/50 rounded-full px-4 py-2 text-xs bg-black/50 backdrop-blur-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {t('ecosystem_view')}
              </span>
            </div>
         </div>

         {/* Text Under Card */}
         <div className="text-center md:text-left">
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
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  
  return (
    <>
        <AnimatePresence>
            {selectedPartner && (
                <motion.div
                    key="partner-modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setSelectedPartner(null)}
                >
                    <PartnerModalContent 
                        partner={selectedPartner} 
                        onClose={() => setSelectedPartner(null)} 
                    />
                </motion.div>
            )}
        </AnimatePresence>

        <motion.section 
        id="ecosystem" 
        className="pt-16 md:pt-24 pb-0"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        >
        <div className="px-4 md:px-12 max-w-[1800px] mx-auto mb-12">
            <div className="border-l-4 border-black dark:border-white pl-3 md:pl-6 -ml-4 md:-ml-7">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-black dark:text-white">
                {t('ecosystem_title')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
                {t('ecosystem_subtitle')}
                </p>
            </div>
        </div>

        <div className="overflow-hidden">
            {/* Reduced bottom padding from pb-12 to pb-6 */}
            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 md:px-12 gap-6 pb-6">
            {PARTNERS.map((partner, index) => (
                <PartnerCard 
                    key={partner.id} 
                    partner={partner} 
                    index={index} 
                    onClick={setSelectedPartner}
                />
            ))}
            </div>
        </div>
        </motion.section>
    </>
  );
};

export default EcosystemSection;
