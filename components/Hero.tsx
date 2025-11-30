
import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, Variants, useInView, useReducedMotion, MotionValue } from 'framer-motion';
import { Play } from 'lucide-react';
import * as THREE from 'three';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

import VertexShader from '../shaders/hero.vert?raw';
import FragmentShader from '../shaders/hero.frag?raw';

const titleContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03, // Faster stagger for cleaner look
      delayChildren: 0.1,
      staggerDirection: 1
    }
  }
};

// Simplified AnimatedText: Removed 3D rotation, blur, and scale effects.
// Now just a clean, subtle stagger fade-in.
const AnimatedText = ({ text, className }: { text: string, className?: string }) => {
  const letterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 10, // Very subtle slide up
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      }
    }
  };

  return (
    <motion.div
      key={text}
      variants={titleContainerVariants}
      initial="hidden"
      animate="visible"
      className={`flex flex-wrap justify-center gap-x-[0.2em] gap-y-2 ${className}`}
    >
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap relative">
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              variants={letterVariants}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-black via-black to-gray-600 dark:from-white dark:via-white dark:to-gray-400"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

const BlackHoleBackground = ({ theme, scrollYProgress }: { theme: string, scrollYProgress: MotionValue<number> }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isInView = useInView(containerRef);
  const shouldReduceMotion = useReducedMotion();

  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      powerPreference: "high-performance",
      antialias: false
    });

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        u_mouse: { value: new THREE.Vector2(0, 0) },
        u_is_light: { value: themeRef.current === 'light' ? 1.0 : 0.0 },
        u_scroll: { value: 0 }
      },
      vertexShader: VertexShader,
      fragmentShader: FragmentShader,
    });

    const updateSize = () => {
      if (!container) return;
      const isMobile = window.innerWidth < 768;
      // Cap at 1.0 for mobile to ensure smooth fps
      const maxPixelRatio = isMobile ? 1.0 : 1.5;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
      renderer.setSize(container.clientWidth, container.clientHeight);
      if (material) {
        material.uniforms.u_resolution.value.set(container.clientWidth, container.clientHeight);
      }
    };

    updateSize();
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    const clock = new THREE.Clock();

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isInView) return;

      const timeMultiplier = shouldReduceMotion ? 0.1 : 1.0;
      material.uniforms.u_time.value = clock.getElapsedTime() * timeMultiplier;

      const targetLight = themeRef.current === 'light' ? 1.0 : 0.0;
      material.uniforms.u_is_light.value += (targetLight - material.uniforms.u_is_light.value) * 0.05;

      // Update scroll uniform for parallax
      if (scrollYProgress) {
        material.uniforms.u_scroll.value = scrollYProgress.get();
      }

      const mouseInfluence = shouldReduceMotion ? 0.01 : 0.05;
      material.uniforms.u_mouse.value.x += (mouseRef.current.x - material.uniforms.u_mouse.value.x) * mouseInfluence;
      material.uniforms.u_mouse.value.y += (mouseRef.current.y - material.uniforms.u_mouse.value.y) * mouseInfluence;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      updateSize();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isInView) return;
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);

      renderer.dispose();
      material.dispose();
      geometry.dispose();

      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isInView, shouldReduceMotion]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full z-0" />;
};

const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t, theme } = useThemeLanguage();
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.4], ["0px", "12px"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, shouldReduceMotion ? 1 : 1.15]);

  const yTitle = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 150]);
  const ySubtitle = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 250]);
  const yCTA = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 350]);

  return (
    <section ref={ref} className="relative h-[90vh] w-full bg-eh-black transition-colors duration-500">

      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">

        <BlackHoleBackground theme={theme} scrollYProgress={scrollYProgress} />

        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/90 dark:from-black/30 dark:via-transparent dark:to-black/80 z-10 pointer-events-none transition-colors duration-500"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-start pt-32 md:justify-center md:pt-0 px-4 z-20 pointer-events-none">

          <div className="text-center max-w-[95vw] md:max-w-7xl flex flex-col items-center pointer-events-auto">

            {/* Responsive Text Sizing: Smaller on mobile to prevent overflow */}
            <motion.div
              style={{ opacity, scale, filter: blur, y: yTitle }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.0] md:leading-[0.9] mb-8 md:mb-12 flex flex-col items-center w-full drop-shadow-lg text-black dark:text-white dark:mix-blend-overlay dark:opacity-90"
            >
              <div className="block w-full">
                <AnimatedText text={t('hero_line1')} />
              </div>
              <div className="block w-full">
                <AnimatedText text={t('hero_line2')} className="md:mt-2 lg:mt-4" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0.2 : 0.8, duration: 1, ease: "easeOut" }}
              style={{ opacity, scale, filter: blur, y: ySubtitle }}
              className="w-full"
            >
              <p className="text-sm md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto font-bold drop-shadow-md mix-blend-multiply dark:mix-blend-screen px-4">
                {t('hero_subtitle')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0.3 : 1.0, duration: 1, ease: "easeOut" }}
              style={{ opacity, scale, filter: blur, y: yCTA }}
              className="flex flex-col items-center mt-8 md:mt-12 gap-8"
            >
              <motion.a
                href="#videos"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 text-black dark:text-white rounded-full text-sm font-bold tracking-widest uppercase transition-colors duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] shadow-lg shadow-black/5 dark:shadow-white/5 z-30"
              >
                <span>{t('hero_cta')}</span>
                <Play size={16} className="fill-current" />
              </motion.a>

              {!shouldReduceMotion && (
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-black/30 dark:text-white/30 text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-2"
                >
                  <span>{t('hero_scroll')}</span>
                  <div className="w-px h-12 bg-gradient-to-b from-black/20 to-transparent dark:from-white/50 dark:to-transparent"></div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
