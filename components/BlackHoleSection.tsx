import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Target, Activity, Cpu, Wifi, Triangle, BatteryCharging } from 'lucide-react';

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
    uniform vec2 u_mouse;
    uniform float u_warp;
    
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
            brightness *= (0.8 + 0.4 * sin(u_time * 5.0 + rnd * 100.0));
            float dist = length(grid);
            float star = max(0.0, 1.0 - dist * 4.0); 
            star = pow(star, 8.0); 
            // Étoiles blanches pures
            col += vec3(1.0) * star * brightness;
        }
        return col;
    }

    void main() {
        vec2 uv = (vUv - 0.5) * 2.0;
        uv.x *= u_resolution.x / u_resolution.y;

        float warpEffect = u_warp * 20.0;
        vec3 ro = vec3(0.0, 0.5 - u_warp * 0.4, -10.0 - warpEffect); 
        vec3 target = vec3(0.0, 0.0, 0.0);
        
        float fov = 1.0 + u_warp * 0.5;
        
        vec3 forward = normalize(target - ro);
        vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
        vec3 up = cross(forward, right);
        vec3 rd = normalize(forward * fov + uv.x * right + uv.y * up);

        float mx = u_mouse.x * 0.5;
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
        float maxDist = 40.0;
        
        for(int i=0; i<150; i++) {
            float r = length(p);
            
            // Gravité intense
            vec3 gravity = -normalize(p) * (4.0 / (r*r + 0.1));
            rd += gravity * stepSize * 0.08 * (1.0 + u_warp * 2.0);
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
                float rotAngle = angle + u_time * speed * 0.2 + u_warp * 10.0; 
                
                float rings = 0.5 + 0.5 * sin(rad * 15.0);
                float dust = fbm(vec3(rad * 4.0, rotAngle, p.y * 10.0));
                
                float density = (rings * 0.6 + dust * 0.4);
                density *= smoothstep(isco, isco+1.0, rad) * smoothstep(diskRad, diskRad-4.0, rad);
                density *= smoothstep(diskHeight, 0.0, distToPlane);
                
                // Doppler Beaming (Noir & Blanc)
                vec3 tangent = normalize(vec3(-p.z, 0.0, p.x));
                float doppler = dot(rd, tangent);
                
                float beam = 1.0 + doppler * 0.7;
                beam = pow(beam, 2.0);
                
                // Couleur Blanche intense
                vec3 finalDiskCol = vec3(1.0);
                
                float intensity = density * beam * 2.0 * (1.0 + u_warp * 5.0);
                float stepDens = density * stepSize * 0.8;
                col += finalDiskCol * intensity * stepDens * alpha;
                alpha *= (1.0 - stepDens);
                
                if(alpha < 0.01) break;
            }
            
            float nextStep = max(0.05, r * 0.08);
            p += rd * nextStep;
            
            if(r > maxDist) break;
        }
        
        if(alpha > 0.01) {
            vec3 stars = getStars(rd);
            if(u_warp > 0.01) {
                vec3 rdWarp = normalize(rd + vec3(0.0, 0.0, u_warp * 0.2));
                stars += getStars(rdWarp) * 0.5;
            }
            col += stars * alpha;
        }

        // Glow monochrome
        float centerGlow = 1.0 / (length(uv) + 0.2);
        col += vec3(0.2) * centerGlow * 0.05;

        // Tone Mapping "Noir et Blanc" dur
        col = vec3(1.0) - exp(-col * 1.5); 
        col = pow(col, vec3(0.9)); // Gamma un peu plus bas pour des noirs profonds
        
        // Force le N&B final
        float gray = dot(col, vec3(0.299, 0.587, 0.114));
        col = vec3(gray);

        col *= 1.0 - smoothstep(0.5, 1.8, length(vUv - 0.5) * 2.0);

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

