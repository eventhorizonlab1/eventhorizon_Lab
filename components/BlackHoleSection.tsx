import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RefreshCw, Eye, Thermometer, Activity, Sun, Disc, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

// --- INTERSTELLAR SHADERS ---

const DebrisVertexShader = `
    uniform float u_time;
    uniform float u_temperature;
    uniform float u_mode; // 0.0 = Warm, 1.0 = Cool
    attribute float a_scale;
    attribute vec3 a_color;
    attribute float a_angular_velocity;
    attribute float a_inward_velocity;
    attribute float a_start_radius;
    varying vec3 v_color;
    varying float v_alpha;
    varying float v_brightness;

    void main() {
        float angle = u_time * a_angular_velocity;
        float radius = a_start_radius - u_time * a_inward_velocity;
        
        // Event horizon cutoff
        if (radius < 10.0) {
            v_alpha = 0.0;
            radius = 10.0;
        } else {
            v_alpha = min(1.0, (radius - 10.0) / 5.0);
        }

        // Dynamic Color Palette based on Radius and Mode
        vec3 warmColor;
        vec3 coolColor;
        
        if (radius < 20.0) {
            warmColor = vec3(1.0, 1.0, 1.0);
            coolColor = vec3(0.9, 0.95, 1.0);
        } else if (radius < 35.0) {
            warmColor = vec3(1.0, 0.66, 0.0);
            coolColor = vec3(0.2, 0.8, 1.0);
        } else {
            warmColor = vec3(0.66, 0.13, 0.0);
            coolColor = vec3(0.1, 0.2, 0.9);
        }
        
        v_color = mix(warmColor, coolColor, u_mode);
        
        // Brightness based on distance (closer = brighter)
        v_brightness = 1000.0 / (radius * radius + 1.0);

        vec3 new_pos;
        new_pos.x = radius * cos(angle + position.x);
        new_pos.y = position.y * (1.0 + sin(u_time * 0.1 + position.x) * 0.1) * 0.2; // Flattened disk
        new_pos.z = radius * sin(angle + position.x);

        vec4 mv_position = modelViewMatrix * vec4(new_pos, 1.0);
        gl_Position = projectionMatrix * mv_position;
        
        float size = a_scale * (300.0 / -mv_position.z);
        gl_PointSize = max(1.0, size);
    }
`;

const DebrisFragmentShader = `
    varying vec3 v_color;
    varying float v_alpha;
    varying float v_brightness;

    void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        
        float glow = 1.0 - (dist * 2.0);
        glow = pow(glow, 1.5);
        
        vec3 final_color = v_color * v_brightness * 2.0;
        gl_FragColor = vec4(final_color, v_alpha * glow);
    }
`;

const AccretionDiskVertexShader = `
    varying vec2 v_uv;
    varying vec3 v_worldPosition;
    void main() {
        v_uv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        v_worldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
`;

