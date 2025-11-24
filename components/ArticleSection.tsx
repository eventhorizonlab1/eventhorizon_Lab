import React, { useRef, useState, useEffect } from 'react';
import { ARTICLES } from '../constants';
import { ArrowRight, ArrowLeft, FileText, X, Clock, Calendar } from 'lucide-react';
import { motion, useScroll, useTransform, Variants, AnimatePresence } from 'framer-motion';
import { Article } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut"
    }
  }
};

// --- ARTICLE MODAL COMPONENT ---
const ArticleModal: React.FC<{ article: Article | null; onClose: () => void }> = ({ article, onClose }) => {
    const { t } = useThemeLanguage();
    
    useEffect(() => {
        if (article) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [article]);

    if (!article) return null;

    const title = t(`article_${article.id}_title`);
    const date = article.date;
    
    let contentText = t(`article_${article.id}_content`);
    if (contentText === `article_${article.id}_content`) {
        contentText = t('article_placeholder_content');
    }

    const paragraphs = contentText.split('\n\n');
    const wordCount = contentText.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/90 backdrop-blur-md p-0 md:p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white dark:bg-[#0a0a0a] w-full max-w-4xl h-[95vh] md:h-[90vh] rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative border border-gray-200 dark:border-white/10"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 bg-white/20 hover:bg-white/40 dark:bg-black/40 dark:hover:bg-black/60 backdrop-blur-md rounded-full text-black dark:text-white transition-colors border border-white/20"
                    aria-label="Fermer"
                >
                    <X size={24} />
                </button>

                <div className="relative h-[35vh] md:h-[45vh] shrink-0 overflow-hidden">
                    <motion.img 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                        src={article.imageUrl} 
                        alt={title}
                        decoding="async"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-transparent to-black/30"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-widest mb-4 rounded-full shadow-lg backdrop-blur-sm"
                        >
                            <FileText size={12} />
                            Editorial
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl md:text-6xl font-sans font-black leading-[0.9] text-black dark:text-white drop-shadow-sm mb-4 max-w-3xl tracking-tight"
                        >
                            {title}
                        </motion.h2>
                        
                        <motion.div 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ delay: 0.4 }}
                             className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                             <div className="flex items-center gap-2 bg-white/50 dark:bg-black/50 px-3 py-1 rounded-full backdrop-blur-md border border-gray-200 dark:border-white/10">
                                <Calendar size={14} />
                                <span className="uppercase tracking-widest">{date}</span>
                             </div>
                             <div className="flex items-center gap-2 bg-white/50 dark:bg-black/50 px-3 py-1 rounded-full backdrop-blur-md border border-gray-200 dark:border-white/10">
                                <Clock size={14} />
                                <span>{readTime} min read</span>
                             </div>
                        </motion.div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 custom-scrollbar bg-white dark:bg-[#0a0a0a]">
                    <div className="max-w-3xl mx-auto">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="font-serif text-xl md:text-2xl leading-relaxed text-gray-900 dark:text-gray-100 mb-8 first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-blue-600 dark:first-letter:text-blue-500">
                                {paragraphs[0]}
                            </p>
                            
                            {paragraphs.slice(1).map((para, idx) => (
                                <p key={idx} className="font-serif text-lg leading-loose text-gray-700 dark:text-gray-300 mb-6 text-justify">
                                    {para}
                                </p>
                            ))}
                        </div>

                        <div className="mt-16 pt-12 border-t border-gray-100 dark:border-white/10 flex flex-col items-center gap-4">
                            <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                *** Fin de transmission ***
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ArticleCard: React.FC<{ article: Article; onClick: (article: Article) => void }> = React.memo(({ article, onClick }) => {
  const { t } = useThemeLanguage();
  const title = t(`article_${article.id}_title`);
  const summary = t(`article_${article.id}_summary`);

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      className="snap-start shrink-0 w-[85vw] md:w-[400px] h-[580px] transform-gpu"
      onClick={() => onClick(article)}
      style={{ willChange: 'transform' }}
    >
        <div className="group cursor-pointer h-full relative overflow-hidden rounded-[2rem] bg-black shadow-lg hover:shadow-3xl transition-all duration-500 border border-white/10">
          
          <div className="absolute inset-0 w-full h-full transform transition-transform duration-1000 group-hover:scale-105">
             <div className="absolute inset-0 bg-gray-900 animate-pulse" /> 
             <img 
                src={article.imageUrl} 
                alt={title} 
                loading="lazy"
                decoding="async" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-90"
             />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>

          <div className="absolute top-8 left-8 z-20">
             <div className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                <span className="w-8 h-[3px] bg-white/60 group-hover:bg-blue-500 transition-colors duration-300"></span>
                <span className="text-[11px] font-black uppercase tracking-[0.25em] shadow-black drop-shadow-md">{article.date}</span>
             </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 z-20 flex flex-col justify-end h-full pointer-events-none">
             <div className="transform transition-transform duration-500 translate-y-12 group-hover:translate-y-0">
                
                <div className="mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">
                        <FileText size={10} /> 
                        <span>Article</span>
                    </span>
                </div>

                <h3 className="text-3xl md:text-5xl font-sans font-black leading-[0.95] md:leading-[0.9] mb-6 text-white drop-shadow-xl line-clamp-4 group-hover:line-clamp-none transition-all tracking-tighter">
                  {title}
                </h3>
                
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                    <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <p className="text-gray-300 text-base font-medium leading-relaxed border-t border-white/20 pt-4 mb-6 max-w-[90%]">
                        {summary}
                        </p>
                        <button className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white group/btn hover:text-blue-400 transition-colors pointer-events-auto bg-white/10 hover:bg-white/20 px-4 py-3 rounded-full w-fit backdrop-blur-sm">
                            {t('article_read_more')} 
                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>
                </div>
             </div>
          </div>
        </div>
    </motion.div>
  );
});

const ArticleSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useThemeLanguage();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <>
    {selectedArticle && (
          <>
            <title>{t(`article_${selectedArticle.id}_title`) + " | Event Horizon"}</title>
            <meta name="description" content={t(`article_${selectedArticle.id}_summary`)} />
          </>
    )}
    <AnimatePresence>
        {selectedArticle && (
            <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
        )}
    </AnimatePresence>

    <motion.section 
      id="articles" 
      className="py-16 md:py-24 bg-white dark:bg-eh-black relative border-t border-gray-100 dark:border-gray-800 transition-colors duration-500"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="px-4 md:px-12 max-w-[1800px] mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-l-4 border-black dark:border-white pl-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-black dark:text-white">
            {t('articles_title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-md">
            {t('articles_subtitle')}
          </p>
        </div>
        
        <div className="hidden md:flex gap-2 pb-2">
          <button onClick={() => scroll('left')} className="p-3 border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white transition-colors rounded-full">
            <ArrowLeft size={20} />
          </button>
          <button onClick={() => scroll('right')} className="p-3 border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white transition-colors rounded-full">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 md:px-12 gap-6 pb-12 touch-pan-x"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {ARTICLES.map((article) => (
          <ArticleCard key={article.id} article={article} onClick={setSelectedArticle} />
        ))}
      </div>
      
      <div className="flex md:hidden justify-center mt-4 gap-1">
         <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white opacity-50"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      </div>

    </motion.section>
    </>
  );
};

export default ArticleSection;