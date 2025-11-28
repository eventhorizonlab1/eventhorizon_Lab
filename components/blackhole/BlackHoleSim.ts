import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import {
    DebrisVertexShader,
    DebrisFragmentShader,
    AccretionDiskVertexShader,
    AccretionDiskFragmentShader,
    LensingVertexShader,
    LensingFragmentShader,
    StarfieldVertexShader,
    StarfieldFragmentShader
} from './shaders';

export class BlackHoleSim {
    scene: THREE.Scene;
    backgroundScene: THREE.Scene;
    lensingScene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    backgroundRenderTarget: THREE.WebGLRenderTarget;
    controls: OrbitControls;
    clock: THREE.Clock;

    lensingMaterial: THREE.ShaderMaterial;
    accretionDiskMaterial: THREE.ShaderMaterial;
    debrisMaterial: THREE.ShaderMaterial;
    starfieldMaterial: THREE.ShaderMaterial;
    stars: THREE.Points;
    bloomPass: UnrealBloomPass;

    currentMode: number = 0;
    isMobile: boolean = false;

    disposables: any[] = [];

    targetCameraPosition: THREE.Vector3;
    isAnimatingCamera: boolean = false;

    constructor(container: HTMLElement) {
        // OPTIMIZATION: Include tablets (iPads < 1024px) in mobile check to safe battery/GPU
        this.isMobile = window.innerWidth < 1024;

        this.backgroundScene = new THREE.Scene();
        this.scene = new THREE.Scene();
        this.lensingScene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 15, 90);
        this.targetCameraPosition = new THREE.Vector3(0, 15, 90);

        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: false,
            preserveDrawingBuffer: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);

        const maxPixelRatio = this.isMobile ? 1.0 : 1.5;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));

        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        this.backgroundRenderTarget = new THREE.WebGLRenderTarget(
            container.clientWidth * Math.min(window.devicePixelRatio, maxPixelRatio),
            container.clientHeight * Math.min(window.devicePixelRatio, maxPixelRatio),
            {
                type: THREE.HalfFloatType,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat
            }
        );

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 40;
        this.controls.maxDistance = 200;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.3;
        this.controls.minPolarAngle = Math.PI / 2 - 0.3;
        this.controls.enablePan = false;
        this.controls.enableZoom = true;

        this.initLensing(container.clientWidth, container.clientHeight);
        this.initAccretionDisk();
        this.initStarfield();
        this.initDebrisField();
        this.initPostProcessing(container.clientWidth, container.clientHeight);
    }

    initLensing(width: number, height: number) {
        this.lensingMaterial = new THREE.ShaderMaterial({
            uniforms: {
                t_background: { value: this.backgroundRenderTarget.texture },
                u_resolution: { value: new THREE.Vector2(width, height) },
                u_lensing_strength: { value: 1.0 },
                u_mode: { value: 0.0 }
            },
            vertexShader: LensingVertexShader,
            fragmentShader: LensingFragmentShader,
            depthWrite: false,
            depthTest: false
        });
        const lensingQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.lensingMaterial);
        this.lensingScene.add(lensingQuad);
        this.disposables.push(this.lensingMaterial, lensingQuad.geometry);
    }

    initAccretionDisk() {
        const diskGeometry = new THREE.RingGeometry(10, 45, 256, 32);
        this.accretionDiskMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_brightness: { value: 1.0 },
                u_temperature: { value: 1.0 },
                u_mode: { value: 0.0 }
            },
            vertexShader: AccretionDiskVertexShader,
            fragmentShader: AccretionDiskFragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const accretionDisk = new THREE.Mesh(diskGeometry, this.accretionDiskMaterial);
        accretionDisk.rotation.x = Math.PI / 2;
        this.scene.add(accretionDisk);
        this.disposables.push(diskGeometry, this.accretionDiskMaterial);
    }

    initDebrisField() {
        const PARTICLE_COUNT = this.isMobile ? 15000 : 45000;

        const positions = [], colors = [];
        const scales = [], startRadii = [], initialAngles = [], randomYs = [], speedModifiers = [];
        const clumpIds = [];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const isStructure = Math.random() > 0.15;
            let radius, angle, clumpId;

            if (isStructure) {
                const armCount = 3;
                const armIndex = i % armCount;
                const t = Math.random();
                radius = 10 + 105 * Math.pow(t, 0.8);
                const winding = 4.0;
                const armOffset = (Math.PI * 2 / armCount) * armIndex;
                angle = t * Math.PI * 2 * winding + armOffset;
                const chunk = Math.floor(t * 20);
                clumpId = armIndex * 100 + chunk;
                const spreadBase = 2.0 + t * 15.0;
                const r_spread = THREE.MathUtils.randFloatSpread(spreadBase);
                const a_spread = THREE.MathUtils.randFloatSpread(0.5 / (t + 0.2));
                radius += r_spread;
                angle += a_spread;
            } else {
                radius = THREE.MathUtils.randFloat(9, 115);
                angle = Math.random() * Math.PI * 2;
                clumpId = Math.random() * 1000;
            }

            const thickness = 0.25 + (radius / 120.0) * 6.0;
            const u = Math.random();
            const v = Math.random();
            const z = Math.sqrt(-2.0 * Math.log(1.0 - u)) * Math.cos(2.0 * Math.PI * v);
            const yVal = z * thickness * 0.4;

            positions.push(0, 0, 0);
            startRadii.push(radius);
            initialAngles.push(angle);
            randomYs.push(yVal);
            scales.push(Math.random() * 2.0 + 0.5);
            colors.push(1, 1, 1);
            speedModifiers.push(Math.random() * 0.4 + 0.8);
            clumpIds.push(clumpId);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('a_scale', new THREE.Float32BufferAttribute(scales, 1));
        geometry.setAttribute('a_color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('a_start_radius', new THREE.Float32BufferAttribute(startRadii, 1));
        geometry.setAttribute('a_initial_angle', new THREE.Float32BufferAttribute(initialAngles, 1));
        geometry.setAttribute('a_random_y', new THREE.Float32BufferAttribute(randomYs, 1));
        geometry.setAttribute('a_speed_modifier', new THREE.Float32BufferAttribute(speedModifiers, 1));
        geometry.setAttribute('a_clump_id', new THREE.Float32BufferAttribute(clumpIds, 1));

        this.debrisMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_temperature: { value: 1.0 },
                u_mode: { value: 0.0 }
            },
            vertexShader: DebrisVertexShader,
            fragmentShader: DebrisFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const debrisField = new THREE.Points(geometry, this.debrisMaterial);
        this.backgroundScene.add(debrisField);
        this.disposables.push(geometry, this.debrisMaterial);
    }

    initStarfield() {
        const geometry = new THREE.BufferGeometry();
        const count = this.isMobile ? 3000 : 8000;
        const positions = [];
        const sizes = [];
        const opacities = [];
        const twinkleSpeeds = [];
        const twinkleOffsets = [];
        const colors = [];

        for (let i = 0; i < count; i++) {
            const r = THREE.MathUtils.randFloat(400, 900);
            const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
            const phi = THREE.MathUtils.randFloat(0, Math.PI);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            positions.push(x, y, z);
            sizes.push(THREE.MathUtils.randFloat(0.5, 2.5));
            opacities.push(THREE.MathUtils.randFloat(0.1, 0.5));
            twinkleSpeeds.push(THREE.MathUtils.randFloat(0.2, 1.0));
            twinkleOffsets.push(THREE.MathUtils.randFloat(0, Math.PI * 2));
            const color = new THREE.Color();
            const temp = Math.random();
            if (temp > 0.9) color.setHSL(0.6, 0.5, 0.9);
            else if (temp < 0.1) color.setHSL(0.1, 0.5, 0.9);
            else color.setHex(0xffffff);
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('a_size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('a_opacity', new THREE.Float32BufferAttribute(opacities, 1));
        geometry.setAttribute('a_twinkle_speed', new THREE.Float32BufferAttribute(twinkleSpeeds, 1));
        geometry.setAttribute('a_twinkle_offset', new THREE.Float32BufferAttribute(twinkleOffsets, 1));
        geometry.setAttribute('a_color', new THREE.Float32BufferAttribute(colors, 3));

        this.starfieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 }
            },
            vertexShader: StarfieldVertexShader,
            fragmentShader: StarfieldFragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.stars = new THREE.Points(geometry, this.starfieldMaterial);
        this.stars.renderOrder = -1;
        this.backgroundScene.add(this.stars);
        this.disposables.push(geometry, this.starfieldMaterial);
    }

    initPostProcessing(width: number, height: number) {
        const renderTarget = new THREE.WebGLRenderTarget(
            width, height,
            { type: THREE.HalfFloatType, format: THREE.RGBAFormat }
        );
        this.composer = new EffectComposer(this.renderer, renderTarget);
        this.scene.add(this.backgroundScene);
        const lensingPass = new RenderPass(this.lensingScene, this.camera);
        this.composer.addPass(lensingPass);
        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.1, 0.5, 0.85);
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
        const maxPixelRatio = this.isMobile ? 1.0 : 1.5;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
        this.backgroundRenderTarget.setSize(width * Math.min(window.devicePixelRatio, maxPixelRatio), height * Math.min(window.devicePixelRatio, maxPixelRatio));
        if (this.lensingMaterial) this.lensingMaterial.uniforms.u_resolution.value.set(width, height);
    }

    moveTo(x: number, y: number, z: number) {
        this.targetCameraPosition.set(x, y, z);
        this.isAnimatingCamera = true;
    }

    update(time: number, delta: number, params: any) {
        const targetMode = params.isLightMode ? 1.0 : 0.0;
        this.currentMode += (targetMode - this.currentMode) * 0.05;

        this.lensingMaterial.uniforms.u_mode.value = this.currentMode;
        this.accretionDiskMaterial.uniforms.u_mode.value = this.currentMode;
        this.debrisMaterial.uniforms.u_mode.value = this.currentMode;

        this.bloomPass.strength = params.bloomIntensity;
        this.lensingMaterial.uniforms.u_lensing_strength.value = params.lensingStrength;
        this.accretionDiskMaterial.uniforms.u_brightness.value = params.diskBrightness;
        this.accretionDiskMaterial.uniforms.u_temperature.value = params.temperature;
        this.debrisMaterial.uniforms.u_temperature.value = params.temperature;

        const scaledTime = time * params.rotationSpeed;
        this.debrisMaterial.uniforms.u_time.value = scaledTime;
        this.accretionDiskMaterial.uniforms.u_time.value = scaledTime;
        if (this.starfieldMaterial) this.starfieldMaterial.uniforms.u_time.value = time;
        if (this.stars) this.stars.rotation.y = time * 0.008;

        if (this.isAnimatingCamera) {
            this.camera.position.lerp(this.targetCameraPosition, 0.05);
            if (this.camera.position.distanceTo(this.targetCameraPosition) < 0.1) {
                this.isAnimatingCamera = false;
                this.controls.update();
            }
        }

        this.controls.update();

        this.renderer.setRenderTarget(this.backgroundRenderTarget);
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
        this.composer.render(delta);
    }

    dispose() {
        this.controls.dispose();

        this.disposables.forEach(obj => {
            if (obj && typeof obj.dispose === 'function') {
                obj.dispose();
            }
        });
        this.disposables = [];

        const scenes = [this.scene, this.backgroundScene, this.lensingScene];
        scenes.forEach(scene => {
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach((m: any) => m.dispose());
                        } else {
                            (object.material as any).dispose();
                        }
                    }
                }
            });
            scene.clear();
        });

        if (this.bloomPass && typeof this.bloomPass.dispose === 'function') {
            this.bloomPass.dispose();
        }
        if (this.composer && this.composer.passes) {
            this.composer.passes.forEach((pass: any) => {
                if (pass && typeof pass.dispose === 'function') {
                    pass.dispose();
                }
            });
        }

        this.renderer.dispose();
        this.composer.dispose();
        this.backgroundRenderTarget.dispose();
    }
}
