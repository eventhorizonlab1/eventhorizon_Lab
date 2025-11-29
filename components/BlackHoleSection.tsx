import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Target, Activity, Cpu, Wifi, Triangle, BatteryCharging, Eye, Aperture, Clock } from 'lucide-react';

// --- SHADERS GLSL (MONOCHROME & PHYSIQUE) ---

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
    uniform vec2 u_mouse; // Position "Regard" lissée
    
    // NOUVEAUX UNIFORMS CREATIFS
    uniform float u_zoom_level; // Contrôle le Dolly Zoom (0.0 à 1.0)
    uniform float u_focus;      // Contrôle la dilatation temporelle (0.0 à 1.0)
    
    varying vec2 vUv;

    #define PI 3.14159265359

    mat2 rot(float a) {
        float s = sin(a), c = cos(a);
        return mat2(c, -s, s, c);
    }

    float hash(vec2 p) {
        vec3 p3  = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }

    float noise(vec3 p) {
        const vec3 step = vec3(110, 241, 171);
        vec3 i = floor(p);
        vec3 f = fract(p);
        float n = dot(i, step);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(i.xy + vec2(0,0) + vec2(0, i.z)), hash(i.xy + vec2(1,0) + vec2(0, i.z)), u.x),
                   mix(hash(i.xy + vec2(0,1) + vec2(0, i.z)), hash(i.xy + vec2(1,1) + vec2(0, i.z)), u.x), u.y),
                   mix(mix(hash(i.xy + vec2(0,0) + vec2(0, i.z + 1.0)), hash(i.xy + vec2(1,0) + vec2(0, i.z + 1.0)), u.x),
                   mix(hash(i.xy + vec2(0,1) + vec2(0, i.z + 1.0)), hash(i.xy + vec2(1,1) + vec2(0, i.z + 1.0)), u.x), u.y), u.z);
    }

    float fbm(vec3 p) {
        float f = 0.0;
        float amp = 0.5;
        vec3 shift = vec3(100.0);
        for(int i=0; i<4; i++) {
            f += amp * noise(p);
            p = p * 2.0 + shift;
            amp *= 0.5;
        }
        return f;
    }

    vec3 getStars(vec3 rd) {
        vec3 col = vec3(0.0);
        vec2 uv = vec2(atan(rd.z, rd.x), asin(rd.y));
        uv *= 150.0; 
        
        vec2 id = floor(uv);
        vec2 grid = fract(uv) - 0.5;
        float rnd = hash(id);
        
        if(rnd > 0.98) {
            float brightness = (rnd - 0.98) * 50.0;
            // Scintillement ralenti par u_focus
            float twinkleSpeed = 5.0 * (1.0 - u_focus * 0.9);
            brightness *= (0.8 + 0.4 * sin(u_time * twinkleSpeed + rnd * 100.0));
            
            float dist = length(grid);
            float star = max(0.0, 1.0 - dist * 4.0); 
            star = pow(star, 8.0); 
            col += vec3(1.0) * star * brightness;
        }
        return col;
    }

    void main() {
        vec2 uv = (vUv - 0.5) * 2.0;
        uv.x *= u_resolution.x / u_resolution.y;

        // --- DOLLY ZOOM (EFFET VERTIGO) ---
        // u_zoom_level va de 0 (loin/téléobjectif) à 1 (près/grand angle)
        
        // Distance caméra : Plus on zoom (1.0), plus on s'approche physiquement
        // Range: -20.0 (loin) à -6.0 (très près)
        float camDist = mix(25.0, 5.0, u_zoom_level);
        
        // FOV : Plus on zoom (1.0), plus le FOV est GRAND (Fish-eye) pour compenser
        // Range: 0.5 (Téléobjectif) à 2.5 (Grand angle)
        float fov = mix(0.4, 3.0, u_zoom_level * u_zoom_level); // Non-linéaire pour l'effet dramatique
        
        vec3 ro = vec3(0.0, 0.5 * u_zoom_level, -camDist);
        vec3 target = vec3(0.0, 0.0, 0.0);
        
        vec3 forward = normalize(target - ro);
        vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
        vec3 up = cross(forward, right);
        vec3 rd = normalize(forward * fov + uv.x * right + uv.y * up);

        // --- NAVIGATION INERTIELLE (SCAPHANDRE) ---
        // La souris fait tourner la caméra avec une sensation de poids
        float mx = u_mouse.x * 0.4; // Amplitude limitée
        float my = u_mouse.y * 0.2;
        mat2 rotY = rot(mx);
        mat2 rotX = rot(my);
        ro.yz *= rotX; rd.yz *= rotX;
        ro.xz *= rotY; rd.xz *= rotY;
        
        float rs = 1.0; 
        float isco = 2.0; 
        float diskRad = 12.0; 
        
        vec3 p = ro;
        vec3 col = vec3(0.0);
        float alpha = 1.0; 
        
        float stepSize = 0.1;
        float maxDist = 80.0;
        
        for(int i=0; i<150; i++) {
            float r = length(p);
            
            // Lensing renforcé par le focus
            float lensPower = 4.0 + u_focus * 2.0; 
            vec3 gravity = -normalize(p) * (lensPower / (r*r + 0.1));
            rd += gravity * stepSize * 0.08;
            rd = normalize(rd);
            
            if(r < rs) {
                alpha = 0.0;
                break;
            }
            
            float distToPlane = abs(p.y);
            float diskHeight = 0.05 + r * 0.04; 
            
            if(distToPlane < diskHeight && r > isco && r < diskRad) {
                float angle = atan(p.z, p.x);
                float rad = length(p.xz);
                float speed = 8.0 / sqrt(rad);
                // Le temps semble ralentir quand on focus
                float timeScale = 1.0 - u_focus * 0.8; 
                float rotAngle = angle + u_time * speed * 0.2 * timeScale; 
                
                float rings = 0.5 + 0.5 * sin(rad * 15.0);
                float dust = fbm(vec3(rad * 4.0, rotAngle, p.y * 10.0));
                
                float density = (rings * 0.6 + dust * 0.4);
                density *= smoothstep(isco, isco+1.0, rad) * smoothstep(diskRad, diskRad-4.0, rad);
                density *= smoothstep(diskHeight, 0.0, distToPlane);
                
                // Doppler Beaming
                vec3 tangent = normalize(vec3(-p.z, 0.0, p.x));
                float doppler = dot(rd, tangent);
                
                float beam = 1.0 + doppler * 0.7;
                beam = pow(beam, 2.0);
                
                vec3 finalDiskCol = vec3(1.0);
                
                float intensity = density * beam * 2.0;
                // Focus augmente la brillance perçue
                intensity *= (1.0 + u_focus * 0.5); 
                
                float stepDens = density * stepSize * 0.8;
                col += finalDiskCol * intensity * stepDens * alpha;
                alpha *= (1.0 - stepDens);
                
                if(alpha < 0.01) break;
            }
            
            float nextStep = max(0.05, r * 0.08);
            p += rd * nextStep;
            
            if(length(p - ro) > maxDist) break;
        }
        
        if(alpha > 0.01) {
            col += getStars(rd) * alpha;
        }

        // --- POST PROCESS : FOCUS & VIGNETTE ---
        
        // Glow monochrome
        float centerGlow = 1.0 / (length(uv) + 0.2);
        col += vec3(0.2) * centerGlow * 0.05;

        // Tone Mapping
        col = vec3(1.0) - exp(-col * 1.5); 
        col = pow(col, vec3(0.9)); 
        float gray = dot(col, vec3(0.299, 0.587, 0.114));
        col = vec3(gray);

        // VIGNETTE DYNAMIQUE (Effet Casque/Focus)
        // Normalement douce, elle devient très forte sur les bords en mode Focus
        float vignetteStrength = 1.8 + u_focus * 1.5;
        col *= 1.0 - smoothstep(0.5, vignetteStrength, length(vUv - 0.5) * 2.0);
        
        // BLUR RADIAL SUR LES BORDS (Simulation de concentration)
        if (u_focus > 0.01) {
             float blurAmount = smoothstep(0.2, 0.8, length(vUv - 0.5)) * u_focus * 0.5;
             // Simulation cheap de blur : on assombrit simplement plus
             col *= (1.0 - blurAmount);
        }

        gl_FragColor = vec4(col, 1.0);
    }