const AccretionDiskFragmentShader = `
    uniform float u_time;
    uniform float u_brightness;
    uniform float u_temperature;
    uniform float u_mode; // 0.0 = Warm, 1.0 = Cool
    varying vec2 v_uv;
    varying vec3 v_worldPosition;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    void main() {
        vec2 to_center = vec2(0.5) - v_uv;
        float radius = length(to_center) * 2.0;
        float angle = atan(to_center.y, to_center.x);

        // Make the hole distinct (Event Horizon shadow)
        // 0.0 - 0.3 is the hole
        if (radius < 0.28) discard;
        if (radius > 1.0) discard;

        // Rotation speed increases closer to center (Keplerian)
        float speed = 3.0 / (radius * radius + 0.1); 
        float rot_angle = angle + u_time * speed * 0.1;

        // Complex noise for gas streaks
        float n1 = snoise(vec2(rot_angle * 15.0, radius * 20.0));
        float n2 = snoise(vec2(rot_angle * 8.0, radius * 8.0 - u_time * 0.5));
        float n3 = snoise(vec2(rot_angle * 4.0, radius * 4.0));
        
        // Combine noise layers
        float streaks = (n1 * 0.5 + 0.5) * 0.6 + (n2 * 0.5 + 0.5) * 0.3 + (n3 * 0.5 + 0.5) * 0.1;
        streaks = pow(streaks, 1.5); // Sharpen contrast

        // Interstellar Palette
        // Normalized radius for color mapping (0.0 at inner edge, 1.0 at outer)
        float r_norm = (radius - 0.28) / (1.0 - 0.28);
        
        // Warm Palette (Dark Mode)
        vec3 col_inner_warm = vec3(1.0, 0.98, 0.95);
        vec3 col_mid_warm = vec3(1.0, 0.65, 0.2);
        vec3 col_outer_warm = vec3(0.6, 0.05, 0.01);

        // Cool Palette (Light Mode)
        vec3 col_inner_cool = vec3(0.95, 0.98, 1.0);
        vec3 col_mid_cool = vec3(0.2, 0.7, 1.0);
        vec3 col_outer_cool = vec3(0.1, 0.1, 0.8);

        // Interpolate Palettes
        vec3 col_inner = mix(col_inner_warm, col_inner_cool, u_mode);
        vec3 col_mid = mix(col_mid_warm, col_mid_cool, u_mode);
        vec3 col_outer = mix(col_outer_warm, col_outer_cool, u_mode);
        
        vec3 color;
        if (r_norm < 0.2) {
            color = mix(col_inner, col_mid, r_norm / 0.2);
        } else {
            color = mix(col_mid, col_outer, (r_norm - 0.2) / 0.8);
        }

        // Apply temperature modifier
        color = mix(color, vec3(1.0), (u_temperature - 1.0) * 0.5);

        // Soft edges
        float alpha = smoothstep(0.28, 0.32, radius) * (1.0 - smoothstep(0.9, 1.0, radius));
        
        // DOPPLER BEAMING SIMULATION
        float doppler = sin(angle + 1.0); 
        float beaming = 1.0 + doppler * 0.55;
        
        if (doppler > 0.0) {
            color = mix(color, vec3(1.0, 1.0, 1.0), doppler * 0.2); 
            beaming *= 1.2;
        } else {
            color *= vec3(1.0, 0.8, 0.7); 
            beaming *= 0.6; 
        }

        vec3 final_color = color * streaks * u_brightness * beaming;
        
        // Add a core glow ring
        float core_ring = 1.0 - smoothstep(0.28, 0.32, radius);
        final_color += vec3(1.0, 1.0, 1.0) * core_ring * 5.0;

        gl_FragColor = vec4(final_color, alpha);
    }
`;

const LensingVertexShader = `
    varying vec2 v_uv;
    void main() {
        v_uv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
`;

const LensingFragmentShader = `
    uniform sampler2D t_background;
    uniform vec2 u_resolution;
    uniform float u_lensing_strength;
    uniform float u_mode; // 0.0 = Warm, 1.0 = Cool
    varying vec2 v_uv;

    const float SCHWARZSCHILD_RADIUS = 0.12; 
    const float LENSING_RADIUS = 0.55; 

    void main() {
        vec2 uv = v_uv;
        vec2 uv_center = uv - 0.5;
        
        uv_center.x *= u_resolution.x / u_resolution.y;
        
        float dist = length(uv_center);
        
        if (dist < SCHWARZSCHILD_RADIUS) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }
        
        float distortion = 0.0;
        if (dist < LENSING_RADIUS) {
            float x = dist;
            float rs = SCHWARZSCHILD_RADIUS;
            float offset = (rs * rs) / dist; 
            distortion = offset * u_lensing_strength * 0.8;
            float falloff = smoothstep(LENSING_RADIUS, SCHWARZSCHILD_RADIUS, dist);
            distortion *= falloff;
        }
        
        vec2 direction = normalize(uv_center);
        vec2 sampling_offset = direction * distortion;
        sampling_offset.x /= (u_resolution.x / u_resolution.y); 
        
        vec2 sample_uv = uv - sampling_offset;
        
        if (sample_uv.x < 0.0 || sample_uv.x > 1.0 || sample_uv.y < 0.0 || sample_uv.y > 1.0) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        } else {
            vec4 color = texture2D(t_background, sample_uv);
            
            // Photon Sphere (Bright Ring)
            float photon_ring = 1.0 - smoothstep(SCHWARZSCHILD_RADIUS, SCHWARZSCHILD_RADIUS + 0.005, dist);
            
            vec3 ring_warm = vec3(1.0, 0.9, 0.7);
            vec3 ring_cool = vec3(0.7, 0.9, 1.0);
            vec3 ring_col = mix(ring_warm, ring_cool, u_mode);

            color += vec4(ring_col, 0.0) * photon_ring * 2.0;

            gl_FragColor = color;
        }
    }
`;

