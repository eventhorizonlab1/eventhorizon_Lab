
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { FEATURED_VIDEO, VIDEOS } from '../constants';
import { Play, Radio, ArrowUpRight, X, ExternalLink, Filter, Clock, Hash } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Video } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// --- YOUTUBE-STYLE: RICH CONTENT MODAL ---
const VideoModalContent: React.FC<{ video: Video }> = ({ video }) => {
    const [shouldLoadIframe, setShouldLoadIframe] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const { t } = useThemeLanguage();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        setShouldLoadIframe(false);
        setIframeLoaded(false);
        const timer = setTimeout(() => setShouldLoadIframe(true), 450); 
        return () => clearTimeout(timer);
    }, [video]);

    const videoId = getYouTubeId(video.videoUrl);
    
    const translatedTitle = t(`video_${video.id}_title`);
    const title = translatedTitle.startsWith('video_') ? video.title : translatedTitle;
    
    // Fallback for description if not in constants yet (though we added it)
    const description = video.description || t(`video_${video.id}_desc`) || "Aucune description disponible pour cette vidéo.";

    return (
        <div 
            className="flex flex-col w-full max-w-5xl gap-6 h-full md:h-auto" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
        >
            {/* VIDEO PLAYER CONTAINER */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full aspect-video bg-black rounded-none md:rounded-2xl overflow-hidden shadow-2xl border-0 md:border border-white/10 shrink-0"
            >
                {!videoId ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white p-8 text-center bg-gray-900 relative z-10">
                        <p className="text-lg font-bold mb-2">Vidéo non disponible</p>
                        <p className="text-sm text-gray-400 mb-6">L'URL de la vidéo semble incorrecte.</p>
                    </div>
                ) : (
                    <>
                        <div className="absolute inset-0 w-full h-full bg-gray-900 flex items-center justify-center z-0">
                            <img 
                                src={video.imageUrl} 
                                alt={title} 
                                className="absolute inset-0 w-full h-full object-cover opacity-40 blur-md scale-105" 
                            />
                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-full border-2 border-white/20 border-t-white flex items-center justify-center animate-spin"></div>
                                <span className="text-xs font-bold uppercase tracking-widest text-white/80">Chargement...</span>
                            </div>
                        </div>

                        {shouldLoadIframe && (
                            <motion.iframe
                                initial={{ opacity: 0 }}
                                animate={{ opacity: iframeLoaded ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                                onLoad={() => setIframeLoaded(true)}
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                                title={title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full z-10"
                            ></motion.iframe>
                        )}
                    </>
                )}
            </motion.div>

            {/* YOUTUBE-STYLE INFO SECTION */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4 text-white px-4 md:px-0 overflow-y-auto md:overflow-visible pb-10 md:pb-0"
            >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <h3 id="video-modal-title" className="text-xl md:text-2xl font-bold leading-tight">{title}</h3>
                    
                    <a 
                        href={video.videoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#ff0000] hover:bg-[#cc0000] text-white rounded-full text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap shadow-lg shrink-0"
                    >
                        <span>YouTube</span>
                        <ExternalLink size={14} />
                    </a>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded text-white text-xs font-bold uppercase tracking-wider">
                        <Hash size={12} />
                        {video.category}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {video.duration}
                    </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
                        {description}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

const VideoCard: React.FC<{ video: Video; index: number; onPlay: (v: Video) => void }> = React.memo(({ video, index, onPlay }) => {
  const { t } = useThemeLanguage();
  const title = t(`video_${video.id}_title`);
  const category = t(`video_${video.id}_cat`);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group cursor-pointer snap-start shrink-0 w-[80vw] md:w-[45vw] lg:w-auto transform-gpu"
      onClick={() => onPlay(video)}
    >
      <div className="block h-full">
        <div>
          {/* Thumbnail Container */}
          <div className="relative overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 aspect-video mb-3 transition-colors duration-500 border border-black/5 dark:border-white/5 shadow-sm group-hover:shadow-lg">
             <img 
              src={video.imageUrl} 
              alt={title} 
              loading="lazy"
              decoding="async" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
            
            {/* YouTube-style Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] tracking-wide">
              {video.duration}
            </div>

            {/* Play Button Overlay */}
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                </div>
             </div>
          </div>
          
          {/* Meta Data */}
          <div className="pr-2">
            <h4 className="text-base md:text-lg font-bold leading-tight transition-colors duration-300 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mb-1">
              {title}
            </h4>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{category}</span>
                <span className="w-0.5 h-0.5 bg-gray-400 rounded-full"></span>
                <span className="text-[10px] text-gray-400">Event Horizon</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const VideoSection: React.FC = () => {
  const featuredRef = useRef<HTMLDivElement>(null);
  const { t } = useThemeLanguage();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  
  const { scrollYProgress } = useScroll({
    target: featuredRef,
    offset: ["start end", "end start"]
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const featuredTitle = t(`video_${FEATURED_VIDEO.id}_title`);
  const featuredCat = t(`video_${FEATURED_VIDEO.id}_cat`);

  // Extract unique categories for the filter list
  const categories = useMemo(() => {
    const cats = new Set(VIDEOS.map(v => v.category));
    return ['ALL', ...Array.from(cats)];
  }, []);

  // Filter videos based on selection
  const filteredVideos = useMemo(() => {
    if (activeCategory === 'ALL') return VIDEOS;
    return VIDEOS.filter(v => v.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <AnimatePresence>
          {selectedVideo && createPortal(
              <motion.div
                key="video-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-12"
                onClick={() => setSelectedVideo(null)}
              >
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideo(null);
                    }}
                    className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 backdrop-blur-md"
                    aria-label={t('common_close')}
                  >
                    <X size={24} />
                  </button>
                  
                  <VideoModalContent video={selectedVideo} />
              </motion.div>,
              document.body
          )}
      </AnimatePresence>

      <motion.section 
        id="videos" 
        className="py-16 md:py-24" 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        {/* TRANSMISSION HEADER */}
        <div className="max-w-[1800px] mx-auto md:px-12">
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 relative overflow-hidden rounded-none md:rounded-3xl bg-gray-50 dark:bg-[#080808] text-black dark:text-white border-y md:border border-gray-200 dark:border-white/10 shadow-sm transition-colors duration-500"
            >
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>

            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8">
                
                <div className="flex flex-row items-center gap-6 w-full md:w-auto">
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
                
                <a 
                    href="https://www.youtube.com/@EventHorizonLab-n9g" 
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

        {/* SECTION TITLE & FILTERS */}
        <div className="max-w-[1800px] mx-auto px-4 md:px-12 mb-8">
            <div className="flex flex-col gap-6">
                <div className="border-l-4 border-black dark:border-white pl-3 md:pl-6 -ml-4 md:-ml-7">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-black dark:text-white transition-colors duration-500">
                    {t('videos_title')}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-md">
                        {t('videos_subtitle')}
                    </p>
                </div>

                {/* YOUTUBE-STYLE CHIPS (FILTERS) */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-fade">
                    <div className="flex items-center justify-center w-8 h-8 shrink-0 text-gray-400">
                        <Filter size={16} />
                    </div>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`
                                px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all duration-300 border
                                ${activeCategory === cat 
                                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md transform scale-105' 
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-white/10'}
                            `}
                        >
                            {cat === 'ALL' ? 'Tout' : cat}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* FEATURED VIDEO */}
        <div className="max-w-[1800px] mx-auto px-4 md:px-12 mb-12" ref={featuredRef}>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="group cursor-pointer relative"
            onClick={() => setSelectedVideo(FEATURED_VIDEO)}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 aspect-video md:aspect-[21/9] transition-colors duration-500 border border-black/5 dark:border-white/5 transform-gpu">
              <motion.div style={{ y: imageY }} className="w-full h-[120%] -mt-[10%] will-change-transform">
                <img 
                  src={FEATURED_VIDEO.imageUrl} 
                  alt={featuredTitle} 
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80';
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row justify-between items-end gap-6">
                  <div>
                      <span className="inline-block px-3 py-1 bg-[#ff0000] text-white text-[10px] font-bold uppercase tracking-widest mb-3 rounded-full shadow-lg">{t('videos_featured')}</span>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter uppercase text-white mb-2 max-w-3xl">
                          {featuredTitle}
                      </h3>
                      <p className="text-white/80 text-xs md:text-sm font-medium max-w-2xl line-clamp-2 md:line-clamp-none">
                          {FEATURED_VIDEO.description}
                      </p>
                  </div>
                  
                  <button className="w-14 h-14 md:w-16 md:h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] shrink-0">
                      <Play className="w-6 h-6 fill-current ml-1" />
                  </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* VIDEOS GRID/LIST */}
        <div className="max-w-[1800px] mx-auto px-4 md:px-12 flex overflow-x-auto lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-x-6 md:gap-y-12 snap-x snap-mandatory lg:snap-none no-scrollbar pb-8 md:pb-0 touch-pan-x min-h-[300px]" style={{ WebkitOverflowScrolling: 'touch' }}>
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video, index) => (
                <VideoCard key={video.id} video={video} index={index} onPlay={setSelectedVideo} />
            ))}
          </AnimatePresence>
          
          {filteredVideos.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                  <p className="text-lg">Aucune vidéo dans cette catégorie.</p>
                  <button onClick={() => setActiveCategory('ALL')} className="mt-4 text-blue-500 hover:underline">Voir tout</button>
              </div>
          )}
        </div>
        
        {/* SCROLL INDICATOR (Mobile/Tablet) */}
        <div className="flex lg:hidden justify-center gap-1 mt-2 mb-8">
             <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white opacity-50"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>

      </motion.section>
    </>
  );
};

export default VideoSection;
