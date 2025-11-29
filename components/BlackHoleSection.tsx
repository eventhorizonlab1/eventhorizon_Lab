import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { BlackHoleVertexShader, BlackHoleFragmentShader } from './blackhole/shaders';

const BlackHoleSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const warpRef = useRef(0); // État du warp (0 à 1)
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
            vertexShader: BlackHoleVertexShader,
            fragmentShader: BlackHoleFragmentShader,
        });

        const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(quad);

        const clock = new THREE.Clock();

        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const dt = clock.getDelta();
            material.uniforms.u_time.value += dt;

            // Gestion du Warp (Transition douce)
            const targetWarp = isMouseDown.current ? 1.0 : 0.0;
            // Lerp (Interpolation linéaire) pour lisser la valeur warpRef
            warpRef.current += (targetWarp - warpRef.current) * dt * 2.0;
            material.uniforms.u_warp.value = warpRef.current;

            // Interpolation de la souris
            material.uniforms.u_mouse.value.x += (mouseRef.current.x - material.uniforms.u_mouse.value.x) * 0.1;
            material.uniforms.u_mouse.value.y += (mouseRef.current.y - material.uniforms.u_mouse.value.y) * 0.1;

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
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        const handleMouseDown = () => { isMouseDown.current = true; };
        const handleMouseUp = () => { isMouseDown.current = false; };

        // Support Touch pour mobile
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

    return (
        <section ref={containerRef} className="absolute inset-0 w-full h-full bg-black cursor-pointer" title="Maintenez le clic pour activer le WARP">
            {/* Interface minimaliste pour guider l'utilisateur */}
            <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none mix-blend-difference text-white opacity-50">
                <p className="text-xs tracking-[0.5em] uppercase animate-pulse">
                    Maintenir le clic pour accélérer (Monochrome)
                </p>
            </div>
        </section>
    );
};

export default BlackHoleSection;
