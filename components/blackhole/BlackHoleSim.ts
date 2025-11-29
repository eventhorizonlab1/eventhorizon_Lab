// components/blackhole/BlackHoleSim.ts

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import {
    BlackHoleVertexShader,
    BlackHoleFragmentShader,
    StarfieldVertexShader,
    StarfieldFragmentShader
} from './shaders';

export class BlackHoleSim {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    controls: OrbitControls;
    clock: THREE.Clock;

    blackHoleMaterial: THREE.ShaderMaterial;
    starfieldMaterial: THREE.ShaderMaterial;
    stars: THREE.Points;
    bloomPass: UnrealBloomPass;

    isMobile: boolean = false;
    disposables: any[] = [];
    targetCameraPosition: THREE.Vector3;
    isAnimatingCamera: boolean = false;

    constructor(container: HTMLElement) {
        this.isMobile = window.innerWidth < 1024;

        this.scene = new THREE.Scene();

        // Caméra
        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        // Position ajustée pour un angle "cinématique"
        // Y=8 permet de voir le disque passer "par dessus" l'ombre
        this.camera.position.set(0, 8, 55);
        this.targetCameraPosition = new THREE.Vector3(0, 8, 55);
        console.log("BlackHoleSim: Constructor called. Camera set to", this.camera.position);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: false, // L'AA est géré par le post-processing ou inutile avec le Raymarching
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.0 : 1.5));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        // Contrôles
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 120;
        this.controls.enablePan = false;
        // Limiter l'angle vertical pour éviter de casser l'illusion volumétrique trop facilement
        this.controls.maxPolarAngle = Math.PI * 0.85;
        this.controls.minPolarAngle = Math.PI * 0.15;

        this.initStarfield();
        this.initBlackHoleVolume();
        this.initPostProcessing(container.clientWidth, container.clientHeight);

        // Force initial resize to set uniforms
        this.resize(container.clientWidth, container.clientHeight);
    }

    initBlackHoleVolume() {
        // Revenir au ShaderMaterial avec les correctifs validés
        const geometry = new THREE.BoxGeometry(200, 200, 200);

        this.blackHoleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_resolution: { value: new THREE.Vector2(1, 1) },
                u_cameraPos: { value: new THREE.Vector3(0, 8, 55) },
                u_bloom: { value: 1.0 },
                u_lensing: { value: 1.0 },
                u_disk_density: { value: 1.0 },
                u_temp: { value: 1.0 }
            },
            vertexShader: BlackHoleVertexShader,
            fragmentShader: BlackHoleFragmentShader,
            side: THREE.BackSide, // Important pour être "dans" la boîte si besoin, ou voir le fond
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending,
        });

        const box = new THREE.Mesh(geometry, this.blackHoleMaterial);
        this.scene.add(box);
        this.disposables.push(geometry, this.blackHoleMaterial);

        console.log("BlackHoleSim: ShaderMaterial restored with robust settings.");
    }

    initStarfield() {
        const geometry = new THREE.BufferGeometry();
        const count = 4000;
        const positions = [];
        const sizes = [];
        const opacities = [];
        const speeds = [];

        for (let i = 0; i < count; i++) {
            const r = 400 + Math.random() * 200;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions.push(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
            sizes.push(Math.random() * 2.5); // Étoiles un peu plus grosses
            opacities.push(Math.random());
            speeds.push(Math.random());
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('a_size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('a_opacity', new THREE.Float32BufferAttribute(opacities, 1));
        geometry.setAttribute('a_twinkle_speed', new THREE.Float32BufferAttribute(speeds, 1));

        this.starfieldMaterial = new THREE.ShaderMaterial({
            uniforms: { u_time: { value: 0 } },
            vertexShader: StarfieldVertexShader,
            fragmentShader: StarfieldFragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.stars = new THREE.Points(geometry, this.starfieldMaterial);
        this.scene.add(this.stars);
        this.disposables.push(geometry, this.starfieldMaterial);
    }

    initPostProcessing(width: number, height: number) {
        this.composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // CONFIGURATION BLOOM TYPE "INTERSTELLAR"
        // Le seuil (threshold) doit être bas pour que l'orange brille, pas juste le blanc
        // Le rayon (radius) doit être large pour l'effet onirique
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(width, height),
            1.2,  // Force (Strength)
            0.8,  // Rayon (Radius) - Augmenté pour un halo plus large
            0.15  // Seuil (Threshold) - Baissé pour que tout le disque émette de la lumière
        );
        this.composer.addPass(this.bloomPass);

        const outputPass = new OutputPass();
        this.composer.addPass(outputPass);
    }

    resize(width: number, height: number) {
        this.isMobile = width < 1024;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
        if (this.blackHoleMaterial) {
            this.blackHoleMaterial.uniforms.u_resolution.value.set(width, height);
        }
    }

    moveTo(x: number, y: number, z: number) {
        this.targetCameraPosition.set(x, y, z);
        this.isAnimatingCamera = true;
    }

    setAutoRotation(active: boolean) {
        this.controls.autoRotate = active;
        this.controls.autoRotateSpeed = 0.5; // Vitesse douce
    }

    resetCamera() {
        this.targetCameraPosition.set(0, 8, 55);
        this.isAnimatingCamera = true;
        this.controls.autoRotate = false;
    }

    update(time: number, delta: number, params: any) {
        if (this.blackHoleMaterial) {
            this.blackHoleMaterial.uniforms.u_time.value = time * params.rotationSpeed;

            // Ajustement des paramètres selon le mode sombre/clair pour garder la lisibilité
            const brightnessMod = params.isLightMode ? 1.5 : 1.0;

            this.blackHoleMaterial.uniforms.u_bloom.value = params.diskBrightness * brightnessMod;
            this.blackHoleMaterial.uniforms.u_lensing.value = params.lensingStrength;
            this.blackHoleMaterial.uniforms.u_disk_density.value = params.diskBrightness;
            this.blackHoleMaterial.uniforms.u_temp.value = params.temperature;
            this.blackHoleMaterial.uniforms.u_cameraPos.value.copy(this.camera.position);
        }

        if (this.starfieldMaterial) {
            this.starfieldMaterial.uniforms.u_time.value = time;
        }

        if (this.bloomPass) {
            this.bloomPass.strength = params.bloomIntensity;
        }

        if (this.isAnimatingCamera) {
            this.camera.position.lerp(this.targetCameraPosition, 0.05);
            if (this.camera.position.distanceTo(this.targetCameraPosition) < 0.1) {
                this.isAnimatingCamera = false;
                this.controls.update(); // Force update target
            }
        }

        this.controls.update();
        this.composer.render();
    }

    dispose() {
        this.disposables.forEach(obj => {
            if (obj.dispose) obj.dispose();
        });
        this.renderer.dispose();
        this.composer.dispose();
    }
}
