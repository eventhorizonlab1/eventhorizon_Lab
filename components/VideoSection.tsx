import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ExternalLink, Radio } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { fetchVideos } from '../src/lib/api';
import { Video } from '../types';
import { createPortal } from 'react-dom';
import VideoCard3D from './VideoCard3D';
import { useCinematicAudio } from '../src/hooks/useCinematicAudio';

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

const VideoSection: React.FC = () => {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useThemeLanguage();
    const [searchParams, setSearchParams] = useSearchParams();
    const { playClick, playHover } = useCinematicAudio();

    // Fetch Videos from Strapi (or fallback)
    useEffect(() => {
        const getVideos = async () => {
            try {
                const fetchedVideos = await fetchVideos();
                setVideos(fetchedVideos);
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

            <section id="videos" ref={containerRef} className="relative py-32 bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden transition-colors duration-500">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

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
                            <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6 tracking-tight transition-colors">
                                {t('videos_title')}
                            </h2>
                        </motion.div>

                        {/* Filter Tabs (YouTube Style) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full overflow-x-auto pb-4 no-scrollbar"
                        >
                            <div className="flex gap-3 min-w-max px-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            playClick();
                                            setFilter(cat);
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${filter === cat
                                            ? 'bg-black text-white dark:bg-white dark:text-black'
                                            : 'bg-black/5 text-black hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Video Content */}
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Featured Video */}
                            {filteredVideos.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden group cursor-pointer border border-black/10 dark:border-white/10 shadow-xl"
                                    onClick={() => {
                                        playClick();
                                        handleVideoSelect(filteredVideos[0]);
                                    }}
                                    onMouseEnter={() => playHover()}
                                >
                                    <img
                                        src={filteredVideos[0].imageUrl}
                                        alt={filteredVideos[0].title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                                    <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white rounded-full">
                                                Featured
                                            </span>
                                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/10 text-white/80 rounded-full backdrop-blur-md border border-white/10">
                                                {filteredVideos[0].category}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl md:text-5xl font-black text-white mb-4 leading-tight">
                                            {filteredVideos[0].title}
                                        </h3>
                                        <p className="text-white/70 line-clamp-2 md:text-lg mb-6 max-w-2xl">
                                            {filteredVideos[0].description}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-400 group-hover:text-white transition-colors">
                                            <span>{t('video_watch_now') || 'Watch Now'}</span>
                                            <ExternalLink size={16} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Horizontal Scroll List */}
                            {filteredVideos.length > 1 && (
                                <div>
                                    <h4 className="text-xl font-bold text-black dark:text-white mb-6 px-1 transition-colors">
                                        {t('videos_more') || 'Plus de vidéos'}
                                    </h4>
                                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                                        {filteredVideos.slice(1).map((video, index) => (
                                            <div key={index} className="min-w-[85vw] md:min-w-[400px] snap-start">
                                                <VideoCard3D
                                                    video={video}
                                                    onPlay={handleVideoSelect}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!isLoading && filteredVideos.length === 0 && (
                        <div className="text-center text-gray-500 dark:text-white/40 py-20">
                            <p>No videos found.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default VideoSection;
