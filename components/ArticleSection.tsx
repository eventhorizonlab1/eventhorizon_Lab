import React, { useRef, useState } from 'react';
import { ARTICLES } from '../constants';
import { ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Article } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.2, 0.8, 0.2, 1]
    }
  }
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useThemeLanguage();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Vertical shift based on scroll position
  const y = useTransform(scrollYProgress, [0, 1], [50, -100]);

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      className="snap-center shrink-0 w-[85vw] md:w-[30vw]"
    >
      <div ref={ref}>
        <motion.div 
          style={{ y }}
          className="group cursor-pointer h-full flex flex-col"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-eh-gray aspect-[3/4] mb-8 transition-colors duration-500">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex-grow flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">{article.date}</span>
              <ArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-black dark:text-white" size={16} />
            </div>
            <h3 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] mb-6 transition-colors duration-300 text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400">
              {article.title}
            </h3>
            <p className={`text-gray-500 dark:text-gray-400 text-sm font-medium transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
              {article.summary}
            </p>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors self-start"
            >
              {isExpanded ? (
                <>
                  <Minus size={14} />
                  {t('article_read_less')}
                </>
              ) : (
                <>
                  <Plus size={14} />
                  {t('article_read_more')}
                </>
              )}
            </button>
          </div>
        </motion.div>
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
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <motion.section 
      id="articles" 
      className="py-32 bg-white dark:bg-eh-black relative border-t border-gray-100 dark:border-gray-800 transition-colors duration-500"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="px-4 md:px-12 max-w-[1800px] mx-auto mb-16 flex justify-between items-end">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-black dark:text-white">
            {t('articles_title')}
          </h2>
          <p className="text-gray-500 text-lg max-w-md">
            {t('articles_subtitle')}
          </p>
        </div>
        
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll('left')} className="p-4 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <button onClick={() => scroll('right')} className="p-4 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white transition-colors">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 md:px-12 gap-8 pb-12 items-start"
        style={{ scrollPaddingLeft: '3rem', scrollPaddingRight: '3rem' }}
      >
        {ARTICLES.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </motion.section>
  );
};

export default ArticleSection;