import React, { useRef } from 'react';
import { FEATURED_VIDEO, VIDEOS } from '../constants';
import { Play, Youtube, ExternalLink, Radio } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Video } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

const VideoCard: React.FC<{ video: Video; index: number }> = ({ video, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Parallax translation
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: "easeOut" }}
    >
      {/* Wrapper div to hold the ref for stable scroll measurement */}
      <div ref={ref}>
        <motion.div 
          style={{ y }}
          className="group cursor-pointer"
        >
          {/* Card Image Container - Light: light gray, Dark: dark gray/black */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-eh-gray aspect-[4/3] mb-6 transition-colors duration-500">
             <img 
              src={video.imageUrl} 
              alt={video.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
            />
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
              {video.duration}
            </div>
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
             </div>
          </div>
          
          <div className="pr-4">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">{video.category}</span>
            <h4 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-[1] transition-colors duration-300 text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400">
              {video.title}
            </h4>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const VideoSection: React.FC = () => {
  // Ref for featured video parallax
  const featuredRef = useRef<HTMLDivElement>(null);
  const { t } = useThemeLanguage();
  const { scrollYProgress } = useScroll({
    target: featuredRef,
    offset: ["start end", "end start"]
  });
  
  // Image parallax inside the container
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
      
      {/* YouTube Channel Promotion Banner - Redesigned */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24 relative overflow-hidden rounded-[2.5rem] bg-gray-50 dark:bg-[#0a0a0a] text-black dark:text-white border border-gray-200 dark:border-white/5 shadow-2xl transition-colors duration-500"
      >
         {/* Background Atmosphere */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Grid Pattern - Adapted for Light/Dark */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
            
            {/* Red Glow / Event Horizon Effect */}
            <div className="absolute -right-[10%] top-1/2 -translate-y-1/2 w-[60%] h-[150%] bg-red-500/10 dark:bg-red-600/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen"></div>
            <div className="absolute -left-[10%] -bottom-[20%] w-[40%] h-[80%] bg-blue-500/10 dark:bg-blue-900/10 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen"></div>
         </div>

         <div className="relative z-10 p-8 md:p-16 flex flex-col lg:flex-row justify-between items-center gap-12">
            
            <div className="flex-1 text-center lg:text-left space-y-6">
              {/* Header Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 backdrop-blur-sm mb-2 shadow-sm dark:shadow-none transition-colors duration-500">
                 <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                 </span>
                 <span className="text-xs font-black tracking-[0.2em] uppercase text-gray-600 dark:text-gray-300">Chaîne Officielle</span>
              </div>

              {/* Main Title with Hollow Effect */}
              <div className="relative">
                <h2 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-b from-black to-gray-500 dark:from-white dark:to-white/40 transition-all duration-500">Event</span>
                  <span className="block text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.3)] dark:[-webkit-text-stroke:1px_rgba(255,255,255,0.3)] transition-all duration-500">Horizon</span>
                </h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-lg font-medium leading-relaxed mx-auto lg:mx-0 transition-colors duration-500">
                Rejoignez l'élite de l'industrie spatiale. Reportages exclusifs, lancements en direct et analyses techniques.
              </p>
            </div>
            
            {/* Right Side CTA */}
            <div className="flex flex-col items-center gap-6 shrink-0">
               <a 
                 href="#" 
                 className="group relative px-10 py-6 bg-black text-white dark:bg-white dark:text-black rounded-full overflow-hidden transition-all hover:scale-105 shadow-xl dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]"
               >
                 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/50 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                 <div className="relative flex items-center gap-3">
                   <Youtube size={24} className="text-red-500 dark:text-red-600 fill-red-500 dark:fill-red-600" />
                   <span className="font-black text-sm tracking-widest uppercase">S'abonner à la chaîne</span>
                 </div>
               </a>
               <span className="text-xs font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest">Rejoignez 150k+ passionnés</span>
            </div>

         </div>
      </motion.div>


      <div className="mb-16 flex items-end justify-between">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black dark:text-white transition-colors duration-500">
          {t('videos_title')}
        </h2>
        <span className="hidden md:block text-sm font-bold uppercase tracking-widest text-gray-400">
          {t('videos_subtitle')}
        </span>
      </div>

      {/* Featured Video */}
      <div className="mb-24" ref={featuredRef}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="group cursor-pointer"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-100 dark:bg-eh-gray aspect-video md:aspect-[21/9] transition-colors duration-500">
            <motion.div style={{ y: imageY }} className="w-full h-[120%] -mt-[10%]">
              <img 
                src={FEATURED_VIDEO.imageUrl} 
                alt={FEATURED_VIDEO.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/30">
                  <Play className="w-8 h-8 text-white fill-white" />
               </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="max-w-4xl">
              <span className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{FEATURED_VIDEO.category} — {FEATURED_VIDEO.duration}</span>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] transition-colors duration-300 text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400">
                {FEATURED_VIDEO.title}
              </h3>
            </div>
            <button className="hidden md:block px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-full uppercase text-xs font-bold tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex-shrink-0 text-black dark:text-white">
              {t('videos_watch')}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
        {VIDEOS.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default VideoSection;