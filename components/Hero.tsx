
import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, Variants, useInView } from 'framer-motion';
import { Play } from 'lucide-react';
import * as THREE from 'three';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

// --- SHADER: LUMINET 1979 / INTERSTELLAR EXPERIMENTAL ---
const VertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

const FragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_is_light; // 0.0 = Dark Mode, 1.0 = Light Mode
    
    varying vec2 vUv;

    // --- NOISE FUNCTIONS ---
    float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; 
        vec3 x3 = x0 - 1.0 + 3.0*C.xxx; 

        i = mod289(i);
        vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        float n_ = 0.142857142857; 
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ ); 

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    float fbm(vec3 p) {
        float f = 0.0;
        float amp = 0.5;
        float freq = 1.0;
        for(int i=0; i<5; i++) {
            f += amp * snoise(p * freq);
            p.xy *= 1.6; 
            p.z *= 1.1;
            amp *= 0.5;
            freq *= 1.4;
        }
        return f;
    }

    void main() {
        vec2 uv = (vUv - 0.5) * 2.0;
        uv.x *= u_resolution.x / u_resolution.y;

        vec3 ro = vec3(0.0, 0.08, -12.0); 
        
        vec3 target = vec3(0.0, -0.5, 0.0);
        vec3 forward = normalize(target - ro);
        vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
        vec3 up = cross(forward, right);
        
        vec3 rd = normalize(forward * 2.5 + uv.x * right + uv.y * up);

        float mx = u_mouse.x * 0.5;
        float my = u_mouse.y * 0.2;
        mat2 rotX = mat2(cos(mx), sin(mx), -sin(mx), cos(mx));
        ro.xz *= rotX; rd.xz *= rotX;
        
        float rs = 1.0; 
        float isco = 1.5; 
        float diskRad = 9.0; 
        
        vec3 p = ro;
        vec3 col = vec3(0.0);
        float accum = 0.0; 
        float trans = 1.0; 
        
        float stepSize = 0.05; 
        
        for(int i=0; i<120; i++) {
            float r = length(p);
            
            vec3 force = -normalize(p) * (2.5 / (r * r + 0.01)); 
            rd += force * stepSize;
            rd = normalize(rd);
            
            if(r < rs) {
                accum += 0.0; 
                trans = 0.0;  
                break;
            }
            
            float distToPlane = abs(p.y); 
            
            if(distToPlane < 0.5 && r > isco && r < diskRad) {
                float angle = atan(p.z, p.x);
                float rad = length(p.xz);
                
                float density = exp(-(rad - isco) * 0.8);
                
                float rotSpeed = 8.0 / (rad + 0.1);
                float noiseVal = fbm(vec3(rad * 2.0, angle * 3.0 + u_time * rotSpeed * 0.2, p.y * 8.0));
                
                float rings = 0.5 + 0.5 * sin(rad * 10.0 + noiseVal * 2.0);
                density *= rings;
                density *= (noiseVal * 0.5 + 0.5); 
                
                density *= smoothstep(0.4, 0.0, distToPlane);

                vec3 tangent = normalize(vec3(-p.z, 0.0, p.x)); 
                float doppler = dot(rd, tangent); 
                
                float beam = smoothstep(-0.5, 1.0, doppler * 1.5 + 0.2);
                beam = pow(beam, 3.0); 
                
                float stepDens = density * stepSize * 4.0; 
                
                float light = stepDens * beam;
                accum += light * trans; 
                trans *= (1.0 - stepDens); 
                
                if(trans < 0.01) break; 
            }
            
            float nextStep = max(0.05, r * 0.05);
            p += rd * nextStep;
            
            if(r > 20.0) break; 
        }
        
        col = vec3(accum);
        
        col = pow(col, vec3(0.6)); 
        col = smoothstep(0.0, 1.2, col); 

        // --- ORGANIC FILM GRAIN ---
        // Calculate luminance (perceived brightness)
        float lum = dot(col, vec3(0.299, 0.587, 0.114));
        
        // High frequency noise (Fine grain for 4K/Retina compatibility)
        // Increased multiplier from 2.5 to 6.0 for finer texture
        float grain = hash(uv * 6.0 + u_time * 20.0);
        
        // Luminance Masking (Organic): 
        // 1. Removes grain from deep blacks (keeps OLED black pure) 
        // 2. Reduces grain in bright highlights to avoid clipping
        // 3. Soft transition curves for more analog feel
        float grainMask = smoothstep(0.02, 0.3, lum) * (1.0 - smoothstep(0.85, 1.0, lum));
        
        // Intensity Scaling
        float grainIntensity = 0.08; 
        
        col += (grain - 0.5) * grainIntensity * grainMask;
        
        float vig = 1.0 - smoothstep(0.5, 1.6, length(vUv - 0.5) * 2.0);
        col *= vig;
        
        float gray = dot(col, vec3(0.299, 0.587, 0.114));
        gray = smoothstep(0.02, 0.9, gray);
        
        vec3 finalColor = vec3(gray);

        if (u_is_light > 0.5) {
            vec3 paperColor = vec3(0.96, 0.96, 0.98); 
            vec3 inkColor = vec3(0.1, 0.12, 0.18); 
            
            float inkMask = smoothstep(0.05, 0.8, gray); 
            
            finalColor = mix(paperColor, inkColor, inkMask);
            
            float grid = 0.0;
            if (mod(vUv.x * 40.0, 1.0) < 0.05 || mod(vUv.y * 40.0 * (u_resolution.y/u_resolution.x), 1.0) < 0.05) {
                grid = 0.1;
            }
            finalColor -= grid * 0.1;
        }

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

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

const letterVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 8,
    y: 100,
    rotateX: -90,
    rotateZ: -30,
    filter: "blur(20px)",
    transformOrigin: "50% 100%",
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
      ease: [0.2, 0.8, 0.2, 1],
    }
  }
};

