import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Activity, Wifi, Triangle, Globe, Compass, Move3d, Clock } from 'lucide-react';

// --- SHADERS GLSL (MONOCHROME & ORBITAL) ---

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
    
    // PARAMÈTRES ORBITAUX
    uniform vec2 u_orbit; // x: Azimut, y: Élévation
    uniform float u_dist; // Distance au centre
    uniform float u_focus; // Dilatation temporelle
    
    varying vec2 vUv;

    #define PI 3.14159265359

    // --- MATHS & NOISE ---
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
            float twinkleSpeed = 5.0 * (1.0 - u_focus * 0.9);
            brightness *= (0.8 + 0.4 * sin(u_time * twinkleSpeed + rnd * 100.0));
            float dist = length(grid);
            float star = max(0.0, 1.0 - dist * 4.0); 
            star = pow(star, 8.0); 
            col += vec3(1.0) * star * brightness;
        }
        return col;
    }

    // Fonction Caméra LookAt
    mat3 setCamera(in vec3 ro, in vec3 ta, float cr) {
        vec3 cw = normalize(ta - ro);
        vec3 cp = vec3(sin(cr), cos(cr), 0.0); // Up vector temporaire
        vec3 cu = normalize(cross(cw, cp));
        vec3 cv = normalize(cross(cu, cw));
        return mat3(cu, cv, cw);
    }

    void main() {
        vec2 uv = (vUv - 0.5) * 2.0;
        uv.x *= u_resolution.x / u_resolution.y;

        // --- ORBITAL CAMERA LOGIC ---
        float az = u_orbit.x;
        float el = u_orbit.y;
        float d = u_dist;

        // Conversion Sphérique -> Cartésien (Y-Up)
        vec3 ro = vec3(
            d * cos(el) * sin(az),
            d * sin(el),
            d * cos(el) * cos(az)
        );

        vec3 ta = vec3(0.0); // Cible : Centre du Trou Noir
        
        // Construction de la matrice caméra
        mat3 camMat = setCamera(ro, ta, 0.0);
        
        // Ray Direction
        // FOV = 1.5 (Standard ~50-60mm)
        vec3 rd = camMat * normalize(vec3(uv, 1.5));

        // --- PHYSIQUE TROU NOIR ---
        float rs = 1.0; 
        float isco = 2.0; 
        float diskRad = 12.0; 
        
        vec3 p = ro;
        vec3 col = vec3(0.0);
        float alpha = 1.0; 
        
        float stepSize = 0.1;
        float maxDist = 80.0;
        
        for(int i=0; i<100; i++) {
            float r = length(p);
            
            // Lensing
            // Focus augmente la gravité perçue (Zoom temporel)
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
                
                float timeScale = 1.0 - u_focus * 0.8; 
                float rotAngle = angle + u_time * speed * 0.2 * timeScale; 
                
                float rings = 0.5 + 0.5 * sin(rad * 15.0);
                float dust = fbm(vec3(rad * 4.0, rotAngle, p.y * 10.0));
                
                float density = (rings * 0.6 + dust * 0.4);
                density *= smoothstep(isco, isco+1.0, rad) * smoothstep(diskRad, diskRad-4.0, rad);
                density *= smoothstep(diskHeight, 0.0, distToPlane);
                
                // Doppler Beaming
                // Calcul tangentiel correct quelque soit l'angle de vue
                vec3 tangent = normalize(cross(vec3(0.0, 1.0, 0.0), p)); 
                float doppler = dot(rd, tangent);
                
                float beam = 1.0 + doppler * 0.7;
                beam = pow(beam, 2.0);
                
                float intensity = density * beam * 2.0;
                intensity *= (1.0 + u_focus * 0.5); 
                
                float stepDens = density * stepSize * 0.8;
                col += vec3(1.0) * intensity * stepDens * alpha;
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

        // --- POST PROCESS ---
        
        float centerGlow = 1.0 / (length(uv) + 0.2);
        col += vec3(0.2) * centerGlow * 0.05;

        col = vec3(1.0) - exp(-col * 1.5); 
        col = pow(col, vec3(0.9)); 
        float gray = dot(col, vec3(0.299, 0.587, 0.114));
        col = vec3(gray);

        float vignetteStrength = 1.8 + u_focus * 1.5;
        col *= 1.0 - smoothstep(0.5, vignetteStrength, length(vUv - 0.5) * 2.0);
        
        if (u_focus > 0.01) {
             float blurAmount = smoothstep(0.2, 0.8, length(vUv - 0.5)) * u_focus * 0.5;
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
        <div className={`w-1 h-1 bg-white rounded-full transition-all duration-300 ${focusLevel > 0.1 ? 'scale-150 shadow-[0_0_15px_white]' : ''}`} />
        <div
            className="absolute border border-white/30 rounded-full transition-all duration-300 ease-out"
            style={{
                width: `${48 - focusLevel * 20}px`,
                height: `${48 - focusLevel * 20}px`,
                borderColor: `rgba(255, 255, 255, ${0.3 + focusLevel * 0.7})`
            }}
        />
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

const ComplexHUD = ({ orbitalData, focusLevel }: { orbitalData: { az: number, el: number, dist: number }, focusLevel: number }) => {
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

            {/* Orbital Indicator (Right) */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 text-right">
                <div className="flex flex-col gap-1 transition-opacity duration-300">
                    <div className="flex items-center justify-end gap-2 text-white/90">
                        <span className="text-[10px] tracking-widest uppercase font-bold">NAVIGATION</span>
                        <Compass size={14} className="animate-spin-slow" />
                    </div>
                    <div className="text-[9px] font-mono text-white/60">
                        ORBITAL MODE
                    </div>
                </div>

                <div className="flex flex-col gap-1 transition-opacity duration-300" style={{ opacity: focusLevel > 0.1 ? 1 : 0.4 }}>
                    <div className="flex items-center justify-end gap-2 text-white/90">
                        <span className="text-[10px] tracking-widest uppercase font-bold">Dilatation Temp.</span>
                        <Activity size={14} className={focusLevel > 0.1 ? "animate-pulse" : ""} />
                    </div>
                    <div className="text-[9px] font-mono text-white/60">
                        {focusLevel > 0.1 ? "ACTIVE" : "NOMINALE"}
                    </div>
                </div>
            </div>

            {/* Orbital Visualizer (Bottom Center) */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 flex flex-col gap-1 items-center pointer-events-none mix-blend-difference">
                <div className="w-full flex justify-between text-[9px] text-white/60 font-mono tracking-[0.2em] uppercase">
                    <span>Horizon</span>
                    <span>Deep Space</span>
                </div>
                <div className="w-full h-1 bg-white/10 border border-white/30 rounded-full overflow-hidden relative">
                    {/* Distance Marker */}
                    <div
                        className="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_white] transition-all duration-75 ease-out"
                        style={{ left: `${Math.min(1, (orbitalData.dist - 2.0) / 25.0) * 100}%` }}
                    />
                </div>
                <span className="text-[10px] font-mono mt-1 tracking-widest uppercase text-white/50">
                    RAYON ORBITAL: {orbitalData.dist.toFixed(2)} UA
                </span>
            </div>

            {/* Bottom Bar */}
            <div className="flex justify-between items-end pb-2">
                <div className="flex flex-col gap-1">
                    <div className="flex gap-4 text-[10px] text-white/40 font-mono mix-blend-difference">
                        <span>AZM: {(orbitalData.az * 180 / Math.PI).toFixed(0)}°</span>
                        <span>ELV: {(orbitalData.el * 180 / Math.PI).toFixed(0)}°</span>
                    </div>
                    <DataPanel label="VECTEUR" value="ORBITAL LOCK" icon={Globe} />
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

const InterstellarBlackHole = ({ setOrbitalData, setFocusLevel }: { setOrbitalData: (d: any) => void, setFocusLevel: (l: number) => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // ÉTAT ORBITAL
    const orbitState = useRef({
        azimuth: -Math.PI / 2, // Commence face au disque
        elevation: 0.1,        // Légèrement au-dessus
        distance: 12.0,        // Distance initiale
        targetAzimuth: -Math.PI / 2,
        targetElevation: 0.1,
        targetDistance: 12.0
    });

    const isDragging = useRef(false);
    const isMouseDown = useRef(false); // Pour le focus (clic statique)
    const lastMousePos = useRef({ x: 0, y: 0 });

    const focusRef = useRef(0.0);

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
                u_resolution: { value: new THREE.Vector2(Math.max(container.clientWidth, 1), Math.max(container.clientHeight, 1)) },
                u_orbit: { value: new THREE.Vector2(0, 0) }, // Azimut, Elevation
                u_dist: { value: 12.0 },
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
            const rawDt = clock.getDelta();

            // --- LOGIQUE ORBITALE (INTERPOLATION) ---
            // Lissage des mouvements
            orbitState.current.azimuth += (orbitState.current.targetAzimuth - orbitState.current.azimuth) * 0.1;
            orbitState.current.elevation += (orbitState.current.targetElevation - orbitState.current.elevation) * 0.1;
            orbitState.current.distance += (orbitState.current.targetDistance - orbitState.current.distance) * 0.1;

            // Mise à jour Uniforms
            material.uniforms.u_orbit.value.set(orbitState.current.azimuth, orbitState.current.elevation);
            material.uniforms.u_dist.value = orbitState.current.distance;

            // --- LOGIQUE FOCUS ---
            // Si on clique sans bouger (pas de drag), on active le focus
            const targetFocus = (isMouseDown.current && !isDragging.current) ? 1.0 : 0.0;
            focusRef.current += (targetFocus - focusRef.current) * 0.1;
            material.uniforms.u_focus.value = focusRef.current;

            // Ralenti temporel si focus actif
            const timeDilation = 1.0 - (focusRef.current * 0.8);
            material.uniforms.u_time.value += rawDt * timeDilation;

            // Sync React State (Pour le HUD)
            setOrbitalData({
                az: orbitState.current.azimuth,
                el: orbitState.current.elevation,
                dist: orbitState.current.distance
            });
            setFocusLevel(focusRef.current);

            renderer.render(scene, camera);
        };
        animate();

        // --- EVENT LISTENERS ---

        const handleResize = () => {
            if (!container) return;
            renderer.setSize(container.clientWidth, container.clientHeight);
            material.uniforms.u_resolution.value.set(Math.max(container.clientWidth, 1), Math.max(container.clientHeight, 1));
        };

        const handleMouseDown = (e: MouseEvent) => {
            isMouseDown.current = true;
            isDragging.current = false;
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isMouseDown.current) {
                const dx = e.clientX - lastMousePos.current.x;
                const dy = e.clientY - lastMousePos.current.y;

                // Seuil pour considérer qu'on drag (évite d'annuler le clic statique pour un micro mouvement)
                if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                    isDragging.current = true;

                    // Sensibilité
                    const sensitivity = 0.005;
                    orbitState.current.targetAzimuth -= dx * sensitivity;
                    orbitState.current.targetElevation += dy * sensitivity;

                    // Clamp Elevation pour éviter le retournement aux pôles (Gimbal lock visual)
                    // On garde une marge de sécurité (89 degrés)
                    const limit = Math.PI / 2 - 0.05;
                    orbitState.current.targetElevation = Math.max(-limit, Math.min(limit, orbitState.current.targetElevation));

                    lastMousePos.current = { x: e.clientX, y: e.clientY };
                }
            }
        };

        const handleMouseUp = () => {
            isMouseDown.current = false;
            isDragging.current = false;
        };

        const handleWheel = (e: WheelEvent) => {
            const zoomSensitivity = 0.01;
            orbitState.current.targetDistance += e.deltaY * zoomSensitivity;
            // Clamp Distance
            orbitState.current.targetDistance = Math.max(3.0, Math.min(30.0, orbitState.current.targetDistance));
            e.preventDefault();
        };

        // Touch Events (Mobile)
        const initialPinchDist = useRef<number | null>(null);
        const initialZoomDist = useRef<number>(12.0);

        const handleTouchStart = (e: TouchEvent) => {
            // Prevent default to stop scrolling/refreshing
            e.preventDefault();

            if (e.touches.length === 1) {
                // Single touch: Rotate
                isMouseDown.current = true;
                isDragging.current = false;
                lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            } else if (e.touches.length === 2) {
                // Multi touch: Pinch to Zoom
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                initialPinchDist.current = Math.sqrt(dx * dx + dy * dy);
                initialZoomDist.current = orbitState.current.targetDistance;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();

            if (e.touches.length === 1 && isMouseDown.current) {
                // Rotation Logic
                const dx = e.touches[0].clientX - lastMousePos.current.x;
                const dy = e.touches[0].clientY - lastMousePos.current.y;

                // Threshold for drag detection
                if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                    isDragging.current = true;

                    // Increased sensitivity for mobile
                    const sensitivity = 0.008;
                    orbitState.current.targetAzimuth -= dx * sensitivity;
                    orbitState.current.targetElevation += dy * sensitivity;

                    const limit = Math.PI / 2 - 0.05;
                    orbitState.current.targetElevation = Math.max(-limit, Math.min(limit, orbitState.current.targetElevation));

                    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                }
            } else if (e.touches.length === 2 && initialPinchDist.current !== null) {
                // Pinch Zoom Logic
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const currentDist = Math.sqrt(dx * dx + dy * dy);

                // Calculate zoom factor
                const scale = initialPinchDist.current / currentDist;

                // Apply zoom
                orbitState.current.targetDistance = initialZoomDist.current * scale;
                orbitState.current.targetDistance = Math.max(3.0, Math.min(30.0, orbitState.current.targetDistance));
            }
        };

        const handleTouchEnd = () => {
            isMouseDown.current = false;
            isDragging.current = false;
            initialPinchDist.current = null;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('wheel', handleWheel, { passive: false });

        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            cancelAnimationFrame(animationId);
            renderer.dispose();
            material.dispose();
            if (container && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={containerRef} className="fixed inset-0 w-full h-full bg-black cursor-move" />;
};

const BlackHoleSection: React.FC = () => {
    const [orbitalData, setOrbitalData] = useState({ az: 0, el: 0, dist: 12.0 });
    const [focusLevel, setFocusLevel] = useState(0.0);

    return (
        <main className="w-full h-screen bg-black overflow-hidden font-sans relative">
            <InterstellarBlackHole setOrbitalData={setOrbitalData} setFocusLevel={setFocusLevel} />
            <ComplexHUD orbitalData={orbitalData} focusLevel={focusLevel} />

            {/* Grain Film Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-white mix-blend-overlay"
                style={{ filter: 'url(#noise)' }}></div>

            {/* UI Hints */}
            <div className="absolute bottom-12 left-8 text-white/30 text-[9px] font-mono flex flex-col gap-1 pointer-events-none mix-blend-difference">
                <span>GLISSER: ORBITE</span>
                <span>SCROLL: DISTANCE</span>
                <span>CLIC MAINTENU: DILATATION TEMP.</span>
                <span><Move3d size={12} className="inline mr-1" />3D LOCK</span>
            </div>
        </main>
    );
};

export default BlackHoleSection;