const CrosshairHUD = ({ isWarping }: { isWarping: boolean }) => (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center mix-blend-difference">
        <div className={`w-1 h-1 bg-white rounded-full transition-all duration-300 ${isWarping ? 'scale-150 shadow-[0_0_10px_white]' : ''}`} />
        <div className={`absolute w-12 h-12 border border-white/30 rounded-full transition-all duration-700 ${isWarping ? 'scale-150 border-white/50 animate-spin' : ''}`} />
        <div className={`absolute w-32 h-32 border-x border-white/20 rounded-full transition-all duration-500 ${isWarping ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`} />
        <div className="absolute w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute h-[200px] w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
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

const ComplexHUD = ({ warpLevel, mousePos }: { warpLevel: number, mousePos: { x: number, y: number } }) => {
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
                        <DataPanel label="TEMPS MISSION" value={time.toLocaleTimeString()} icon={Activity} />
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
            <CrosshairHUD isWarping={warpLevel > 0.1} />

            {/* Warp Gauge (Bottom Center) */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 flex flex-col gap-1 items-center pointer-events-none mix-blend-difference">
                <div className="w-full flex justify-between text-[9px] text-white/60 font-mono tracking-[0.2em] uppercase">
                    <span>Standby</span>
                    <span>Hyper</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 border border-white/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white shadow-[0_0_10px_white] transition-all duration-75 ease-out"
                        style={{ width: `${warpLevel * 100}%` }}
                    />
                </div>
                <span className={`text-[10px] font-mono mt-1 tracking-widest uppercase transition-colors duration-300 ${warpLevel > 0.8 ? 'text-white animate-pulse' : 'text-white/50'}`}>
                    {warpLevel > 0.01 ? (warpLevel > 0.9 ? 'WARP CRITIQUE' : 'ACCÉLÉRATION') : 'SYSTÈME PRET'}
                </span>
            </div>

            {/* Bottom Bar */}
            <div className="flex justify-between items-end pb-2">
                <div className="flex flex-col gap-1">
                    <div className="flex gap-1 text-[10px] text-white/40 font-mono mix-blend-difference">
                        <span>X: {mousePos.x.toFixed(4)}</span>
                        <span>Y: {mousePos.y.toFixed(4)}</span>
                        <span>Z: -10.000</span>
                    </div>
                    <DataPanel label="COORDONNÉES" value="REL. HORIZON" icon={Target} />
                </div>

                <div className="flex gap-6 items-end">
                    <div className="text-right mix-blend-difference">
                        <div className="flex items-center justify-end gap-2 text-white/80 font-mono text-xs mb-1">
                            <span className="font-bold tracking-wider">{warpLevel > 0 ? "ENGAGÉ" : "PRET"}</span>
                            <BatteryCharging size={14} className={warpLevel > 0 ? "animate-pulse" : ""} />
                        </div>
                        <span className="text-[9px] uppercase tracking-widest opacity-50 text-white">WARP DRIVE</span>
                    </div>
                    <div className="text-right border-l border-white/20 pl-4 mr-12 md:mr-0 mix-blend-difference">
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

const InterstellarBlackHole = ({ setWarpLevel, setMousePos }: { setWarpLevel: (l: number) => void, setMousePos: (p: { x: number, y: number }) => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const warpRef = useRef(0);
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
                u_warp: { value: 0 }
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
            const dt = clock.getDelta();
            material.uniforms.u_time.value += dt;

            // Warp Physics
            const targetWarp = isMouseDown.current ? 1.0 : 0.0;
            const ease = isMouseDown.current ? 0.5 : 2.0;
            warpRef.current += (targetWarp - warpRef.current) * dt * ease;
            material.uniforms.u_warp.value = warpRef.current;

            setWarpLevel(warpRef.current);

            // Mouse Inertia
            material.uniforms.u_mouse.value.x += (mouseRef.current.x - material.uniforms.u_mouse.value.x) * 0.1;
            material.uniforms.u_mouse.value.y += (mouseRef.current.y - material.uniforms.u_mouse.value.y) * 0.1;

            setMousePos({ x: material.uniforms.u_mouse.value.x, y: material.uniforms.u_mouse.value.y });

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!container) return;
            renderer.setSize(container.clientWidth, container.clientHeight);
            material.uniforms.u_resolution.value.set(container.clientWidth, container.clientHeight);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        const handleMouseDown = () => { isMouseDown.current = true; };
        const handleMouseUp = () => { isMouseDown.current = false; };
        const handleTouchStart = () => { isMouseDown.current = true; };
        const handleTouchEnd = () => { isMouseDown.current = false; };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
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

    return <div ref={containerRef} className="fixed inset-0 w-full h-full bg-black cursor-pointer" />;
};

const BlackHoleSection: React.FC = () => {
    const [warpLevel, setWarpLevel] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    return (
        <main className="w-full h-screen bg-black overflow-hidden font-sans relative">
            <InterstellarBlackHole setWarpLevel={setWarpLevel} setMousePos={setMousePos} />
            <ComplexHUD warpLevel={warpLevel} mousePos={mousePos} />

            {/* Grain Film Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-white mix-blend-overlay"
                style={{ filter: 'url(#noise)' }}></div>
        </main>
    );
};

export default BlackHoleSection;