const AnimatedText = ({ text, className }: { text: string, className?: string }) => (
  <motion.div 
    key={text} 
    variants={titleContainerVariants}
    initial="hidden"
    animate="visible"
    className={`flex flex-wrap justify-center gap-x-[0.3em] gap-y-2 ${className}`}
    style={{ perspective: "1200px" }}
  >
    {text.split(" ").map((word, i) => (
      <span key={i} className="inline-block whitespace-nowrap relative" style={{ transformStyle: "preserve-3d" }}>
        {word.split("").map((char, j) => (
          <motion.span 
            key={j} 
            variants={letterVariants} 
            className="inline-block transform-gpu text-transparent bg-clip-text bg-gradient-to-b from-black via-black to-gray-600 dark:from-white dark:via-white dark:to-gray-400"
            style={{ backfaceVisibility: "hidden" }} 
          >
            {char}
          </motion.span>
        ))}
      </span>
    ))}
  </motion.div>
);

const BlackHoleBackground = ({ theme }: { theme: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isInView = useInView(containerRef); // Optimization: Detect visibility

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
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    // Performance: Limit pixel ratio to 1.5 max to prevent overheating on Retina/4K
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        u_mouse: { value: new THREE.Vector2(0, 0) },
        u_is_light: { value: theme === 'light' ? 1.0 : 0.0 }
      },
      vertexShader: VertexShader,
      fragmentShader: FragmentShader,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);
    
    const clock = new THREE.Clock();
    
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Stop rendering if not visible to save battery
      if (!isInView) return;

      material.uniforms.u_time.value = clock.getElapsedTime();
      const targetLight = theme === 'light' ? 1.0 : 0.0;
      material.uniforms.u_is_light.value += (targetLight - material.uniforms.u_is_light.value) * 0.05;
      material.uniforms.u_mouse.value.x += (mouseRef.current.x - material.uniforms.u_mouse.value.x) * 0.05;
      material.uniforms.u_mouse.value.y += (mouseRef.current.y - material.uniforms.u_mouse.value.y) * 0.05;
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
        if (!container) return;
        renderer.setSize(container.clientWidth, container.clientHeight);
        material.uniforms.u_resolution.value.set(container.clientWidth, container.clientHeight);
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
        geometry.dispose(); // Explicitly dispose geometry to prevent memory leaks
        if (container && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
    };
  }, [theme, isInView]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full z-0" />;
};

const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t, theme } = useThemeLanguage();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.4], ["0px", "12px"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);

  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const ySubtitle = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const yCTA = useTransform(scrollYProgress, [0, 1], [0, 350]);

  return (
    <section ref={ref} className="relative h-[90vh] w-full bg-eh-black transition-colors duration-500">
      
      {/* Sticky Background Visual */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        
        <BlackHoleBackground theme={theme} />

        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/90 dark:from-black/30 dark:via-transparent dark:to-black/80 z-10 pointer-events-none transition-colors duration-500"></div>
        
        {/* Content Container - Added padding-top 32 (8rem) to force content down from header on iPhone SE */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-32 md:justify-center md:pt-0 px-4 z-20 pointer-events-none">
           
           <div className="text-center max-w-[95vw] md:max-w-7xl flex flex-col items-center pointer-events-auto">
              
              {/* TITLE LAYER - Reduced font size for mobile (text-4xl) to fix iPhone SE clipping */}
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

              {/* SUBTITLE LAYER */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                style={{ opacity, scale, filter: blur, y: ySubtitle }}
                className="w-full"
              >
                <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto font-bold drop-shadow-md mix-blend-multiply dark:mix-blend-screen px-4">
                  {t('hero_subtitle')}
                </p>
              </motion.div>
              
              {/* CTA & SCROLL LAYER */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
                style={{ opacity, scale, filter: blur, y: yCTA }}
                className="flex flex-col items-center mt-8 md:mt-12 gap-8"
              >
                <motion.a 
                  href="#videos" 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 px-8 py-4 bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 text-black dark:text-white rounded-full text-sm font-bold tracking-widest uppercase transition-colors duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] shadow-lg shadow-black/5 dark:shadow-white/5 z-30"
                >
                  <span>{t('hero_cta')}</span>
                  <Play size={16} className="fill-current" />
                </motion.a>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-black/30 dark:text-white/30 text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-2"
                >
                  <span>{t('hero_scroll')}</span>
                  <div className="w-px h-12 bg-gradient-to-b from-black/20 to-transparent dark:from-white/50 dark:to-transparent"></div>
                </motion.div>
              </motion.div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
