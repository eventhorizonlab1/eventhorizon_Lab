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
    composer!: EffectComposer;
    controls: OrbitControls;
    clock: THREE.Clock;

    blackHoleMesh!: THREE.Mesh;
    starfieldPoints!: THREE.Points;
    bloomPass!: UnrealBloomPass;

    isMobile: boolean = false;
    disposables: any[] = [];
    targetCameraPosition: THREE.Vector3;
    isAnimatingCamera: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        this.isMobile = window.innerWidth < 1024;

        this.scene = new THREE.Scene();

        // Caméra : Positionnée à z=55 pour voir le trou noir (qui est à 0,0,0)
        const width = Math.max(1, canvas.clientWidth);
        const height = Math.max(1, canvas.clientHeight);
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 8, 55);
        this.targetCameraPosition = new THREE.Vector3(0, 8, 55);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas, // USE EXISTING CANVAS
            antialias: false, // Le post-processing gère l'AA
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.0 : 1.5));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.setClearColor(0x000000, 0.0);
        this.renderer.autoClear = true;

        this.clock = new THREE.Clock();

        // Contrôles Orbitaux
        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 120;
        this.controls.enablePan = false;
        this.controls.enableZoom = false; // Keep zoom disabled for scroll safety
        this.controls.maxPolarAngle = Math.PI * 0.85;
        this.controls.minPolarAngle = Math.PI * 0.15;

        this.initStarfield();
        this.initBlackHoleVolume();
        this.initPostProcessing(width, height);

        // Initial Resize
        this.resize(width, height);

    }

    initBlackHoleVolume() {
        // Création d'un grand cube qui contient le trou noir
        // Le shader sera appliqué sur les faces intérieures de ce cube (BackSide)
        // Using BoxGeometry as requested by user snippet, but Sphere is also fine.
        // Let's stick to Sphere for smoother skybox effect in raymarching, 
        // OR use Box if the shader relies on box coordinates (it uses vWorldPosition so it doesn't matter).
        // User snippet used BoxGeometry(200, 200, 200).
        const geometry = new THREE.BoxGeometry(200, 200, 200);

        const material = new THREE.ShaderMaterial({
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
            side: THREE.DoubleSide, // Ensure visibility from both sides
            transparent: false,
            blending: THREE.NormalBlending,
        });

        this.blackHoleMesh = new THREE.Mesh(geometry, material);
        this.blackHoleMesh.frustumCulled = false; // Critical
        this.scene.add(this.blackHoleMesh);
        this.disposables.push(geometry, material);
    }

    initStarfield() {
        // Création des particules d'étoiles autour
        const geometry = new THREE.BufferGeometry();
        const count = 4000;
        const positions = [];
        const sizes = [];
        const opacities = [];
        const speeds = [];

        for (let i = 0; i < count; i++) {
            const r = 300 + Math.random() * 200;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions.push(x, y, z);
            sizes.push(Math.random() * 2);
            opacities.push(Math.random());
            speeds.push(Math.random() * 0.2);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('a_size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('a_opacity', new THREE.Float32BufferAttribute(opacities, 1));
        geometry.setAttribute('a_twinkle_speed', new THREE.Float32BufferAttribute(speeds, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: { u_time: { value: 0 } },
            vertexShader: StarfieldVertexShader,
            fragmentShader: StarfieldFragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.starfieldPoints = new THREE.Points(geometry, material);
        this.scene.add(this.starfieldPoints);
        this.disposables.push(geometry, material);
    }

    initPostProcessing(width: number, height: number) {
        this.composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Bloom pour l'effet lumineux intense
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(width, height),
            1.5, // Strength
            0.4, // Radius
            0.85 // Threshold
        );
        this.composer.addPass(bloomPass);
        this.bloomPass = bloomPass;

        const outputPass = new OutputPass();
        this.composer.addPass(outputPass);
    }

    resize(width: number, height: number) {
        this.isMobile = width < 1024;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);

        if (this.blackHoleMesh && this.blackHoleMesh.material instanceof THREE.ShaderMaterial) {
            this.blackHoleMesh.material.uniforms.u_resolution.value.set(width, height);
        }
    }

    moveTo(x: number, y: number, z: number) {
        this.targetCameraPosition.set(x, y, z);
        this.isAnimatingCamera = true;
    }

    setAutoRotation(active: boolean) {
        this.controls.autoRotate = active;
        this.controls.autoRotateSpeed = 0.5;
    }

    resetCamera() {
        this.targetCameraPosition.set(0, 8, 55);
        this.isAnimatingCamera = true;
        this.controls.autoRotate = false;
    }

    update(time: number, delta: number, params: any) {
        if (this.blackHoleMesh && this.blackHoleMesh.material instanceof THREE.ShaderMaterial) {
            const uniforms = this.blackHoleMesh.material.uniforms;
            uniforms.u_time.value = time * params.rotationSpeed;

            const brightnessMod = params.isLightMode ? 1.5 : 1.0;

            uniforms.u_bloom.value = params.diskBrightness * brightnessMod;
            uniforms.u_lensing.value = params.lensingStrength;
            uniforms.u_disk_density.value = params.diskBrightness;
            uniforms.u_temp.value = params.temperature;
            uniforms.u_cameraPos.value.copy(this.camera.position);
        }

        if (this.starfieldPoints && this.starfieldPoints.material instanceof THREE.ShaderMaterial) {
            this.starfieldPoints.material.uniforms.u_time.value = time;
        }

        if (this.bloomPass) {
            this.bloomPass.strength = params.bloomIntensity;
        }

        if (this.isAnimatingCamera) {
            this.camera.position.lerp(this.targetCameraPosition, 0.05);
            if (this.camera.position.distanceTo(this.targetCameraPosition) < 0.1) {
                this.isAnimatingCamera = false;
                this.controls.update();
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
