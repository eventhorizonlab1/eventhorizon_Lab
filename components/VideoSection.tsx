import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Play, X, Clock, ExternalLink, Radio, ArrowUpRight } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { fetchAPI } from '../src/lib/api';
import { Video } from '../types';
import { createPortal } from 'react-dom';

// --- UTILS ---
const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// --- COMPONENTS ---

const VideoModalContent: React.FC<{ video: Video; onClose: () => void }> = ({ video, onClose }) => {
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
    const { t } = useThemeLanguage();
    const videoId = getYouTubeId(video.videoUrl);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Focus Trap
    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        modalRef.current?.focus();
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-6xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
                    aria-label={t('common_close')}
                >
                    <X size={24} />
                </button>

                {/* Video Player Container */}
                <motion.div
                    className="w-full md:w-2/3 bg-black relative aspect-video md:aspect-auto"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {!isIframeLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                    {videoId ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                            title={video.title}
                            className={`w-full h-full absolute inset-0 transition-opacity duration-500 ${isIframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => setIsIframeLoaded(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/50">
                            Video unavailable
                        </div>
                    )}
                </motion.div>

                {/* Info Section */}
                <motion.div
                    className="w-full md:w-1/3 p-6 md:p-8 overflow-y-auto border-l border-white/5 bg-gradient-to-b from-white/5 to-transparent"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 rounded border border-blue-500/20">
                                    {video.category}
                                </span>
                                {video.subcategory && (
                                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/60 rounded border border-white/10">
                                        {video.subcategory}
                                    </span>
                                )}
                            </div>
                            <h2 id="modal-title" className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                                {video.title}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-white/40 font-mono">
                                <span className="flex items-center gap-1.5">
                                    <Clock size={14} />
                                    {video.duration}
                                </span>
                            </div>
                        </div>

                        <div className="w-full h-px bg-white/10" />

                        <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed">
                            <p>{video.description}</p>
                        </div>

                        <div className="mt-auto pt-6">
                            <a
                                href={video.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors rounded"
                            >
                                <span>{t('video_watch_youtube')}</span>
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const VideoCard: React.FC<{ video: Video; index: number; onPlay: (v: Video) => void }> = React.memo(({ video, index, onPlay }) => {
    const { t } = useThemeLanguage();

    // Fallback image if imageUrl is empty or invalid
    const bgImage = video.imageUrl || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80';

    return (
        <motion.button
            layoutId={`video-${video.title}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 text-left w-full"
            onClick={() => onPlay(video)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onPlay(video);
                }
            }}
            aria-label={`${t('common_play')} ${video.title}`}
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={bgImage}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                        <Play className="fill-white text-white ml-1" size={32} />
                    </div>
                </div>

                <div className="relative z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500 text-white rounded shadow-lg shadow-blue-500/20">
                            {video.category}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/70 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                            <Clock size={10} />
                            {video.duration}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-400 transition-colors duration-300">
                        {video.title}
                    </h3>
                </div>
            </div>
        </motion.button>
    );
});

const VideoSection: React.FC = () => {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useThemeLanguage();
    const [searchParams, setSearchParams] = useSearchParams();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    // Fetch Videos from Strapi
    useEffect(() => {
        const getVideos = async () => {
            try {
                // Note: Ensure your Strapi API permissions are set to Public for 'find'
                const res = await fetchAPI('/videos', { populate: '*' });
                if (res && res.data) {
                    const fetchedVideos = res.data;
                    setVideos(fetchedVideos);
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getVideos();
    }, []);

    // Sync URL -> State
    useEffect(() => {
        const videoId = searchParams.get('video');
        if (videoId && videos.length > 0) {
            const found = videos.find(v => String(v.title) === videoId || String(v.videoUrl).includes(videoId));
            if (found) setSelectedVideo(found);
        } else if (!videoId) {
            setSelectedVideo(null);
        }
    }, [searchParams, videos]);

    // Sync State -> URL
    const handleVideoSelect = (video: Video | null) => {
        if (video) {
            setSelectedVideo(video);
            setSearchParams({ video: video.title }, { replace: false });

            const newParams = new URLSearchParams(searchParams);
            newParams.set('video', video.title);
            newParams.delete('article');
            newParams.delete('partner');
            setSearchParams(newParams, { replace: false });

        } else {
            setSelectedVideo(null);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('video');
            setSearchParams(newParams, { replace: false });
        }
    };

    const categories = ['All', ...Array.from(new Set(videos.map(v => v.category)))];
    const filteredVideos = filter === 'All' ? videos : videos.filter(v => v.category === filter);

    return (
        <>
            {createPortal(
                <AnimatePresence>
                    {selectedVideo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100]"
                        >
                            <Helmet>
                                <title>{`${selectedVideo.title} - Event Horizon`}</title>
                                <meta name="description" content={selectedVideo.description} />
                                <meta property="og:title" content={selectedVideo.title} />
                                <meta property="og:description" content={selectedVideo.description} />
                                <meta property="og:image" content={selectedVideo.imageUrl} />
                            </Helmet>
                            <VideoModalContent video={selectedVideo} onClose={() => handleVideoSelect(null)} />
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <section id="videos" ref={containerRef} className="relative py-32 bg-[#0a0a0a] overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-2xl"
                        >
                            <div className="flex items-center gap-2 text-blue-500 mb-4">
                                <Radio className="animate-pulse" size={16} />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">{t('video_live_feed')}</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                                {t('videos_title')}
                            </h2>
                            <p className="text-lg text-white/60 max-w-lg leading-relaxed">
                                {t('video_subtitle')}
                            </p>
                        </motion.div>

                        {/* Filter Tabs */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-wrap gap-2"
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${filter === cat
                                        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                        : 'bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </motion.div>
                    </div>

                    {/* Video Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {filteredVideos.map((video, index) => (
                                <VideoCard
                                    key={index}
                                    video={video}
                                    index={index}
                                    onPlay={handleVideoSelect}
                                />
                            ))}
                        </div>
                    )}

                    {!isLoading && filteredVideos.length === 0 && (
                        <div className="text-center text-white/40 py-20">
                            <p>No videos found.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default VideoSection;
