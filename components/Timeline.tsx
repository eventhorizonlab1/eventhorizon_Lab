
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MILESTONES } from '../constants';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

const TimelineItem: React.FC<{ data: typeof MILESTONES[0], index: number }> = React.memo(({ data, index }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const { t } = useThemeLanguage();
  
  const title = t(`milestone_${index}_title`);
  const description = t(`milestone_${index}_desc`);

  // Parallax for text
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  
  return (
    <div 
      ref={ref} 
      role="listitem"
      className={`relative flex items-center justify-center w-full mb-20 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
       {/* Spacer */}
       <div className="hidden md:block w-1/2" />
       
       {/* Node on the line */}
       <div 
         className="absolute left-4 md:left-1/2 top-0 w-12 h-12 -translate-x-1/2 flex items-center justify-center z-10"
         aria-hidden="true"
       >
          <motion.div 
             initial={{ scale: 0 }}
             whileInView={{ scale: 1 }}
             viewport={{ once: true }}
             transition={{ type: "spring", stiffness: 200, damping: 20 }}
             className="w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] dark:shadow-[0_0_20px_rgba(59,130,246,0.5)] border-2 border-white dark:border-white relative z-10"
          >
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          </motion.div>
       </div>

       {/* Content */}
       <motion.div
         style={{ y }}
         initial={{ opacity: 0, filter: "blur(10px)" }}
         whileInView={{ opacity: 1, filter: "blur(0px)" }}
         viewport={{ once: true, margin: "-100px" }}
         transition={{ duration: 0.8 }}
         className="w-full pl-16 md:pl-0 md:w-1/2 md:px-12"
       >
          <div className={`flex flex-col ${isEven ? 'md:text-right items-start md:items-end' : 'md:text-left items-start'} group`}>
             <span 
                className="text-7xl font-black text-gray-200 dark:text-white/5 tracking-tighter absolute -z-10 -translate-y-8 select-none transition-all duration-700 group-hover:text-gray-300 dark:group-hover:text-white/10 group-hover:scale-110"
                aria-hidden="true"
             >
                {data.year}
             </span>
             
             <article 
                className="relative p-6 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:border-blue-500 transition-colors duration-300 w-full md:w-auto shadow-lg dark:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent"
                tabIndex={0}
                aria-labelledby={`milestone-title-${index}`}
             >
                <span 
                  className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1 block"
                  aria-label={`Year ${data.year}`}
                >
                    {data.year}
                </span>
                <h4 
                  id={`milestone-title-${index}`}
                  className="text-lg font-bold text-black dark:text-white uppercase tracking-wide mb-2"
                >
                    {title}
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {description}
                </p>
             </article>
          </div>
       </motion.div>
    </div>
  );
});

const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useThemeLanguage();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"]
  });

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="history" className="relative py-16 md:py-24 px-4" aria-label={t('hero_history_title')}>
       <div className="text-center mb-20">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-black dark:text-white tracking-tighter mb-4"
          >
            {t('hero_history_title')}
          </motion.h3>
          <p className="text-gray-500 dark:text-gray-400">{t('hero_history_sub')}</p>
       </div>

       <div ref={containerRef} className="relative max-w-6xl mx-auto px-4" role="list">
          {/* Background Track */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-white/10 -translate-x-1/2" aria-hidden="true" />
          
          {/* Animated Progress Line */}
          <motion.div 
             style={{ height }}
             className="absolute left-4 md:left-1/2 top-0 w-px bg-gradient-to-b from-blue-600 via-purple-600 to-blue-600 dark:from-blue-500 dark:via-purple-500 dark:to-blue-500 -translate-x-1/2 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
             aria-hidden="true"
          />

          {MILESTONES.map((milestone, index) => (
             <TimelineItem key={index} data={milestone} index={index} />
          ))}
       </div>
    </section>
  );
};

export default Timeline;
