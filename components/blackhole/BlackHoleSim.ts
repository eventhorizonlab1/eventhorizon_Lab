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
        // Position initiale type "Interstellar" (légèrement au-dessus du plan)
        this.camera.position.set(0, 5, 45);
        this.targetCameraPosition = new THREE.Vector3(0, 5, 45);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: true // Important pour le cube volumétrique
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.0 : 1.5));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // Look cinéma
        container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        // Contrôles
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 15; // Ne pas entrer dans le trou noir
        this.controls.maxDistance = 100;
        this.controls.enablePan = false;

        // Initialisation des objets
        this.initStarfield();
        this.initBlackHoleVolume(); // Le nouveau coeur du système
        this.initPostProcessing(container.clientWidth, container.clientHeight);
    }

    initBlackHoleVolume() {
        // Au lieu d'un plan ou d'un anneau, on crée un cube invisible
        // Le shader va "dessiner" le trou noir à l'intérieur de ce cube
        // Cela permet de tourner autour en 3D
        const geometry = new THREE.BoxGeometry(60, 60, 60); // Assez grand pour contenir le disque

        this.blackHoleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_resolution: { value: new THREE.Vector2(1, 1) },
                u_cameraPos: { value: new THREE.Vector3() }, // Important pour le raymarching
                u_bloom: { value: 1.0 },
                u_lensing: { value: 1.0 },
                u_disk_density: { value: 1.0 },
                u_temp: { value: 1.0 }
            },
            vertexShader: BlackHoleVertexShader,
            fragmentShader: BlackHoleFragmentShader,
            side: THREE.BackSide, // On rend l'intérieur du cube
            transparent: true,
            blending: THREE.NormalBlending,
        });

        const box = new THREE.Mesh(geometry, this.blackHoleMaterial);
        this.scene.add(box);
        this.disposables.push(geometry, this.blackHoleMaterial);
    }

    initStarfield() {
        // Fond étoilé simple mais dense pour le contraste
        const geometry = new THREE.BufferGeometry();
        const count = 3000;
        const positions = [];
        const sizes = [];
        const opacities = [];
        const speeds = [];

        for (let i = 0; i < count; i++) {
            const r = 400; // Loin derrière
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions.push(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
            sizes.push(Math.random() * 2.0);
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

        // Bloom intense pour l'effet "Glow" d'Interstellar
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(width, height),
            1.5, // Force
            0.4, // Rayon
            0.85 // Seuil
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

    update(time: number, delta: number, params: any) {
        // Mise à jour des uniformes
        if (this.blackHoleMaterial) {
            this.blackHoleMaterial.uniforms.u_time.value = time * params.rotationSpeed;
            this.blackHoleMaterial.uniforms.u_bloom.value = params.diskBrightness; // Intensité de la couleur
            this.blackHoleMaterial.uniforms.u_lensing.value = params.lensingStrength;
            this.blackHoleMaterial.uniforms.u_disk_density.value = params.diskBrightness;
            this.blackHoleMaterial.uniforms.u_temp.value = params.temperature;

            // Mise à jour critique pour le raymarching : la position de la caméra
            this.blackHoleMaterial.uniforms.u_cameraPos.value.copy(this.camera.position);
        }

        if (this.starfieldMaterial) {
            this.starfieldMaterial.uniforms.u_time.value = time;
        }

        // Contrôle du Bloom via les params UI
        if (this.bloomPass) {
            this.bloomPass.strength = params.bloomIntensity;
        }

        // Animation de la caméra (boutons UI)
        if (this.isAnimatingCamera) {
            this.camera.position.lerp(this.targetCameraPosition, 0.05);
            if (this.camera.position.distanceTo(this.targetCameraPosition) < 0.1) {
                this.isAnimatingCamera = false;
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
