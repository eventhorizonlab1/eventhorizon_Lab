import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ARTICLES } from '../constants';
import { Article } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, X, Calendar } from 'lucide-react';

// --- MODAL COMPONENT (Basé sur le modèle Ecosystem) ---
const ArticleModalContent: React.FC<{ article: Article; onClose: () => void }> = ({ article, onClose }) => {
    const { t } = useThemeLanguage();

    // Bloquer le scroll d'arrière-plan
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const translatedTitle = t(`article_${article.id}_title`);
    const title = translatedTitle === `article_${article.id}_title` ? article.title : translatedTitle;

    // Logique de contenu par défaut si la traduction manque
    let contentText = t(`article_${article.id}_content`);
    if (contentText === `article_${article.id}_content`) {
        contentText = t('article_placeholder_content');
    }
    const paragraphs = contentText.split('\n\n');

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-[#0a0a0a] w-full max-w-5xl h-[90vh] md:h-[85vh] rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100 dark:border-white/10 flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-colors border border-white/20 shadow-lg"
                aria-label={t('common_close')}
            >
                <X size={24} />
            </button>

            {/* Gauche: Image */}
            <div className="w-full md:w-5/12 h-1/3 md:h-full relative shrink-0">
                <img
                    src={article.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r" />
                <div className="absolute bottom-6 left-6 text-white md:hidden">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest opacity-80">
                        <Calendar size={12} />
                        <span>{article.date}</span>
                    </div>
                    <h2 className="text-2xl font-black leading-tight">{title}</h2>
                </div>
            </div>

            {/* Droite: Contenu */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0a0a0a]">
                <div className="hidden md:block mb-8">
                    <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                        <Calendar size={14} />
                        <span>{article.date}</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-black dark:text-white leading-none tracking-tight">
                        {title}
                    </h2>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    {paragraphs.map((para, idx) => (
                        <p key={idx} className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed font-serif text-justify">
                            {para}
                        </p>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/10 flex justify-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Event Horizon Lab</p>
                </div>
            </div>
        </motion.div>
    );
};

// --- COMPOSANT CARTE (Structure identique à PartnerCard) ---
const ArticleCard: React.FC<{ article: Article; index: number; onClick: (a: Article) => void }> = React.memo(({ article, index, onClick }) => {
    const { t } = useThemeLanguage();
    const translatedTitle = t(`article_${article.id}_title`);
    const title = translatedTitle === `article_${article.id}_title` ? article.title : translatedTitle;

    const translatedSummary = t(`article_${article.id}_summary`);
    const summary = translatedSummary === `article_${article.id}_summary` ? article.summary : translatedSummary;

    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="snap-start shrink-0 w-[80vw] md:w-[400px] cursor-pointer group text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 rounded-[2rem]"
            onClick={() => onClick(article)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(article);
                }
            }}
            aria-label={`${t('article_read_more')} ${title}`}
        >
            {/* Conteneur Visuel */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gray-900 aspect-[4/5] mb-4 border border-white/10 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">

                {/* Image */}
                <img
                    src={article.imageUrl}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />

                {/* Overlay Dégradé */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Overlay Interaction (Le "Bouton Fantôme") */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px] z-20">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">
                            {t('article_read_more')}
                            <ArrowRight size={14} />
                        </span>
                    </div>
                </div>

                {/* Contenu Texte (Toujours visible, pointer-events-none pour laisser passer le clic au parent) */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 pointer-events-none">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-md shadow-sm">
                            Article
                        </span>
                        <span className="text-white/80 text-xs font-bold uppercase tracking-widest border-l border-white/20 pl-2">
                            {article.date}
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white leading-tight mb-2 group-hover:text-blue-300 transition-colors">
                        {title}
                    </h3>

                    <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                        {summary}
                    </p>
                </div>
            </div>
        </motion.button>
    );
});

// --- SECTION PRINCIPALE ---
const ArticleSection: React.FC = () => {
    const { t } = useThemeLanguage();
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    // Sync URL -> State
    useEffect(() => {
        const articleId = searchParams.get('article');
        if (articleId) {
            const article = ARTICLES.find(a => a.id === articleId);
            if (article) {
                setSelectedArticle(article);
            }
        } else {
            setSelectedArticle(null);
        }
    }, [searchParams]);

    // Sync State -> URL
    const handleArticleSelect = (article: Article | null) => {
        if (article) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('article', article.id);
                newParams.delete('video');
                newParams.delete('partner');
                return newParams;
            }, { replace: false });
        } else {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.delete('article');
                return newParams;
            }, { replace: false });
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const amount = direction === 'left' ? -400 : 400;
            scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    return (
        <>
            <AnimatePresence>
                {selectedArticle && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                        onClick={() => handleArticleSelect(null)}
                    >
                        {/* SEO Metadata for Modal */}
                        <Helmet>
                            <title>{selectedArticle.title} | Event Horizon</title>
                            <meta name="description" content={selectedArticle.summary} />
                            <meta property="og:title" content={selectedArticle.title} />
                            <meta property="og:description" content={selectedArticle.summary} />
                            <meta property="og:image" content={selectedArticle.imageUrl} />
                        </Helmet>

                        <ArticleModalContent
                            article={selectedArticle}
                            onClose={() => handleArticleSelect(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <section id="articles" className="py-16 md:py-24 bg-white dark:bg-eh-black border-t border-gray-100 dark:border-white/5 transition-colors duration-500">
                <div className="max-w-[1800px] mx-auto px-4 md:px-12 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="border-l-4 border-black dark:border-white pl-4 -ml-4 md:-ml-7">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-black dark:text-white">
                            {t('articles_title')}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl">
                            {t('articles_subtitle')}
                        </p>
                    </div>

                    <div className="hidden md:flex gap-4">
                        <button onClick={() => scroll('left')} className="p-4 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all" aria-label="Scroll Left">
                            <ArrowLeft size={20} />
                        </button>
                        <button onClick={() => scroll('right')} className="p-4 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all" aria-label="Scroll Right">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 md:px-12 gap-8 pb-12"
                    >
                        {ARTICLES.map((article, index) => (
                            <ArticleCard
                                key={article.id}
                                article={article}
                                index={index}
                                onClick={handleArticleSelect}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex md:hidden justify-center gap-1.5 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white opacity-60"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                </div>
            </section>
        </>
    );
};

export default ArticleSection;
