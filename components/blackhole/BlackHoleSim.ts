// components/blackhole/BlackHoleSim.ts

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
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

    blackHoleMesh: THREE.Mesh;
    starfieldPoints: THREE.Points;

    disposables: any[] = [];

    constructor(container: HTMLElement) {
        // 1. Scene Setup
        this.scene = new THREE.Scene();

        // 2. Camera Setup
        // Positioned at z=55, looking at 0,0,0
        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 8, 55);

        // 3. Renderer Setup
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        // 4. Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 200;

        // 5. Initialize Objects
        this.initStarfield();
        this.initBlackHole();

        // 6. Post Processing (Basic for now)
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // 7. Initial Resize
        this.resize(container.clientWidth, container.clientHeight);

        console.log("BlackHoleSim: Initialized (Rewrite Step 1)");
    }

    initBlackHole() {
        // GEOMETRY: Large Sphere to act as a "Skybox" for the raymarching
        // Radius 100 ensures the camera (at z=55) is well inside
        const geometry = new THREE.SphereGeometry(100, 64, 64);

        // MATERIAL: Shader
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_resolution: { value: new THREE.Vector2(1, 1) },
                u_cameraPos: { value: new THREE.Vector3() }
            },
            vertexShader: BlackHoleVertexShader,
            fragmentShader: BlackHoleFragmentShader,
            side: THREE.DoubleSide, // Try DoubleSide to be 100% sure
            transparent: true,
            depthWrite: false,    // Do not write to depth buffer (allow stars behind to show if needed)
        });

        this.blackHoleMesh = new THREE.Mesh(geometry, material);

        // CRITICAL: Disable frustum culling to prevent disappearance
        this.blackHoleMesh.frustumCulled = false;

        this.scene.add(this.blackHoleMesh);
        this.disposables.push(geometry, material);
    }

    initStarfield() {
        const geometry = new THREE.BufferGeometry();
        const count = 2000;
        const positions = [];
        const sizes = [];

        for (let i = 0; i < count; i++) {
            // Random sphere distribution
            const r = 200 + Math.random() * 300; // Far background
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions.push(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
            sizes.push(Math.random() * 2.0);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('a_size', new THREE.Float32BufferAttribute(sizes, 1));

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

    resize(width: number, height: number) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        // this.composer.setSize(width, height); // Bypass composer

        if (this.blackHoleMesh && this.blackHoleMesh.material instanceof THREE.ShaderMaterial) {
            this.blackHoleMesh.material.uniforms.u_resolution.value.set(width, height);
        }
    }

    moveTo(x: number, y: number, z: number) {
        // Simplified camera move for now
        this.camera.position.set(x, y, z);
    }

    setAutoRotation(active: boolean) {
        this.controls.autoRotate = active;
    }

    resetCamera() {
        this.camera.position.set(0, 8, 55);
    }

    update(time: number, delta: number, params: any) {
        // Update Uniforms
        if (this.blackHoleMesh && this.blackHoleMesh.material instanceof THREE.ShaderMaterial) {
            const uniforms = this.blackHoleMesh.material.uniforms;
            uniforms.u_time.value = time;
            uniforms.u_cameraPos.value.copy(this.camera.position);
        }

        this.controls.update();
        // this.composer.render(); // Bypass composer
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        this.disposables.forEach(d => d.dispose());
        this.renderer.dispose();
    }
}
