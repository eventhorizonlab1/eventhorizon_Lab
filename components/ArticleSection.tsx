import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Calendar, BookOpen, ArrowUpRight, ExternalLink } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { fetchArticles } from '../src/lib/api';
import { Article } from '../types';
import { createPortal } from 'react-dom';
import { useCinematicAudio } from '../src/hooks/useCinematicAudio';

const ArticleModalContent: React.FC<{ article: Article; onClose: () => void }> = ({ article, onClose }) => {
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
            aria-labelledby="article-modal-title"
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
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

                {/* Hero Image */}
                <div className="relative h-64 md:h-80 shrink-0">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-10">
                        <div className="flex items-center gap-4 text-sm text-blue-400 font-mono mb-3">
                            <span className="flex items-center gap-2">
                                <Calendar size={14} />
                                {article.date}
                            </span>
                            {article.category && (
                                <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 rounded border border-white/10">
                                    {article.category}
                                </span>
                            )}
                        </div>
                        <h2 id="article-modal-title" className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            {article.title}
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-10 overflow-y-auto">
                    <div className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed">
                        <p className="lead text-xl text-white/90 font-medium mb-8">
                            {article.summary}
                        </p>
                        {article.content ? (
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        ) : (
                            article.linkUrl && (
                                <div className="mt-8">
                                    <a
                                        href={article.linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded transition-colors"
                                    >
                                        Lire l'article complet
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ArticleCard: React.FC<{ article: Article; index: number; onClick: (a: Article) => void }> = ({ article, index, onClick }) => {
    const { t } = useThemeLanguage();
    const { playHover, playClick } = useCinematicAudio();

    const handleClick = () => {
        playClick();
        if (article.linkUrl) {
            window.open(article.linkUrl, '_blank', 'noopener,noreferrer');
        } else {
            onClick(article);
        }
    };

    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col text-left w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
            onClick={handleClick}
            onMouseEnter={() => playHover()}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    {article.linkUrl ? <ExternalLink size={20} className="text-white" /> : <ArrowUpRight size={20} className="text-white" />}
                </div>
                {article.category && (
                    <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur text-white rounded border border-white/10">
                            {article.category}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col grow">
                <div className="flex items-center gap-3 text-xs font-mono text-blue-400 mb-3">
                    <Calendar size={12} />
                    <span>{article.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {article.title}
                </h3>
                <p className="text-sm text-white/60 line-clamp-3 mb-6 grow">
                    {article.summary}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors mt-auto">
                    {article.linkUrl ? "LIRE LA SOURCE" : t('article_read_more')}
                    <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </motion.button>
    );
};

const ArticleSection: React.FC = () => {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const { t } = useThemeLanguage();
    const [searchParams, setSearchParams] = useSearchParams();
    const containerRef = useRef<HTMLDivElement>(null);
    const { playClick, playHover } = useCinematicAudio();

    // Fetch Articles
    useEffect(() => {
        const getArticles = async () => {
            try {
                const fetchedArticles = await fetchArticles();
                setArticles(fetchedArticles);
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getArticles();
    }, []);

    // Sync URL -> State
    useEffect(() => {
        const articleId = searchParams.get('article');
        if (articleId && articles.length > 0) {
            const found = articles.find(a => a.title === articleId);
            if (found) setSelectedArticle(found);
        } else if (!articleId) {
            setSelectedArticle(null);
        }
    }, [searchParams, articles]);

    // Sync State -> URL
    const handleArticleSelect = (article: Article | null) => {
        if (article) {
            setSelectedArticle(article);
            setSearchParams({ article: article.title }, { replace: false });

            const newParams = new URLSearchParams(searchParams);
            newParams.set('article', article.title);
            newParams.delete('video');
            newParams.delete('partner');
            setSearchParams(newParams, { replace: false });
        } else {
            setSelectedArticle(null);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('article');
            setSearchParams(newParams, { replace: false });
        }
    };

    const categories = ['All', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean) as string[]))];
    const filteredArticles = filter === 'All' ? articles : articles.filter(a => a.category === filter);

    return (
        <>
            {createPortal(
                <AnimatePresence>
                    {selectedArticle && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100]"
                        >
                            <Helmet>
                                <title>{`${selectedArticle.title} - Event Horizon`}</title>
                                <meta name="description" content={selectedArticle.summary} />
                                <meta property="og:title" content={selectedArticle.title} />
                                <meta property="og:description" content={selectedArticle.summary} />
                                <meta property="og:image" content={selectedArticle.imageUrl} />
                            </Helmet>
                            <ArticleModalContent article={selectedArticle} onClose={() => handleArticleSelect(null)} />
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <section id="articles" ref={containerRef} className="relative py-32 bg-[#0a0a0a] border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 text-purple-500 mb-4">
                                <BookOpen className="animate-pulse" size={16} />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">{t('article_latest_news')}</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                                {t('articles_title')}
                            </h2>
                            <p className="text-lg text-white/60 max-w-lg leading-relaxed">
                                {t('articles_subtitle')}
                            </p>
                        </div>

                        {/* Filter Tabs (YouTube Style) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full overflow-x-auto pb-4 no-scrollbar"
                        >
                            <div className="flex gap-3 min-w-max px-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            playClick();
                                            setFilter(cat);
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${filter === cat
                                            ? 'bg-white text-black'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Featured Article */}
                            {filteredArticles.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded-2xl overflow-hidden group cursor-pointer border border-white/10"
                                    onClick={() => {
                                        playClick();
                                        if (filteredArticles[0].linkUrl) {
                                            window.open(filteredArticles[0].linkUrl, '_blank', 'noopener,noreferrer');
                                        } else {
                                            handleArticleSelect(filteredArticles[0]);
                                        }
                                    }}
                                    onMouseEnter={() => playHover()}
                                >
                                    <img
                                        src={filteredArticles[0].imageUrl}
                                        alt={filteredArticles[0].title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                                    <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-purple-600 text-white rounded-full">
                                                Featured
                                            </span>
                                            {filteredArticles[0].category && (
                                                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/10 text-white/80 rounded-full backdrop-blur-md border border-white/10">
                                                    {filteredArticles[0].category}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-2xl md:text-5xl font-black text-white mb-4 leading-tight">
                                            {filteredArticles[0].title}
                                        </h3>
                                        <p className="text-white/70 line-clamp-2 md:text-lg mb-6 max-w-2xl">
                                            {filteredArticles[0].summary}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-purple-400 group-hover:text-white transition-colors">
                                            <span>{filteredArticles[0].linkUrl ? "LIRE LA SOURCE" : t('article_read_more')}</span>
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Horizontal Scroll List */}
                            {filteredArticles.length > 1 && (
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-6 px-1">More Articles</h4>
                                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                                        {filteredArticles.slice(1).map((article, index) => (
                                            <div key={index} className="min-w-[85vw] md:min-w-[400px] snap-start">
                                                <ArticleCard
                                                    article={article}
                                                    index={index}
                                                    onClick={handleArticleSelect}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!isLoading && filteredArticles.length === 0 && (
                        <div className="text-center text-white/40 py-20">
                            <p>No articles found.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default ArticleSection;