const StarfieldVertexShader = `
    uniform float u_time;
    attribute float a_size;
    attribute float a_opacity;
    attribute float a_twinkle_speed;
    attribute float a_twinkle_offset;
    attribute vec3 a_color;
    varying float v_opacity;
    varying vec3 v_color;

    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Organic Twinkle Calculation
        float t = u_time * a_twinkle_speed;
        float wave1 = sin(t + a_twinkle_offset);
        float wave2 = sin(t * 0.64 + a_twinkle_offset * 2.3); 
        float wave3 = sin(t * 0.37 + a_twinkle_offset * 4.1); 
        
        float combinedTwinkle = (wave1 + wave2 + wave3) / 3.0;
        float pulse = smoothstep(-1.0, 1.0, combinedTwinkle);
        pulse = pow(pulse, 1.2);

        v_opacity = a_opacity * (0.55 + 0.45 * pulse); 
        v_color = a_color;
        
        float sizeMod = 0.8 + 0.5 * pulse;
        gl_PointSize = a_size * sizeMod * (500.0 / -mvPosition.z);
    }
`;

const StarfieldFragmentShader = `
    varying float v_opacity;
    varying vec3 v_color;
    
    void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        if (length(coord) > 0.5) discard;
        
        float strength = 1.0 - (length(coord) * 2.0);
        strength = pow(strength, 2.0); 
        
        gl_FragColor = vec4(v_color, v_opacity * strength);
    }
`;

class BlackHoleSim {
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
    
    currentMode: number = 0; // 0 for Warm (Dark Mode), 1 for Cool (Light Mode)

    constructor(container: HTMLElement) {
        // Scenes
        this.backgroundScene = new THREE.Scene();
        this.scene = new THREE.Scene();
        this.lensingScene = new THREE.Scene();

        // Camera - adjusted for container view
        this.camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 15, 90); 

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: false, 
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: false
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        // Background Target
        this.backgroundRenderTarget = new THREE.WebGLRenderTarget(
            container.clientWidth * Math.min(window.devicePixelRatio, 2),
            container.clientHeight * Math.min(window.devicePixelRatio, 2),
            { 
                type: THREE.HalfFloatType, 
                minFilter: THREE.LinearFilter, 
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat
            }
        );

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 40;
        this.controls.maxDistance = 200;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.3;
        this.controls.minPolarAngle = Math.PI / 2 - 0.3;
        this.controls.enablePan = false;
        this.controls.enableZoom = true;

        // Initialize Elements
        this.initLensing(container.clientWidth, container.clientHeight);
        this.initAccretionDisk();
        
