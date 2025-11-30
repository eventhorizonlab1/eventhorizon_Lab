import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Globe, Users } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { fetchAPI } from '../src/lib/api';
import { Partner } from '../types';
import { createPortal } from 'react-dom';

const PartnerModalContent: React.FC<{ partner: Partner; onClose: () => void }> = ({ partner, onClose }) => {
    const { t } = useThemeLanguage();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        modalRef.current?.focus();
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="partner-modal-title"
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
                    aria-label={t('common_close')}
                >
                    <X size={24} />
                </button>

                {/* Left: Image */}
                <div className="w-full md:w-5/12 h-64 md:h-auto relative shrink-0 bg-white/5">
                    <img
                        src={partner.imageUrl}
                        alt={partner.name}
                        className="w-full h-full object-contain p-12"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r" />
                </div>

                {/* Right: Content */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#0a0a0a]">
                    <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-blue-500">
                        <Globe size={14} />
                        <span>{partner.category || 'Partner'}</span>
                    </div>

                    <h2 id="partner-modal-title" className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {partner.name}
                    </h2>

                    <div className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed mb-8">
                        <p>{partner.description}</p>
                    </div>

                    <div className="flex gap-4">
                        <a
                            href={partner.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-blue-500 hover:text-white transition-colors"
                        >
                            {t('partner_visit_website')}
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const PartnerCard: React.FC<{ partner: Partner; index: number; onClick: (p: Partner) => void }> = ({ partner, index, onClick }) => {
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all hover:-translate-y-1"
            onClick={() => onClick(partner)}
        >
            <div className="relative h-48 p-8 bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <img
                    src={partner.imageUrl}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{partner.name}</h3>
            <p className="text-sm text-white/40 text-center line-clamp-2">{partner.description}</p>
        </motion.button>
    );
};

const EcosystemSection: React.FC = () => {
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useThemeLanguage();
    const [searchParams, setSearchParams] = useSearchParams();
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch Partners
    useEffect(() => {
        const getPartners = async () => {
            try {
                const res = await fetchAPI('/partners', { populate: '*' });
                if (res && res.data) {
                    setPartners(res.data);
                }
            } catch (error) {
                console.error("Error fetching partners:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getPartners();
    }, []);

    // Sync URL -> State
    useEffect(() => {
        const partnerId = searchParams.get('partner');
        if (partnerId && partners.length > 0) {
            const found = partners.find(p => p.name === partnerId);
            if (found) setSelectedPartner(found);
        } else if (!partnerId) {
            setSelectedPartner(null);
        }
    }, [searchParams, partners]);

    // Sync State -> URL
    const handlePartnerSelect = (partner: Partner | null) => {
        if (partner) {
            setSelectedPartner(partner);
            setSearchParams({ partner: partner.name }, { replace: false });

            const newParams = new URLSearchParams(searchParams);
            newParams.set('partner', partner.name);
            newParams.delete('video');
            newParams.delete('article');
            setSearchParams(newParams, { replace: false });
        } else {
            setSelectedPartner(null);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('partner');
            setSearchParams(newParams, { replace: false });
        }
    };

    return (
        <>
            {createPortal(
                <AnimatePresence>
                    {selectedPartner && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100]"
                        >
                            <Helmet>
                                <title>{`${selectedPartner.name} - Event Horizon`}</title>
                                <meta name="description" content={selectedPartner.description} />
                                <meta property="og:title" content={selectedPartner.name} />
                                <meta property="og:description" content={selectedPartner.description} />
                                <meta property="og:image" content={selectedPartner.logoUrl} />
                            </Helmet>
                            <PartnerModalContent partner={selectedPartner} onClose={() => handlePartnerSelect(null)} />
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <section id="ecosystem" ref={containerRef} className="relative py-32 bg-[#0a0a0a] border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 text-emerald-500 mb-4">
                                <Users className="animate-pulse" size={16} />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">{t('ecosystem_tagline')}</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                                {t('ecosystem_title')}
                            </h2>
                            <p className="text-lg text-white/60 max-w-lg leading-relaxed">
                                {t('ecosystem_subtitle')}
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {partners.map((partner, index) => (
                                <PartnerCard
                                    key={index}
                                    partner={partner}
                                    index={index}
                                    onClick={handlePartnerSelect}
                                />
                            ))}
                        </div>
                    )}

                    {!isLoading && partners.length === 0 && (
                        <div className="text-center text-white/40 py-20">
                            <p>No partners found.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default EcosystemSection;
