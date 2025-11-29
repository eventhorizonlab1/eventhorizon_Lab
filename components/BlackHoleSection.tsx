import React, { useRef, useEffect, useState } from 'react';
import {
    RefreshCw, Eye, Thermometer, Activity, Sun, Cpu, Maximize2, Minimize2, Camera, Sliders, Power, Aperture,
    ChevronUp, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useCinematic } from '../context/CinematicContext';
import { BlackHoleSim } from './blackhole/BlackHoleSim';

// --- HUD COMPONENTS ---

const SimLoader = () => {
    const { t } = useThemeLanguage();
    const [progress, setProgress] = useState(0);
    const [statusKey, setStatusKey] = useState("bh_load_init");

    useEffect(() => {
        const phases = [
            { t: 15, key: "bh_load_assets" },
            { t: 35, key: "bh_load_shaders" },
            { t: 60, key: "bh_load_gravity" },
            { t: 85, key: "bh_load_optics" },
            { t: 95, key: "bh_load_final" },
            { t: 100, key: "bh_load_ready" }
        ];

        let start: number | null = null;
        const duration = 2500; // 2.5s loading time

        const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const p = Math.min((elapsed / duration) * 100, 100);

            setProgress(p);

            const currentPhase = phases.find(phase => p <= phase.t);
            if (currentPhase) {
                setStatusKey(currentPhase.key);
            }

            if (p < 100) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, []);

    return (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono text-cyan-500 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Hexagon Loader */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
                        <path d="M50 5 L93 25 L93 75 L50 95 L7 75 L7 25 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
                    </svg>
                    <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] animate-[spin_2s_linear_infinite_reverse]" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="60 100" />
                    </svg>
                    <div className="text-3xl font-bold tracking-tighter text-white">{Math.floor(progress)}%</div>
                </div>

                {/* Status Text */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <Cpu size={14} className="animate-pulse" />
                        <span className="text-xs font-bold tracking-[0.3em] uppercase">{t(statusKey)}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-64 h-1 bg-cyan-900/30 rounded-full overflow-hidden border border-cyan-900/50">
                        <motion.div
                            className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ControlSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    icon?: React.ElementType;
}

const ControlSlider = React.memo<ControlSliderProps>(({ label, value, min, max, step, onChange, icon: Icon }) => (
    <div className="group flex flex-col gap-2">
        <div className="flex justify-between items-center text-cyan-100/70 group-hover:text-cyan-400 transition-colors">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                {Icon && <Icon size={12} />} {label}
            </label>
            <span className="text-[10px] font-mono bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-900/30">{value.toFixed(1)}</span>
        </div>
        <div className="relative h-4 flex items-center">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-cyan-950 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.8)] hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
            />
        </div>
    </div>
));

// --- MAIN COMPONENT ---

const BlackHoleSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const simRef = useRef<BlackHoleSim | null>(null);
    const { t } = useThemeLanguage();
    const isInView = useInView(containerRef);
    const shouldReduceMotion = useReducedMotion();
    const { isCinematic, setIsCinematic } = useCinematic();

    // Simulation State
    const [isLoading, setIsLoading] = useState(true);
    const [renderFallback, setRenderFallback] = useState(false);
    const [isControlsOpen, setIsControlsOpen] = useState(true);

    // Initial parameters tuned for "Standard" look (balanced)
    const [params, setParams] = useState({
        rotationSpeed: shouldReduceMotion ? 0.05 : 0.3,
        bloomIntensity: 1.2,
        lensingStrength: 1.0,
        diskBrightness: 2.5,
        temperature: 1.0,
        autoOrbit: false
    });

    const [simKey, setSimKey] = useState(0); // Force reload

    // Refs for animation loop
    const paramsRef = useRef(params);
    const isInViewRef = useRef(isInView);
    const isLoadingRef = useRef(isLoading);

    // Sync Refs
    useEffect(() => { paramsRef.current = params; }, [params]);
    useEffect(() => { isInViewRef.current = isInView; }, [isInView]);
    useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsCinematic(false);
            if (e.key === 'h') setIsControlsOpen(prev => !prev);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setIsCinematic]);

    // Initialization
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let sim: BlackHoleSim;
        try {
            sim = new BlackHoleSim(canvas);
            simRef.current = sim;
        } catch (error) {
            console.error("WebGL initialization failed:", error);
            setRenderFallback(true);
            setIsLoading(false);
            return;
        }

        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            if (!isInViewRef.current && !isLoadingRef.current) return;

            if (simRef.current) {
                simRef.current.update(sim.clock.getElapsedTime(), sim.clock.getDelta(), {
                    rotationSpeed: paramsRef.current.rotationSpeed,
                    bloomIntensity: paramsRef.current.bloomIntensity,
                    lensingStrength: paramsRef.current.lensingStrength,
                    diskBrightness: paramsRef.current.diskBrightness,
                    temperature: paramsRef.current.temperature,
                    isLightMode: false // Always dark mode for simulation page
                });
            }
        };
        animate();

        const handleResize = () => {
            if (canvasRef.current && simRef.current) {
                simRef.current.resize(window.innerWidth, window.innerHeight);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial resize

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            sim.dispose();
        };
    }, [simKey]);

    // Handlers
    const updateParam = (key: keyof typeof params, value: any) => {
        setParams(prev => ({ ...prev, [key]: value }));
        if (key === 'autoOrbit' && simRef.current) {
            simRef.current.setAutoRotation(value);
        }
    };

    const applyPreset = (preset: 'interstellar' | 'radioactive' | 'ice' | 'gargantua') => {
        const presets = {
            // Updated to match the new shader physics
            gargantua: {
                rotationSpeed: 0.2,
                bloomIntensity: 1.8,
                lensingStrength: 1.2,
                diskBrightness: 3.5,
                temperature: 1.0
            },
            interstellar: { // The "Movie" look: bright, golden, sharp
                rotationSpeed: 0.4,
                bloomIntensity: 1.0,
                lensingStrength: 1.0,
                diskBrightness: 4.0,
                temperature: 1.1
            },
            radioactive: { // Toxic green/yellow
                rotationSpeed: 0.8,
                bloomIntensity: 2.0,
                lensingStrength: 1.5,
                diskBrightness: 3.0,
                temperature: 3.0 // Pushes color to green/blue spectrum
            },
            ice: { // Cold, dim, slow
                rotationSpeed: 0.1,
                bloomIntensity: 0.8,
                lensingStrength: 0.8,
                diskBrightness: 1.5,
                temperature: 5.0 // Very blue
            }
        };
        setParams(prev => ({ ...prev, ...presets[preset] }));
    };

    const takeScreenshot = () => {
        if (!simRef.current) return;
        const link = document.createElement('a');
        link.download = 'event-horizon-capture.png';
        link.href = simRef.current.renderer.domElement.toDataURL('image/png');
        link.click();
    };

    const reloadSimulation = () => {
        setIsLoading(true);
        setSimKey(prev => prev + 1);
        updateParam('autoOrbit', false);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <section ref={containerRef} className="relative w-full h-full bg-black overflow-hidden">
            {/* CANVAS LAYER */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

            {/* FALLBACK LAYER */}
            {renderFallback && (
                <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
                    <div className="text-center text-red-500 font-mono">
                        <Activity size={48} className="mx-auto mb-4" />
                        <p>{t('bh_webgl_unsupported')}</p>
                    </div>
                </div>
            )}

            {/* LOADING LAYER */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 z-[100]"
                    >
                        <SimLoader />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HUD OVERLAY LAYER - Hidden in Cinematic Mode */}
            <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 ${isCinematic ? 'opacity-0' : 'opacity-100'}`}>

                {/* TOP BAR */}
                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
                    <div className="flex flex-col">
                        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            <Aperture className="text-cyan-400 animate-spin-slow" size={24} />
                            Event Horizon
                        </h1>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest border border-cyan-900/50 px-2 py-0.5 rounded bg-cyan-950/20">
                                System: Online
                            </span>
                            <span className="text-[10px] font-mono text-red-400/70 uppercase tracking-widest flex items-center gap-1 animate-pulse">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> Live Feed
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2 pointer-events-auto">
                        <button onClick={() => setIsCinematic(true)} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-md group">
                            <Maximize2 size={18} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* BOTTOM CONTROL DOCK */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl pointer-events-auto">
                    <motion.div
                        animate={{ height: isControlsOpen ? 'auto' : '60px' }}
                        className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                    >
                        {/* Dock Header / Toggle */}
                        <div
                            className="h-[60px] flex items-center justify-between px-6 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5"
                            onClick={() => setIsControlsOpen(!isControlsOpen)}
                        >
                            <div className="flex items-center gap-3 text-cyan-400">
                                <Sliders size={18} />
                                <span className="text-xs font-bold uppercase tracking-widest">Control Deck</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
                                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-150"></div>
                                </div>
                                {isControlsOpen ? <ChevronDown size={16} className="text-white/50" /> : <ChevronUp size={16} className="text-white/50" />}
                            </div>
                        </div>

                        {/* Dock Content */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Column 1: Physics */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Physics Engine</h4>
                                <ControlSlider label={t('bh_rotation')} icon={RefreshCw} value={params.rotationSpeed} min={0} max={2} step={0.1} onChange={(v) => updateParam('rotationSpeed', v)} />
                                <ControlSlider label={t('bh_density')} icon={Activity} value={params.diskBrightness} min={1} max={10} step={0.1} onChange={(v) => updateParam('diskBrightness', v)} />
                            </div>

                            {/* Column 2: Optics */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Optical Array</h4>
                                <ControlSlider label={t('bh_bloom')} icon={Sun} value={params.bloomIntensity} min={0} max={4} step={0.1} onChange={(v) => updateParam('bloomIntensity', v)} />
                                <ControlSlider label={t('bh_lensing')} icon={Eye} value={params.lensingStrength} min={0} max={2} step={0.1} onChange={(v) => updateParam('lensingStrength', v)} />
                                <ControlSlider label={t('bh_temp')} icon={Thermometer} value={params.temperature} min={0.5} max={5} step={0.1} onChange={(v) => updateParam('temperature', v)} />
                            </div>

                            {/* Column 3: Actions & Presets */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Mission Control</h4>

                                {/* Camera Actions */}
                                <div className="flex gap-2 mb-4">
                                    <button onClick={() => updateParam('autoOrbit', !params.autoOrbit)} className={`flex-1 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${params.autoOrbit ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                                        Auto-Orbit
                                    </button>
                                    <button onClick={() => simRef.current?.resetCamera()} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                                        <Minimize2 size={14} />
                                    </button>
                                </div>

                                {/* Presets Grid */}
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => applyPreset('gargantua')} className="py-1.5 rounded bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 text-[9px] font-bold uppercase tracking-wider text-white/50 transition-colors border border-transparent hover:border-orange-500/50">Gargantua</button>
                                    <button onClick={() => applyPreset('interstellar')} className="py-1.5 rounded bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-400 text-[9px] font-bold uppercase tracking-wider text-white/50 transition-colors border border-transparent hover:border-yellow-500/50">Interstellar</button>
                                    <button onClick={() => applyPreset('radioactive')} className="py-1.5 rounded bg-white/5 hover:bg-green-500/20 hover:text-green-400 text-[9px] font-bold uppercase tracking-wider text-white/50 transition-colors border border-transparent hover:border-green-500/50">Radioactive</button>
                                    <button onClick={() => applyPreset('ice')} className="py-1.5 rounded bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 text-[9px] font-bold uppercase tracking-wider text-white/50 transition-colors border border-transparent hover:border-cyan-500/50">Ice</button>
                                </div>

                                {/* System Actions */}
                                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                    <button onClick={reloadSimulation} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider transition-colors">
                                        <Power size={12} /> Reboot
                                    </button>
                                    <button onClick={takeScreenshot} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-wider transition-colors">
                                        <Camera size={12} /> Capture
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BlackHoleSection;
