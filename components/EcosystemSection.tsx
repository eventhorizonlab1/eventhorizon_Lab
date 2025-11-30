
import React, { useRef, useState, useEffect } from 'react';
import { PARTNERS } from '../constants';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Partner } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, Building2, ExternalLink, Globe, Award } from 'lucide-react';

const PartnerModalContent: React.FC<{ partner: Partner; onClose: () => void }> = ({ partner, onClose }) => {
    const { t } = useThemeLanguage();

    // Lock scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const translatedRole = t(`partner_${partner.id}_role`);
    const role = translatedRole === `partner_${partner.id}_role` ? partner.role : translatedRole;
    const description = t(`partner_${partner.id}_desc`);

    // Generate visual tags based on role for aesthetics
    const getTags = (id: string) => {
        if (id === 'p1') return ['Souveraineté', 'Innovation', 'Opérations'];
        if (id === 'p2') return ['Intégration', 'Défense', 'Export'];
        if (id === 'p3') return ['Orbital', 'Télécoms', 'Navigation'];
        if (id === 'p4') return ['Recherche', 'Formation', 'Ingénierie'];
        return ['Médiation', 'Culture', 'Grand Public'];
    };

    const tags = getTags(partner.id);

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-[#0a0a0a] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100 dark:border-white/10 flex flex-col md:flex-row h-[85vh] md:h-[600px]"
            onClick={(e) => e.stopPropagation()}
        >
            {/* LEFT: Immersive Image (Mobile Top) */}
            <div className="relative w-full md:w-5/12 h-1/3 md:h-full shrink-0 group">
                <div className="absolute inset-0 bg-gray-900">
                    <img
                        src={partner.imageUrl}
                        alt={partner.name}
                        className="w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/80"></div>

                {/* Mobile Title Overlay */}
                <div className="absolute bottom-0 left-0 p-6 md:hidden z-20">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest mb-2 rounded-full shadow-lg">
                        {role}
                    </span>
                    <h2 className="text-3xl font-black text-white tracking-tighter leading-none">{partner.name}</h2>
                </div>

                {/* CLOSE BUTTON: Adjusted to top-12 (approx 48px) for better balance */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-colors border border-white/20 shadow-lg"
                >
                    <X size={24} strokeWidth={2.5} />
                </button>
            </div>

            {/* RIGHT: Content (Mobile Bottom) */}
            <div className="flex-1 p-6 md:p-10 flex flex-col h-2/3 md:h-full overflow-y-auto custom-scrollbar bg-white dark:bg-[#0a0a0a]">

                {/* Desktop Header */}
                <div className="hidden md:block mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-600/20">
                            {role}
                        </span>
                        <div className="h-px flex-1 bg-gray-100 dark:bg-white/10"></div>
                    </div>
                    <h2 className="text-5xl font-black text-black dark:text-white tracking-tighter leading-none mb-1">
                        {partner.name}
                    </h2>
                </div>

                {/* Tags Grid */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {tags.map((tag, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                            <Award size={14} className="text-blue-500" />
                            <span className="text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300">{tag}</span>
                        </div>
                    ))}
                </div>

                {/* Description */}
                <div className="prose prose-sm dark:prose-invert max-w-none mb-auto">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400 shrink-0">
                            <Building2 size={24} strokeWidth={1.5} />
                        </div>
                        <p className="text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300 font-serif whitespace-pre-line text-justify">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest font-medium">
                        <Globe size={14} />
                        <span>Partenaire Officiel</span>
                    </div>
                    <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black rounded-full text-xs font-bold uppercase tracking-widest transition-all w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <span>{t('ecosystem_website')}</span>
                        <ExternalLink size={14} />
                    </a>
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

    const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
    const translatedRole = t(`partner_${partner.id}_role`);
    const role = translatedRole === `partner_${partner.id}_role` ? partner.role : translatedRole;

    return (
        <motion.div
            ref={ref}
            style={{ y }}
            // Tablet Optimization: w-[35vw] for comfortable browsing
            className="snap-start shrink-0 w-[70vw] md:w-[32vw] lg:w-[22vw] group relative"
        >
            <motion.button
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                className="w-full text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 rounded-3xl"
                onClick={() => onClick(partner)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick(partner);
                    }
                }}
                aria-label={`${t('ecosystem_view')} ${partner.name}`}
            >
                {/* Card Visual - Full Coverage Images */}
                <div className="relative overflow-hidden rounded-3xl bg-gray-200 dark:bg-gray-900 aspect-[4/5] mb-6 transition-all duration-500 border border-gray-200 dark:border-white/5 shadow-sm group-hover:shadow-2xl">
                    {/* Loading placeholder */}
                    <div className="absolute inset-0 bg-gray-800 animate-pulse z-0" />

                    <img
                        src={partner.imageUrl}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-20"></div>

                    {/* Hover Overlay info */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] z-30">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-white font-bold tracking-[0.2em] uppercase border border-white/30 rounded-full px-6 py-3 text-xs bg-white/10 hover:bg-white hover:text-black transition-colors shadow-xl backdrop-blur-md">
                                {t('ecosystem_view')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Text Under Card */}
                <div className="text-center md:text-left px-2">
                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-2 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {partner.name}
                    </h3>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest block border-t-2 border-gray-100 dark:border-white/10 pt-3 inline-block">
                        {role}
                    </span>
                </div>
            </motion.button>
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
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
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
                // STANDARDIZED SPACING: py-16 (mobile) md:py-24 (desktop)
                className="py-16 md:py-24"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="px-4 md:px-12 max-w-[1800px] mx-auto mb-16">
                    <div className="border-l-4 border-black dark:border-white pl-3 md:pl-6 -ml-4 md:-ml-7">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-black dark:text-white">
                            {t('ecosystem_title')}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-xl">
                            {t('ecosystem_subtitle')}
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden">
                    <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 md:px-12 gap-8 pb-12">
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
