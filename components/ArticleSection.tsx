
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
      className="snap-start shrink-0 w-[85vw] md:w-[340px] h-[480px]"
    >
        <div className="group cursor-pointer h-full relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-500 bg-gray-900">
          
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
             <div className="absolute inset-0 bg-gray-800 animate-pulse" /> {/* Loading placeholder behind image */}
             <img 
                src={article.imageUrl} 
                alt={title} 
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
             />
          </div>
          
          {/* Gradient Overlay - Darker at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

          {/* Top Tags */}
          <div className="absolute top-4 right-4 z-20">
             <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white/90">
                <FileText size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{article.date}</span>
             </div>
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end h-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
             <div className="mt-auto">
                <h3 className="text-2xl font-serif font-bold leading-tight mb-3 text-white drop-shadow-md group-hover:text-blue-300 transition-colors">
                  {title}
                </h3>
                
                <div className="overflow-hidden transition-all duration-500 max-h-[0px] opacity-0 group-hover:max-h-[100px] group-hover:opacity-100">
                    <p className="text-gray-300 text-sm font-medium leading-relaxed line-clamp-3 border-t border-white/20 pt-3 mb-4">
                      {summary}
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                   {t('article_read_more')} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
                </div>
             </div>
          </div>

          {/* Hover Border Effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 rounded-2xl transition-colors duration-500 pointer-events-none"></div>
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
      const scrollAmount = direction === 'left' ? -360 : 360;
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
      <div className="px-4 md:px-12 max-w-[1800px] mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-8 border-l-4 border-black dark:border-white pl-6">
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
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      
      {/* Mobile Scroll Indicator */}
      <div className="flex md:hidden justify-center mt-4 gap-1">
         <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white opacity-50"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      </div>

    </motion.section>
  );
};

export default ArticleSection;