        // Init stars BEFORE debris to help with layering
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
    }

    initAccretionDisk() {
        const diskGeometry = new THREE.RingGeometry(10, 45, 256, 32); 
        this.accretionDiskMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_brightness: { value: 1.5 },
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
    }

    initDebrisField() {
        const PARTICLE_COUNT = 10000; 
        const positions = [], colors = [];
        const angularVelocities = [], inwardVelocities = [], startRadii = [];
        const scales = [];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const radius = THREE.MathUtils.randFloat(12, 120);
            const angle = THREE.MathUtils.randFloat(0, Math.PI * 2);
            
            positions.push(
                radius * Math.cos(angle),
                THREE.MathUtils.randFloatSpread(1),
                radius * Math.sin(angle)
            );

            scales.push(Math.random());

            // Initial colors still used for structure/banding/randomness
            const color = new THREE.Color();
            if (radius < 20) color.setHex(0xffffff);
            else if (radius < 35) color.setHex(0xffaa00);
            else color.setHex(0xaa2200);
            
            colors.push(color.r, color.g, color.b);

            startRadii.push(radius);
            angularVelocities.push(3.0 / (radius * radius + 1.0));
            inwardVelocities.push(0.5);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('a_scale', new THREE.Float32BufferAttribute(scales, 1));
        geometry.setAttribute('a_color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('a_start_radius', new THREE.Float32BufferAttribute(startRadii, 1));
        geometry.setAttribute('a_angular_velocity', new THREE.Float32BufferAttribute(angularVelocities, 1));
        geometry.setAttribute('a_inward_velocity', new THREE.Float32BufferAttribute(inwardVelocities, 1));

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
    }

    initStarfield() {
        const geometry = new THREE.BufferGeometry();
        const count = 8000; 
        const positions = [];
        const sizes = [];
        const opacities = [];
        const twinkleSpeeds = [];
        const twinkleOffsets = [];
        const colors = [];

        for (let i = 0; i < count; i++) {
            const r = THREE.MathUtils.randFloat(400, 800);
            const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
            const phi = THREE.MathUtils.randFloat(0, Math.PI);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions.push(x, y, z);
            
            sizes.push(THREE.MathUtils.randFloat(0.5, 3.0)); 
            opacities.push(THREE.MathUtils.randFloat(0.1, 0.6)); 
            
            twinkleSpeeds.push(THREE.MathUtils.randFloat(0.2, 1.5));
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
    }

    initPostProcessing(width: number, height: number) {
        const renderTarget = new THREE.WebGLRenderTarget(
            width, height,
            { 
                type: THREE.HalfFloatType,
                format: THREE.RGBAFormat
            }
        );
        this.composer = new EffectComposer(this.renderer, renderTarget);

        this.scene.add(this.backgroundScene);

        const lensingPass = new RenderPass(this.lensingScene, this.camera);
        this.composer.addPass(lensingPass);

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(width, height),
            2.5, 0.8, 0.6
        );
        this.composer.addPass(this.bloomPass);

        const outputPass = new OutputPass();
        this.composer.addPass(outputPass);
    }

    resize(width: number, height: number) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
        this.backgroundRenderTarget.setSize(
            width * Math.min(window.devicePixelRatio, 2),
            height * Math.min(window.devicePixelRatio, 2)
        );
        if (this.lensingMaterial) {
            this.lensingMaterial.uniforms.u_resolution.value.set(width, height);
        }
    }

    update(time: number, delta: number, params: any) {
        // Smoothly interpolate mode
        const targetMode = params.isLightMode ? 1.0 : 0.0;
        this.currentMode += (targetMode - this.currentMode) * 0.05;

        // Update Uniforms
        this.lensingMaterial.uniforms.u_mode.value = this.currentMode;
        this.accretionDiskMaterial.uniforms.u_mode.value = this.currentMode;
        this.debrisMaterial.uniforms.u_mode.value = this.currentMode;
        
        this.bloomPass.strength = params.bloomIntensity;
        this.lensingMaterial.uniforms.u_lensing_strength.value = params.lensingStrength;
        
        this.accretionDiskMaterial.uniforms.u_brightness.value = params.diskBrightness;
        this.accretionDiskMaterial.uniforms.u_temperature.value = params.temperature;
        this.debrisMaterial.uniforms.u_temperature.value = params.temperature;

        const scaledTime = time * params.rotationSpeed;
        
        this.debrisMaterial.uniforms.u_time.value = scaledTime * 0.1;
        this.accretionDiskMaterial.uniforms.u_time.value = scaledTime * 0.4;

        if (this.starfieldMaterial) {
            this.starfieldMaterial.uniforms.u_time.value = time;
        }
        if (this.stars) {
            this.stars.rotation.y = time * 0.008;
        }

        this.controls.update();

        this.renderer.setRenderTarget(this.backgroundRenderTarget);
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);

        this.renderer.setRenderTarget(null);
        this.composer.render(delta);
    }

    dispose() {
        this.renderer.dispose();
        this.composer.dispose();
        this.backgroundRenderTarget.dispose();
    }
}

const BlackHoleSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<BlackHoleSim | null>(null);
  const { t, theme } = useThemeLanguage();
  
  // Interstellar Default Settings
  const [rotationSpeed, setRotationSpeed] = useState(0.8);
  const [bloomIntensity, setBloomIntensity] = useState(2.0);
  const [lensingStrength, setLensingStrength] = useState(1.0);
  const [diskBrightness, setDiskBrightness] = useState(4.0);
  const [temperature, setTemperature] = useState(1.0);

  useEffect(() => {
    if (!containerRef.current) return;

    const sim = new BlackHoleSim(containerRef.current);
    simRef.current = sim;

    let animationId: number;
    
    const animate = () => {
        animationId = requestAnimationFrame(animate);
        if (simRef.current) {
             simRef.current.update(sim.clock.getElapsedTime(), sim.clock.getDelta(), {
                rotationSpeed,
                bloomIntensity,
                lensingStrength,
                diskBrightness,
                temperature,
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

  // Use ref to prevent stale closure in loop
  const paramsRef = useRef({ rotationSpeed, bloomIntensity, lensingStrength, diskBrightness, temperature, theme });
  useEffect(() => {
      paramsRef.current = { rotationSpeed, bloomIntensity, lensingStrength, diskBrightness, temperature, theme };
  }, [rotationSpeed, bloomIntensity, lensingStrength, diskBrightness, temperature, theme]);

  const ControlSlider = ({ label, value, min, max, step, onChange, icon: Icon }: any) => (
    <div className="mb-6 group">
        <div className="flex justify-between items-center mb-2">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-200 transition-colors">
                {Icon && <Icon size={14} />} {label}
            </label>
            <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{value}</span>
        </div>
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step} 
            value={value} 
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 hover:[&::-webkit-slider-thumb]:bg-blue-400 transition-all [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        />
    </div>
  );

  const resetCam = () => {
      if (simRef.current) {
          simRef.current.camera.position.set(0, 15, 90);
          simRef.current.controls.target.set(0, 0, 0);
          simRef.current.controls.update();
      }
  };

  return (
    <motion.section 
      id="blackhole" 
      className="py-24 px-4 md:px-12 max-w-[1800px] mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Controls & Info */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 text-orange-500">
                <Disc size={32} strokeWidth={1.5} className="animate-spin-slow" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Astrophysics Sim</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-black dark:text-white transition-colors">
              {t('bh_title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
               {t('bh_subtitle')}
            </p>
          </div>

          {/* Settings Panel */}
          <div className="bg-gray-100 dark:bg-eh-gray p-8 rounded-[2rem] border border-gray-200 dark:border-white/5 relative overflow-hidden shadow-lg">
             <div className="relative z-10">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{t('bh_controls')}</h3>
                    <button onClick={resetCam} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-black dark:hover:text-white" title="Reset Camera">
                        <RefreshCw size={14} />
                    </button>
                </div>
                
                <ControlSlider label={t('bh_rotation')} icon={RefreshCw} value={rotationSpeed} min={0} max={2} step={0.1} onChange={setRotationSpeed} />
                <ControlSlider label={t('bh_bloom')} icon={Sun} value={bloomIntensity} min={0} max={4} step={0.1} onChange={setBloomIntensity} />
                <ControlSlider label={t('bh_lensing')} icon={Eye} value={lensingStrength} min={0} max={2} step={0.1} onChange={setLensingStrength} />
                <ControlSlider label={t('bh_density')} icon={Activity} value={diskBrightness} min={1} max={10} step={0.1} onChange={setDiskBrightness} />
                <ControlSlider label={t('bh_temp')} icon={Thermometer} value={temperature} min={0.5} max={2} step={0.1} onChange={setTemperature} />
             </div>
             
             {/* Background Accent */}
             <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_50%)] pointer-events-none"></div>
          </div>
        </div>

        {/* Right: Simulation Frame */}
        <div className="lg:col-span-8">
             <div className="relative rounded-[2rem] overflow-hidden bg-black border border-gray-200 dark:border-white/10 shadow-2xl w-full aspect-square md:aspect-[16/10] flex flex-col group">
                
                {/* Frame Header / Status Bar */}
                <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md z-20 absolute top-0 left-0 w-full">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-orange-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    </div>
                    <div className="flex items-center gap-2 opacity-70">
                        <Globe size={14} className="text-white" />
                        <span className="text-[10px] font-mono uppercase text-white tracking-widest">GARGANTUA_OBS // LIVE_FEED</span>
                    </div>
                </div>

                {/* Canvas Container */}
                <div ref={containerRef} className="absolute inset-0 w-full h-full z-10" />
                
                {/* Overlay UI inside Frame */}
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none flex justify-between items-end">
                    <div>
                        <h3 className="text-3xl font-black text-white/20 uppercase tracking-tighter">Event Horizon</h3>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 animate-pulse border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                        {t('bh_interact')}
                    </p>
                </div>

                {/* Decorative Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>
        </div>

      </div>
    </motion.section>
  );
};

export default BlackHoleSection;