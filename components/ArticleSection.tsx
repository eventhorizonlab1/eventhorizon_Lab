
import React, { useRef } from 'react';
import { ARTICLES } from '../constants';
import { ArrowRight, ArrowLeft, FileText } from 'lucide-react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
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

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  const { t } = useThemeLanguage();
  const title = t(`article_${article.id}_title`);
  const summary = t(`article_${article.id}_summary`);

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      className="snap-start shrink-0 w-[85vw] md:w-[380px] h-full"
    >
        <div className="group cursor-pointer h-full flex flex-col p-6 md:p-8 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white transition-colors duration-300 relative overflow-hidden">
          
          {/* Decorative Accent */}
          <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 dark:bg-white/10 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors duration-300"></div>
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6 opacity-60">
             <div className="flex items-center gap-2">
                <FileText size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">{article.date}</span>
             </div>
             <span className="text-[10px] font-mono border border-current px-1.5 py-0.5 rounded">DOC</span>
          </div>

          {/* Content */}
          <div className="flex-grow">
            {/* Thumbnail for article (optional but adds to the visual) */}
            <div className="w-full h-32 mb-4 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
                <img src={article.imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"/>
            </div>

            <h3 className="text-xl md:text-2xl font-serif font-bold leading-tight mb-3 text-black dark:text-white group-hover:underline decoration-1 underline-offset-4 transition-all">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed line-clamp-3 border-t border-gray-200 dark:border-white/10 pt-4">
              {summary}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black dark:text-white group-hover:translate-x-2 transition-transform duration-300">
             {t('article_read_more')} <ArrowRight size={14} />
          </div>
        </div>
    </motion.div>
  );
};

const ArticleSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useThemeLanguage();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <motion.section 
      id="articles" 
      className="py-16 md:py-24 bg-white dark:bg-eh-black relative border-t border-gray-100 dark:border-gray-800 transition-colors duration-500"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="px-4 md:px-12 max-w-[1800px] mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Publications</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-black dark:text-white">
            {t('articles_title')}
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-md">
            {t('articles_subtitle')}
          </p>
        </div>
        
        <div className="hidden md:flex gap-2">
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
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 md:px-12 gap-6 pb-12 items-stretch"
      >
        {ARTICLES.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
        {/* Empty spacer for scroll padding */}
        <div className="w-12 shrink-0"></div>
      </div>
    </motion.section>
  );
};

export default ArticleSection;
