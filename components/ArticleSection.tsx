
import React, { useRef, useState, useEffect } from 'react';
import { ARTICLES } from '../constants';
import { ArrowRight, ArrowLeft, FileText, X } from 'lucide-react';
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
    
    // Prevent scrolling when modal is open
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
    
    // Try to get specific content, fallback to placeholder
    let contentText = t(`article_${article.id}_content`);
    // If the translation key returns itself (meaning missing translation), use placeholder
    if (contentText === `article_${article.id}_content`) {
        contentText = t('article_placeholder_content');
    }

    // Split content by newlines to create paragraphs
    const paragraphs = contentText.split('\n\n');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white dark:bg-[#111] w-full max-w-4xl h-[95vh] md:h-[90vh] rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 bg-black/20 dark:bg-white/10 hover:bg-black/40 dark:hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Header Image - Parallax feel */}
                <div className="relative h-[35vh] md:h-[40vh] shrink-0">
                    <img 
                        src={article.imageUrl} 
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#111] to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
                        <span className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest mb-4 rounded-full shadow-lg">
                            Article
                        </span>
                        <h2 className="text-2xl md:text-5xl font-sans font-extrabold leading-tight text-black dark:text-white drop-shadow-sm mb-2">
                            {title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                             <span className="uppercase tracking-widest">{date}</span>
                             <span className="w-1 h-1 bg-current rounded-full"></span>
                             <span>Event Horizon Editorial</span>
                        </div>
                    </div>
                </div>

                {/* Content Body - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 custom-scrollbar">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="font-serif text-xl md:text-2xl leading-relaxed text-gray-800 dark:text-gray-200 first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left mb-8">
                            {paragraphs[0]}
                        </p>
                        {paragraphs.slice(1).map((para, idx) => (
                            <p key={idx} className="font-serif text-lg leading-loose text-gray-600 dark:text-gray-300 mb-6">
                                {para}
                            </p>
                        ))}
                    </div>

                    <div className="mt-12 pt-12 border-t border-gray-200 dark:border-white/10 flex justify-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            *** Fin de transmission ***
                        </p>
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
      className="snap-start shrink-0 w-[85vw] md:w-[360px] h-[520px]"
      onClick={() => onClick(article)}
    >
        <div className="group cursor-pointer h-full relative overflow-hidden rounded-xl bg-black shadow-lg hover:shadow-2xl transition-all duration-500">
          
          {/* Background Image - Full Magazine Cover Style */}
          <div className="absolute inset-0 w-full h-full transform transition-transform duration-1000 group-hover:scale-110">
             <div className="absolute inset-0 bg-gray-900 animate-pulse" /> {/* Placeholder */}
             <img 
                src={article.imageUrl} 
                alt={title} 
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
             />
          </div>
          
          {/* Subtle Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80"></div>

          {/* Top Metadata - Magazine Date Line */}
          <div className="absolute top-8 left-8 z-20">
             <div className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                <span className="w-8 h-[2px] bg-white/60 group-hover:bg-white transition-colors"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] shadow-black drop-shadow-md">{article.date}</span>
             </div>
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end h-full">
             <div className="transform transition-transform duration-500 translate-y-8 group-hover:translate-y-0">
                
                {/* Tag Pill - Appears on Hover */}
                <div className="mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">
                        <FileText size={10} /> 
                        <span>Article</span>
                    </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-sans font-extrabold leading-[1.1] mb-2 text-white drop-shadow-lg">
                  {title}
                </h3>
                
                {/* Summary Reveal */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                    <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <p className="text-gray-300 text-sm font-medium leading-relaxed border-t border-white/20 pt-4 mb-5">
                        {summary}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group/btn">
                            {t('article_read_more')} 
                            <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                        </div>
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
      const scrollAmount = direction === 'left' ? -380 : 380;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <>
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
          <p className="text-gray-500 text-base md:text-lg max-w-md">
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

      {/* Carousel */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 md:px-12 gap-6 pb-12"
      >
        {ARTICLES.map((article) => (
          <ArticleCard key={article.id} article={article} onClick={setSelectedArticle} />
        ))}
      </div>
      
      {/* Mobile Scroll Indicator */}
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