`;

// --- HUD COMPONENTS ---

const CornerBrackets = () => (
    <>
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white/30 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white/30 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white/30 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white/30 rounded-br-lg pointer-events-none" />
    </>
);

const CrosshairHUD = ({ focusLevel }: { focusLevel: number }) => (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center mix-blend-difference">
        {/* Point central qui palpite si focus */}
        <div className={`w-1 h-1 bg-white rounded-full transition-all duration-300 ${focusLevel > 0.1 ? 'scale-150 shadow-[0_0_15px_white]' : ''}`} />

        {/* Cercle de focus qui se resserre */}
        <div
            className="absolute border border-white/30 rounded-full transition-all duration-300 ease-out"
            style={{
                width: `${48 - focusLevel * 20}px`,
                height: `${48 - focusLevel * 20}px`,
                borderColor: `rgba(255, 255, 255, ${0.3 + focusLevel * 0.7})`
            }}
        />

        {/* Lignes latérales qui s'écartent */}
        <div
            className="absolute h-[1px] bg-white/20 transition-all duration-500"
            style={{ width: `${200 + focusLevel * 300}px`, opacity: 1 - focusLevel }}
        />
        <div
            className="absolute w-[1px] bg-white/20 transition-all duration-500"
            style={{ height: `${200 + focusLevel * 100}px`, opacity: 1 - focusLevel }}
        />
    </div>
);

const DataPanel = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
    <div className="flex items-center gap-3 text-white/70 font-mono text-xs mix-blend-difference">
        <Icon size={14} className="opacity-70" />
        <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest opacity-50">{label}</span>
            <span className="font-bold tracking-wider">{value}</span>
        </div>
    </div>
);

// --- HUD PRINCIPAL ---

const ComplexHUD = ({ zoomLevel, focusLevel }: { zoomLevel: number, focusLevel: number }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const spectralBars = Array.from({ length: 8 }).map((_, i) => {
        const h = 20 + Math.random() * 60;
        return (
            <div key={i} className="w-1.5 bg-white/40 rounded-sm transition-all duration-300" style={{ height: `${h}%`, opacity: 0.3 + Math.random() * 0.7 }} />
        );
    });

    return (
        <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between overflow-hidden z-40">
            <CornerBrackets />

            {/* Top Bar */}
            <div className="flex justify-between items-start pt-2">
                <div className="flex flex-col gap-2">
                    <h1 className="text-white font-bold text-xl tracking-tighter leading-none flex items-center gap-2 mix-blend-difference">
                        <Triangle size={16} className="fill-white rotate-180" />
                        SINGULARITÉ
                    </h1>
                    <div className="flex gap-4">
                        <DataPanel label="TEMPS LOCAL" value={time.toLocaleTimeString()} icon={Clock} />
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1 mix-blend-difference">
                    <div className="flex items-center gap-1 h-8">
                        {spectralBars}
                    </div>
                    <span className="text-[9px] text-white/50 tracking-widest font-mono">SPECTRAL FLUX</span>
                </div>
            </div>

            {/* Center Area */}
            <CrosshairHUD focusLevel={focusLevel} />

            {/* Mode Indicator (Right) */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 text-right">
                <div className="flex flex-col gap-1 transition-opacity duration-300" style={{ opacity: focusLevel > 0.1 ? 1 : 0.4 }}>
                    <div className="flex items-center justify-end gap-2 text-white/90">
                        <span className="text-[10px] tracking-widest uppercase font-bold">Dilatation Temporelle</span>
                        <Clock size={14} className={focusLevel > 0.1 ? "animate-spin-slow" : ""} />
                    </div>
                    <div className="text-[9px] font-mono text-white/60">
                        {focusLevel > 0.1 ? "ACTIVE" : "INACTIVE"}
                    </div>
                </div>

                <div className="flex flex-col gap-1 transition-opacity duration-300" style={{ opacity: 0.8 }}>
                    <div className="flex items-center justify-end gap-2 text-white/90">
                        <span className="text-[10px] tracking-widest uppercase font-bold">Optique</span>
                        <Aperture size={14} />
                    </div>
                    <div className="text-[9px] font-mono text-white/60">
                        {zoomLevel < 0.3 ? "TÉLÉOBJECTIF" : (zoomLevel > 0.7 ? "GRAND ANGLE" : "STANDARD")}
                    </div>
                </div>
            </div>

            {/* Zoom Slider (Bottom Center) - Purely Visual Representation */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 flex flex-col gap-1 items-center pointer-events-none mix-blend-difference">
                <div className="w-full flex justify-between text-[9px] text-white/60 font-mono tracking-[0.2em] uppercase">
                    <span>Tele</span>
                    <span>Wide</span>
                </div>
                <div className="w-full h-1 bg-white/10 border border-white/30 rounded-full overflow-hidden relative">
                    {/* Marker */}
                    <div
                        className="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_white] transition-all duration-75 ease-out"
                        style={{ left: `${zoomLevel * 100}%` }}
                    />
                </div>
                <span className="text-[10px] font-mono mt-1 tracking-widest uppercase text-white/50">
                    DOLLY ZOOM (VERTIGO)
                </span>
            </div>

            {/* Bottom Bar */}
            <div className="flex justify-between items-end pb-2">
                <div className="flex flex-col gap-1">
                    <div className="flex gap-1 text-[10px] text-white/40 font-mono mix-blend-difference">
                        <span>FOV: {(30 + zoomLevel * 90).toFixed(1)}°</span>
                        <span>DIST: {(25.0 - zoomLevel * 20.0).toFixed(1)} UA</span>
                    </div>
                    <DataPanel label="OPTICS" value="VARIABLE GEOMETRY" icon={Eye} />
                </div>

                <div className="flex gap-6 items-end">
                    <div className="text-right border-l border-white/20 pl-4 mix-blend-difference">
                        <Wifi size={16} className="text-white/60 mb-1 ml-auto" />
                        <span className="text-[9px] uppercase tracking-widest opacity-50 text-white">TÉLÉMÉTRIE</span>
                    </div>
                </div>
            </div>

            {/* Decorative Grid Lines */}
            <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-px bg-white" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-white" />
            </div>
        </div>
    );
};

// --- MOTEUR THREE.JS ---

const InterstellarBlackHole = ({ setZoomLevel, setFocusLevel }: { setZoomLevel: (l: number) => void, setFocusLevel: (l: number) => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 }); // Mouse position relative to center (-1 to 1)

    // Etats de la simulation
    const zoomRef = useRef(0.5); // 0.5 = milieu (vue normale)
    const targetZoomRef = useRef(0.5);

    const focusRef = useRef(0.0);
    const isMouseDown = useRef(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: false
        });

        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
                u_mouse: { value: new THREE.Vector2(0, 0) },
                u_zoom_level: { value: 0.5 },
                u_focus: { value: 0.0 }
            },
            vertexShader: VertexShader,
            fragmentShader: FragmentShader,
        });

        const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(quad);

        const clock = new THREE.Clock();

        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            // Si Focus actif, le temps ralentit (dt plus petit)
            const rawDt = clock.getDelta();
            const timeDilation = 1.0 - (focusRef.current * 0.8); // Ralentit jusqu'à 20%
            material.uniforms.u_time.value += rawDt * timeDilation;

            // --- GESTION DU ZOOM (VERTIGO) ---
            // Interpolation fluide vers la cible
            zoomRef.current += (targetZoomRef.current - zoomRef.current) * 0.05;
            material.uniforms.u_zoom_level.value = zoomRef.current;
            setZoomLevel(zoomRef.current);

            // --- GESTION DU FOCUS (TEMPS) ---
            const targetFocus = isMouseDown.current ? 1.0 : 0.0;
            focusRef.current += (targetFocus - focusRef.current) * 0.1;
            material.uniforms.u_focus.value = focusRef.current;
            setFocusLevel(focusRef.current);

            // --- GESTION DU REGARD (INERTIE) ---
            // La souris ne donne pas une position absolue, mais une "intention" de regard
            // Plus on s'éloigne du centre, plus l'uniform u_mouse change, mais avec du lag
            // Ici on garde simple : u_mouse suit la souris physique avec beaucoup d'inertie
            material.uniforms.u_mouse.value.x += (mouseRef.current.x - material.uniforms.u_mouse.value.x) * 0.05;
            material.uniforms.u_mouse.value.y += (mouseRef.current.y - material.uniforms.u_mouse.value.y) * 0.05;

            renderer.render(scene, camera);
        };
        animate();

        // --- EVENT LISTENERS ---

        const handleResize = () => {
            if (!container) return;
            renderer.setSize(container.clientWidth, container.clientHeight);
            material.uniforms.u_resolution.value.set(container.clientWidth, container.clientHeight);
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Normalisation (-1 à 1)
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        // Zoom sur la molette
        const handleWheel = (e: WheelEvent) => {
            // e.deltaY > 0 : Scroll Down (Recul) -> Zoom level diminue
            // e.deltaY < 0 : Scroll Up (Avance) -> Zoom level augmente
            const sensitivity = 0.001;
            targetZoomRef.current -= e.deltaY * sensitivity;
            // Clamp entre 0 et 1
            targetZoomRef.current = Math.max(0.0, Math.min(1.0, targetZoomRef.current));
            e.preventDefault(); // Empêche le scroll de page si nécessaire
        };

        const handleMouseDown = () => { isMouseDown.current = true; };
        const handleMouseUp = () => { isMouseDown.current = false; };
        const handleTouchStart = () => { isMouseDown.current = true; };
        const handleTouchEnd = () => { isMouseDown.current = false; };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
            cancelAnimationFrame(animationId);
            renderer.dispose();
            material.dispose();
            if (container && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={containerRef} className="fixed inset-0 w-full h-full bg-black cursor-crosshair" />;
};

const BlackHoleSection: React.FC = () => {
    const [zoomLevel, setZoomLevel] = useState(0.5);
    const [focusLevel, setFocusLevel] = useState(0.0);

    return (
        <main className="w-full h-screen bg-black overflow-hidden font-sans relative">
            <InterstellarBlackHole setZoomLevel={setZoomLevel} setFocusLevel={setFocusLevel} />
            <ComplexHUD zoomLevel={zoomLevel} focusLevel={focusLevel} />

            {/* Grain Film Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-white mix-blend-overlay"
                style={{ filter: 'url(#noise)' }}></div>

            {/* UI Hints (Bottom Left) */}
            <div className="absolute bottom-12 left-8 text-white/30 text-[9px] font-mono flex flex-col gap-1 pointer-events-none mix-blend-difference">
                <span>SCROLL: VERTIGO ZOOM</span>
                <span>CLIC MAINTENU: DILATATION TEMP.</span>
                <span>SOURIS: REGARD INERTIEL</span>
            </div>
        </main>
    );
};

export default BlackHoleSection;
