
import React, { useRef, useState } from 'react';
import { FEATURED_VIDEO, VIDEOS } from '../constants';
import { Play, Radio, ArrowUpRight, X, Loader2 } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Video } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

// --- VIDEO UTILS ---
const getYouTubeId = (url: string | undefined) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// --- VIDEO PLAYER MODAL ---
const VideoModal: React.FC<{ video: Video | null; onClose: () => void }> = ({ video, onClose }) => {
    if (!video) return null;
    const videoId = getYouTubeId(video.videoUrl);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-12"
            onClick={onClose}
        >
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-50"
            >
                <X size={32} />
            </button>

            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
                {videoId ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    ></iframe>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white">
                        <Loader2 size={48} className="animate-spin mb-4 opacity-50" />
                        <p>Chargement de la source...</p>
                        <a 
                            href={video.videoUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="mt-4 underline text-blue-400"
                        >
                            Ouvrir dans une nouvelle fenêtre
                        </a>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

const VideoCard: React.FC<{ video: Video; index: number; onPlay: (v: Video) => void }> = ({ video, index, onPlay }) => {
  const { t } = useThemeLanguage();
  const title = t(`video_${video.id}_title`);
  const category = t(`video_${video.id}_cat`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay: Math.min((index % 3) * 0.05, 0.2), ease: "easeOut" }}
      className="group cursor-pointer"
      onClick={() => onPlay(video)}
    >
      <div className="block h-full">
        <div>
          {/* Card Image Container */}
          <div className="relative overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 aspect-video mb-4 transition-colors duration-500 border border-black/5 dark:border-white/5">
             <img 
              src={video.imageUrl} 
              alt={title} 
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10">
              {video.duration}
            </div>
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                </div>
             </div>
          </div>
          
          <div className="pr-2">
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest border border-blue-600/20 dark:border-blue-400/20 px-2 py-0.5 rounded-full">{category}</span>
            </div>
            <h4 className="text-base md:text-lg font-bold leading-tight transition-colors duration-300 text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 line-clamp-2">
              {title}
            </h4>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VideoSection: React.FC = () => {
  const featuredRef = useRef<HTMLDivElement>(null);
  const { t } = useThemeLanguage();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  // Keep parallax only for the main featured video which is singular
  const { scrollYProgress } = useScroll({
    target: featuredRef,
    offset: ["start end", "end start"]
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const featuredTitle = t(`video_${FEATURED_VIDEO.id}_title`);
  const featuredCat = t(`video_${FEATURED_VIDEO.id}_cat`);

  return (
    <>
      <AnimatePresence>
          {selectedVideo && (
              <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
          )}
      </AnimatePresence>

      <motion.section 
        id="videos" 
        className="pt-24 pb-24" // Removed global padding here to handle mobile full-width banner
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        {/* YouTube Channel Promotion Banner - Margin Bottom 12 for consistency */}
        <div className="max-w-[1800px] mx-auto md:px-12">
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 relative overflow-hidden rounded-none md:rounded-3xl bg-gray-50 dark:bg-[#080808] text-black dark:text-white border-y md:border border-gray-200 dark:border-white/10 shadow-sm transition-colors duration-500"
            >
            {/* Background Tech Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>

            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8">
                
                <div className="flex flex-row items-center gap-6 w-full md:w-auto">
                    {/* Technical Logo Placeholder */}
                    <div className="hidden md:flex w-16 h-16 border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 items-center justify-center rounded-lg">
                        <Radio className="w-6 h-6 text-black dark:text-white opacity-80" />
                    </div>
                    
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Transmission Entrante</span>
                        </div>
                        <h2 className="text-xl md:text-3xl font-bold tracking-tighter uppercase text-black dark:text-white">
                        {t('videos_channel')}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mt-2 font-medium">
                        {t('videos_channel_desc')}
                        </p>
                    </div>
                </div>
                
                {/* Right Side CTA */}
                <a 
                    href="https://www.youtube.com/results?search_query=cnes" 
                    target="_blank"
                    rel="noreferrer"
                    className="group relative px-6 py-3 bg-transparent border border-black dark:border-white text-black dark:text-white overflow-hidden transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black w-full md:w-auto text-center rounded-md"
                >
                    <div className="relative flex items-center justify-center gap-3">
                    <span className="font-bold text-xs tracking-[0.2em] uppercase">{t('videos_access')}</span>
                    <ArrowUpRight size={14} />
                    </div>
                </a>

            </div>
            </motion.div>
        </div>


        {/* Section Header */}
        <div className="max-w-[1800px] mx-auto px-4 md:px-12 mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-l-4 border-black dark:border-white pl-6">
          <div>
               <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-black dark:text-white transition-colors duration-500">
               {t('videos_title')}
               </h2>
               <p className="text-gray-500 text-base md:text-lg max-w-md">
                 {t('videos_subtitle')}
               </p>
          </div>
          <a href="#" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-blue-500 transition-colors pb-1">
             Voir tout <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Featured Video - Margin Bottom 12 for consistency */}
        <div className="max-w-[1800px] mx-auto px-4 md:px-12 mb-12" ref={featuredRef}>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="group cursor-pointer relative"
            onClick={() => setSelectedVideo(FEATURED_VIDEO)}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 aspect-video md:aspect-[21/9] transition-colors duration-500 border border-black/5 dark:border-white/5">
              <motion.div style={{ y: imageY }} className="w-full h-[120%] -mt-[10%]">
                <img 
                  src={FEATURED_VIDEO.imageUrl} 
                  alt={featuredTitle} 
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80';
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row justify-between items-end gap-6">
                  <div>
                      <span className="inline-block px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest mb-3 rounded-full">{t('videos_featured')}</span>
                      <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-white mb-2">
                          {featuredTitle}
                      </h3>
                      <p className="text-white/70 text-xs md:text-sm font-mono">{featuredCat} // {FEATURED_VIDEO.duration}</p>
                  </div>
                  
                  <button className="w-12 h-12 md:w-14 md:h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                      <Play className="w-5 h-5 fill-current ml-1" />
                  </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Grid Layout - 10 Videos */}
        <div className="max-w-[1800px] mx-auto px-4 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {VIDEOS.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} onPlay={setSelectedVideo} />
          ))}
        </div>
        
        <div className="max-w-[1800px] mx-auto px-4 md:px-12 mt-16 text-center md:hidden">
          <a href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-black dark:border-white pb-1">
            {t('videos_subtitle')} <ArrowUpRight size={14} />
          </a>
        </div>

      </motion.section>
    </>
  );
};

export default VideoSection;
