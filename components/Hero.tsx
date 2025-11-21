import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Play } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

// Animation Container: Orchestrates the stagger effect
const titleContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
      staggerDirection: 1
    }
  }
};

// Letter Animation: "Orbital Arrival" / Space Warp Effect
const letterVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 8, // Start very large (close to camera/viewer)
    y: 100, // Offset vertically
    rotateX: -90, // Start completely flat (horizontal)
    rotateZ: -30, // Significant tilt
    filter: "blur(20px)", // Heavy blur for speed/depth effect
    transformOrigin: "50% 100%", // Pivot from bottom
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    rotateZ: 0,
    filter: "blur(0px)",
    transformOrigin: "50% 50%",
    transition: {
      duration: 1.4,
      ease: [0.2, 0.8, 0.2, 1], // Custom bezier for a floaty space feel
    }
  }
};

// Word wrapper to keep words together
const AnimatedText = ({ text, className }: { text: string, className?: string }) => (
  <motion.div 
    key={text} 
    variants={titleContainerVariants}
    initial="hidden"
    animate="visible"
    className={`flex flex-wrap justify-center gap-x-[0.3em] gap-y-2 ${className}`}
    style={{ perspective: "1200px" }} // Deep perspective for 3D effects
  >
    {text.split(" ").map((word, i) => (
      <span key={i} className="inline-block whitespace-nowrap relative" style={{ transformStyle: "preserve-3d" }}>
        {word.split("").map((char, j) => (
          <motion.span 
            key={j} 
            variants={letterVariants} 
            className="inline-block transform-gpu text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400"
            style={{ backfaceVisibility: "hidden" }} 
          >
            {char}
          </motion.span>
        ))}
      </span>
    ))}
  </motion.div>
);

const SpaceBackground = () => {
  const stars = useMemo(() => {
    return [...Array(100)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1, // 1-3px
      opacity: Math.random() * 0.8 + 0.2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      <div className="absolute inset-0 bg-black" />
      
      {/* Rotating Galaxy/Nebula Gradient */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vmax] h-[150vmax] opacity-30 mix-blend-screen"
        animate={{ 
          rotate: 360,
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          rotate: { duration: 120, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ 
            background: 'radial-gradient(circle, rgba(40,50,120,0.4) 0%, rgba(80,20,100,0.1) 40%, rgba(0,0,0,0) 70%)'
        }}
      />
      
      {/* Rotating Starfield */}
      <motion.div 
         className="absolute inset-[-50%] w-[200%] h-[200%]"
         animate={{ rotate: 360 }} 
         transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
      >
         {stars.map(star => (
            <motion.div 
               key={star.id}
               className="absolute bg-white rounded-full"
               style={{ 
                 top: star.top, 
                 left: star.left, 
                 width: star.size, 
                 height: star.size,
                 boxShadow: `0 0 ${star.size}px rgba(255,255,255,0.8)`
               }}
               animate={{ opacity: [star.opacity, star.opacity * 0.3, star.opacity] }}
               transition={{ 
                 duration: star.duration, 
                 repeat: Infinity, 
                 ease: "easeInOut",
                 delay: star.delay
               }}
            />
         ))}
      </motion.div>
    </div>
  )
}

const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useThemeLanguage();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // Refined Parallax Values for distinct layer velocities
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]); // Increased depth
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.2]); // Slight zoom for immersion
  const yTitle = useTransform(scrollYProgress, [0, 0.6], [0, 600]); // Strong drag on title
  const yContent = useTransform(scrollYProgress, [0, 0.6], [0, 250]); // Content moves slower than title
  const opacityText = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[120vh] bg-black">
      
      {/* Sticky Background Visual - Dark Space */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        
        {/* Dynamic 3D Space Background */}
        <SpaceBackground />

        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <motion.img 
          style={{ y: yBg, scale: scaleBg }}
          src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1920&auto=format&fit=crop"
          alt="Earth from Space" 
          className="w-full h-full object-cover opacity-60 origin-center relative z-0"
        />
        {/* Gradient fade at bottom of screen */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
      </div>

      {/* Content Container - Overlays the sticky background */}
      <div className="relative z-20 w-full -mt-[100vh]">
        
        {/* Hero Intro (First Screen) - Added pt-32 to push content down away from header */}
        <div className="h-screen flex flex-col items-center justify-center px-4 pt-32 md:pt-0">
           <motion.div 
              style={{ opacity: opacityText }}
              className="text-center max-w-[95vw] md:max-w-7xl flex flex-col items-center"
           >
              {/* Main Title Container - Reduced font size to lg:text-8xl to prevent header overlap */}
              <motion.h1 
                style={{ y: yTitle }}
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.0] md:leading-[0.9] mb-8 md:mb-12 flex flex-col items-center w-full"
              >
                <div className="block w-full">
                  <AnimatedText text={t('hero_line1')} />
                </div>
                <div className="block w-full">
                  <AnimatedText text={t('hero_line2')} className="md:mt-2 lg:mt-4" />
                </div>
              </motion.h1>

              <motion.div
                style={{ y: yContent }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <p className="text-lg md:text-xl text-gray-200 max-w-lg mx-auto font-bold">
                  {t('hero_subtitle')}
                </p>
                
                <a 
                  href="#videos" 
                  className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-sm font-bold tracking-widest uppercase hover:bg-gray-200 transition-all hover:scale-105"
                >
                  <span>{t('hero_cta')}</span>
                  <Play size={16} className="fill-current" />
                </a>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-8 md:mt-12 text-white/50 text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-2"
                >
                  <span>{t('hero_scroll')}</span>
                  <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
                </motion.div>
              </motion.div>
           </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;