import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play } from 'lucide-react';
import { Video } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useCinematicAudio } from '../src/hooks/useCinematicAudio';

interface VideoCard3DProps {
    video: Video;
    onPlay: (v: Video) => void;
}

const VideoCard3D: React.FC<VideoCard3DProps> = ({ video, onPlay }) => {
    const { t } = useThemeLanguage();
    const { playHover, playClick } = useCinematicAudio();
    const ref = useRef<HTMLDivElement>(null);

    // Motion values pour l'effet 3D
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Ressorts pour adoucir le mouvement
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Traductions
    const translationKeyTitle = `video_${video.id}_title`;
    const translatedTitle = t(translationKeyTitle);
    const title = translatedTitle === translationKeyTitle ? video.title : translatedTitle;

    const translationKeyCat = `video_${video.id}_cat`;
    const translatedCat = t(translationKeyCat);
    const category = translatedCat === translationKeyCat ? video.category : translatedCat;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => playHover()}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className="group relative cursor-pointer w-full flex-shrink-0"
            onClick={() => {
                playClick();
                onPlay(video);
            }}
        >
            <div
                style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
                className="relative overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 aspect-video mb-3 shadow-lg border border-black/5 dark:border-white/5"
            >
                <img
                    src={video.imageUrl}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />

                {/* Durée */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-[4px] tracking-wide z-20">
                    {video.duration}
                </div>

                {/* Bouton Play avec effet de profondeur */}
                <div
                    style={{ transform: "translateZ(30px)" }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 z-10"
                >
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                    </div>
                </div>
            </div>

            <div style={{ transform: "translateZ(20px)" }} className="pr-2">
                <h4 className="text-base md:text-lg font-bold leading-tight transition-colors duration-300 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mb-1">
                    {title}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {category}
                    </span>
                    {video.subcategory && (
                        <>
                            <span className="w-0.5 h-0.5 bg-gray-400 rounded-full"></span>
                            <span className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">{video.subcategory}</span>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default VideoCard3D;
