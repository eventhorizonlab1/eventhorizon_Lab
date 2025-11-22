
import React, { useRef } from 'react';
import { FEATURED_VIDEO, VIDEOS } from '../constants';
import { Play, Youtube, Radio, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Video } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

const VideoCard: React.FC<{ video: Video; index: number }> = ({ video, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Subtle parallax
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05, ease: "easeOut" }}
      className="group cursor-pointer"
    >
      <div ref={ref}>
        <motion.div style={{ y }}>
          {/* Card Image Container */}
          <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-eh-gray aspect-video mb-4 transition-colors duration-500 border border-black/5 dark:border-white/5">
             <img 
              src={video.imageUrl} 
              alt={video.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10">
              {video.duration}
            </div>
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                </div>
             </div>
          </div>
          
          <div className="pr-2">
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest border border-blue-600/20 dark:border-blue-400/20 px-2 py-0.5 rounded-full">{video.category}</span>
            </div>
            <h4 className="text-lg font-bold leading-tight transition-colors duration-300 text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 line-clamp-2">
              {video.title}
            </h4>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const VideoSection: React.FC = () => {
  const featuredRef = useRef<HTMLDivElement>(null);
  const { t } = useThemeLanguage();
  const { scrollYProgress } = useScroll({
    target: featuredRef,
    offset: ["start end", "end start"]
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <motion.section 
      id="videos" 
      className="py-24 px-4 md:px-12 max-w-[1800px] mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      
      {/* REDESIGNED: YouTube Channel Promotion Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24 relative overflow-hidden rounded-none md:rounded-3xl bg-gray-50 dark:bg-[#080808] text-black dark:text-white border-y md:border border-gray-200 dark:border-white/10 shadow-sm transition-colors duration-500"
      >
         {/* Background Tech Grid */}
         <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
         </div>

         <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-10">
            
            <div className="flex flex-row items-center gap-6 w-full md:w-auto">
               {/* Technical Logo Placeholder */}
               <div className="hidden md:flex w-20 h-20 border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 items-center justify-center rounded-lg">
                  <Radio className="w-8 h-8 text-black dark:text-white opacity-80" />
               </div>
               
               <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                     <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Transmission Entrante</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tighter uppercase text-black dark:text-white">
                    Chaîne Officielle
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md mt-2 font-medium">
                    Reportages, Lancements et Directs du CNES.
                  </p>
               </div>
            </div>
            
            {/* Right Side CTA */}
            <a 
              href="https://www.youtube.com/results?search_query=cnes" 
              target="_blank"
              rel="noreferrer"
              className="group relative px-8 py-4 bg-transparent border border-black dark:border-white text-black dark:text-white overflow-hidden transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black w-full md:w-auto text-center"
            >
              <div className="relative flex items-center justify-center gap-3">
                <span className="font-bold text-xs tracking-[0.2em] uppercase">Accéder au flux</span>
                <ArrowUpRight size={16} />
              </div>
            </a>

         </div>
      </motion.div>


      <div className="mb-12 flex items-end justify-between border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
             <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 block">Médiathèque</span>
             <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black dark:text-white transition-colors duration-500">
             {t('videos_title')}
             </h2>
        </div>
        <a href="#" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-blue-500 transition-colors">
          {t('videos_subtitle')} <ArrowUpRight size={14} />
        </a>
      </div>

      {/* Featured Video */}
      <div className="mb-16" ref={featuredRef}>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="group cursor-pointer relative"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-eh-gray aspect-video md:aspect-[21/9] transition-colors duration-500 border border-black/5 dark:border-white/5">
            <motion.div style={{ y: imageY }} className="w-full h-[120%] -mt-[10%]">
              <img 
                src={FEATURED_VIDEO.imageUrl} 
                alt={FEATURED_VIDEO.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <span className="inline-block px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest mb-3 rounded-full">À la une</span>
                    <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white mb-2">
                        {FEATURED_VIDEO.title}
                    </h3>
                    <p className="text-white/70 text-sm font-mono">{FEATURED_VIDEO.category} // {FEATURED_VIDEO.duration}</p>
                </div>
                
                <button className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    <Play className="w-5 h-5 fill-current ml-1" />
                </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid Layout - 10 Videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
        {VIDEOS.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} />
        ))}
      </div>
      
      <div className="mt-16 text-center md:hidden">
        <a href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-black dark:border-white pb-1">
          {t('videos_subtitle')} <ArrowUpRight size={14} />
        </a>
      </div>

    </motion.section>
  );
};

export default VideoSection;
