import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw, Eye, Thermometer, Activity, Sun, Navigation, Layers, ZoomIn, Cpu, Maximize2, Minimize2, Camera, Sliders } from 'lucide-react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { BlackHoleSim } from './blackhole/BlackHoleSim';

const SimLoader = () => {
    const { t } = useThemeLanguage();
    const [progress, setProgress] = useState(0);
    const [statusKey, setStatusKey] = useState("bh_load_init");

    useEffect(() => {
        const phases = [
            { t: 5, key: "bh_load_assets" },
            { t: 25, key: "bh_load_shaders" },
            { t: 50, key: "bh_load_gravity" },
            { t: 75, key: "bh_load_optics" },
            { t: 90, key: "bh_load_final" },
            { t: 100, key: "bh_load_ready" }
        ];

        let currentPhase = 0;
        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + Math.random() * 15;
                if (currentPhase < phases.length && next > phases[currentPhase].t) {
                    setStatusKey(phases[currentPhase].key);
                    currentPhase++;
                }
                return next > 100 ? 100 : next;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 z-50 bg-gray-50 dark:bg-black flex flex-col items-center justify-center text-gray-500 dark:text-white font-mono pointer-events-none transition-colors duration-500">
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-l-2 border-blue-500 rounded-full"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 border-b-2 border-r-2 border-purple-500 rounded-full opacity-70"
                />
                <div className="text-2xl font-bold tracking-tighter text-black dark:text-white">{Math.floor(progress)}%</div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-blue-400">
                    <Cpu size={16} className="animate-pulse" />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase">{t(statusKey)}</span>
                </div>
                <div className="w-48 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(0deg,transparent_24%,rgba(0,0,0,.5)_25%,rgba(0,0,0,.5)_26%,transparent_27%,transparent_74%,rgba(0,0,0,.5)_75%,rgba(0,0,0,.5)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(0,0,0,.5)_25%,rgba(0,0,0,.5)_26%,transparent_27%,transparent_74%,rgba(0,0,0,.5)_75%,rgba(0,0,0,.5)_76%,transparent_77%,transparent)] dark:bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.5)_25%,rgba(255,255,255,.5)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.5)_75%,rgba(255,255,255,.5)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.5)_25%,rgba(255,255,255,.5)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.5)_75%,rgba(255,255,255,.5)_76%,transparent_77%,transparent)] bg-[length:30px_30px]"></div>
        </div>
    );
}

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
    <div className="mb-6 group">
        <div className="flex justify-between items-center mb-2">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-gray-200 transition-colors">
                {Icon && <Icon size={14} />} {label}
            </label>
            <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{value}</span>
        </div>
        {/* Optimization: Increased height (h-4) of slider thumb target for mobile touch */}
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 hover:[&::-webkit-slider-thumb]:bg-blue-400 transition-all [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        />
    </div>
));

const BlackHoleSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const simRef = useRef<BlackHoleSim | null>(null);
    const { t, theme } = useThemeLanguage();
    const isInView = useInView(containerRef);
    const shouldReduceMotion = useReducedMotion();

    const [isLoading, setIsLoading] = useState(true);
    const [rotationSpeed, setRotationSpeed] = useState(shouldReduceMotion ? 0.05 : 0.3);
    const [bloomIntensity, setBloomIntensity] = useState(0.1);
    const [lensingStrength, setLensingStrength] = useState(1.2);
    const [diskBrightness, setDiskBrightness] = useState(1.0);
    const [temperature, setTemperature] = useState(1.0);
    const [isCinematic, setIsCinematic] = useState(false);

    const isInViewRef = useRef(isInView);
    const isLoadingRef = useRef(isLoading);
    const paramsRef = useRef({ rotationSpeed, bloomIntensity, lensingStrength, diskBrightness, temperature, theme });

    useEffect(() => {
        isInViewRef.current = isInView;
    }, [isInView]);

    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    useEffect(() => {
        paramsRef.current = { rotationSpeed, bloomIntensity, lensingStrength, diskBrightness, temperature, theme };
    }, [rotationSpeed, bloomIntensity, lensingStrength, diskBrightness, temperature, theme]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const sim = new BlackHoleSim(containerRef.current);
        simRef.current = sim;

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
                    isLightMode: paramsRef.current.theme === 'light'
                });
            }
        };

        animate();

        const handleResize = () => {
            if (containerRef.current && simRef.current) {
                simRef.current.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            sim.dispose();
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []);

    const moveCamera = (position: 'orbit' | 'top' | 'side') => {
        if (!simRef.current) return;

        if (position === 'orbit') {
            simRef.current.moveTo(0, 15, 90);
        } else if (position === 'top') {
            simRef.current.moveTo(0, 100, 5);
        } else if (position === 'side') {
            simRef.current.moveTo(90, 0, 0);
        }
    };

    const applyPreset = (preset: 'interstellar' | 'radioactive' | 'ice') => {
        switch (preset) {
            case 'interstellar':
                setRotationSpeed(0.3);
                setBloomIntensity(0.1);
                setLensingStrength(1.2);
                setDiskBrightness(1.0);
                setTemperature(1.0);
                break;
            case 'radioactive':
                setRotationSpeed(0.8);
                setBloomIntensity(1.5);
                setLensingStrength(1.5);
                setDiskBrightness(2.0);
                setTemperature(1.8);
                break;
            case 'ice':
                setRotationSpeed(0.1);
                setBloomIntensity(0.5);
                setLensingStrength(0.8);
                setDiskBrightness(0.8);
                setTemperature(0.5);
                break;
        }
    };

    const takeScreenshot = () => {
        if (!simRef.current) return;
        const canvas = simRef.current.renderer.domElement;
        const link = document.createElement('a');
        link.download = 'event-horizon-capture.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <motion.section
            id="blackhole"
            className="pt-0 md:pt-0 pb-16 md:pb-24 max-w-[1800px] mx-auto px-4 md:px-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="mb-12 border-l-4 border-black dark:border-white pl-3 md:pl-6 -ml-4 md:-ml-7">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-black dark:text-white transition-colors">
                    {t('bh_title')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
                    {t('bh_subtitle')}
                </p>
            </div>

            <div className={`mb-12 transition-all duration-500 ${isCinematic ? 'fixed inset-0 z-[100] m-0 rounded-none' : ''}`}>
                <div className={`relative overflow-hidden bg-gray-100 dark:bg-black border border-gray-200 dark:border-white/10 shadow-2xl w-full flex flex-col group transition-all duration-500 ${isCinematic ? 'h-full rounded-none border-0' : 'aspect-square md:aspect-[21/9] rounded-[2rem]'}`}>

                    <AnimatePresence>
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="absolute inset-0 z-50"
                            >
                                <SimLoader />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* HEADER CONTROLS */}
                    <div className={`bg-white/5 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md z-20 absolute top-0 left-0 w-full transition-opacity duration-300 ${isCinematic ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-orange-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex bg-black/50 rounded-full p-1 gap-1 border border-white/10">
                                <button onClick={() => moveCamera('orbit')} className="flex items-center gap-2 px-4 py-1.5 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
                                    <Navigation size={12} />
                                    <span>Orbit</span>
                                </button>
                                <button onClick={() => moveCamera('top')} className="flex items-center gap-2 px-4 py-1.5 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
                                    <Layers size={12} />
                                    <span>Top View</span>
                                </button>
                                <button onClick={() => moveCamera('side')} className="flex items-center gap-2 px-4 py-1.5 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
                                    <ZoomIn size={12} />
                                    <span>Side View</span>
                                </button>
                            </div>

                            {/* NEW: Screenshot & Cinematic Buttons */}
                            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                                <button onClick={takeScreenshot} className="p-2 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors" title="Take Screenshot">
                                    <Camera size={16} />
                                </button>
                                <button onClick={() => setIsCinematic(!isCinematic)} className="p-2 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors" title="Toggle Cinematic Mode">
                                    {isCinematic ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div ref={containerRef} className="absolute inset-0 w-full h-full z-10" />

                    {/* FOOTER INFO */}
                    <div className={`absolute bottom-0 left-0 w-full p-6 z-20 bg-gradient-to-t from-gray-200/90 dark:from-black/80 to-transparent pointer-events-none flex justify-between items-end transition-opacity duration-300 ${isCinematic ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                        <div>
                            <h3 className="text-3xl font-black text-black/20 dark:text-white/20 uppercase tracking-tighter">Event Horizon</h3>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 dark:text-white/40 animate-pulse border border-black/10 dark:border-white/10 px-3 py-1 rounded-full backdrop-blur-sm pointer-events-auto cursor-help" title="Interactive Simulation">
                            {t('bh_interact')}
                        </p>
                    </div>

                    <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                </div>

                <div className="flex md:hidden justify-center gap-4 mt-4">
                    <button onClick={() => moveCamera('orbit')} className="bg-gray-100 dark:bg-white/5 p-3 rounded-full text-black dark:text-white">
                        <Navigation size={20} />
                    </button>
                    <button onClick={() => moveCamera('top')} className="bg-gray-100 dark:bg-white/5 p-3 rounded-full text-black dark:text-white">
                        <Layers size={20} />
                    </button>
                    <button onClick={() => moveCamera('side')} className="bg-gray-100 dark:bg-white/5 p-3 rounded-full text-black dark:text-white">
                        <ZoomIn size={20} />
                    </button>
                </div>
            </div>

            {/* CONTROLS PANEL */}
            <div className="bg-white dark:bg-eh-gray p-8 rounded-[2rem] border border-gray-200 dark:border-white/5 relative overflow-hidden shadow-lg transition-colors duration-500 max-w-6xl mx-auto w-full">
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 dark:border-white/10 pb-4 gap-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Sliders size={14} />
                            {t('bh_controls')}
                        </h3>

                        {/* PRESETS */}
                        <div className="flex gap-2">
                            <button onClick={() => applyPreset('interstellar')} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-blue-500 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors">Interstellar</button>
                            <button onClick={() => applyPreset('radioactive')} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-green-500 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors">Radioactive</button>
                            <button onClick={() => applyPreset('ice')} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-cyan-500 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors">Ice</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
                        <ControlSlider label={t('bh_rotation')} icon={RefreshCw} value={rotationSpeed} min={0} max={2} step={0.1} onChange={setRotationSpeed} />
                        <ControlSlider label={t('bh_bloom')} icon={Sun} value={bloomIntensity} min={0} max={4} step={0.1} onChange={setBloomIntensity} />
                        <ControlSlider label={t('bh_lensing')} icon={Eye} value={lensingStrength} min={0} max={2} step={0.1} onChange={setLensingStrength} />
                        <ControlSlider label={t('bh_density')} icon={Activity} value={diskBrightness} min={1} max={10} step={0.1} onChange={setDiskBrightness} />
                        <ControlSlider label={t('bh_temp')} icon={Thermometer} value={temperature} min={0.5} max={2} step={0.1} onChange={setTemperature} />
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_50%)] pointer-events-none"></div>
            </div>

        </motion.section>
    );
};

export default BlackHoleSection;
