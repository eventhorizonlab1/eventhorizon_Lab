
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RefreshCw, Eye, Thermometer, Activity, Sun, Disc, Globe, Navigation, Layers, ZoomIn, Cpu } from 'lucide-react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

// --- INTERSTELLAR SHADERS ---

const DebrisVertexShader = `
    uniform float u_time;
    uniform float u_temperature;
    uniform float u_mode; // 0.0 = Warm (Dark), 1.0 = Cool (Light)
    attribute float a_scale;
    attribute vec3 a_color;
    attribute float a_speed_modifier;
    attribute float a_start_radius;
    attribute float a_initial_angle;
    attribute float a_random_y;
    attribute float a_clump_id; 
    varying vec3 v_color;
    varying float v_alpha;
    varying float v_brightness;

    void main() {
        float time = u_time * 0.08;
        float decay_rate = (40.0 / (a_start_radius + 2.0)) * a_speed_modifier;
        float clump_decay_noise = sin(time * 0.5 + a_clump_id * 0.1) * 0.5 + 0.5;
        decay_rate *= (0.8 + 0.6 * clump_decay_noise);

        float radius_drift = mod(time * decay_rate * 3.0, 115.0);
        float current_radius = a_start_radius - radius_drift;
        
        float horizon = 8.0;
        float outer_edge = 120.0;
        if (current_radius < horizon) {
             current_radius = outer_edge - (horizon - current_radius);
        }
        
        float omega = 140.0 / pow(max(5.0, current_radius), 1.5);
        float spiral_offset = log(max(1.0, current_radius)) * 3.5; 
        float turbulence = sin(current_radius * 0.5 - time * 2.5) * 0.15;
        float clump_instability = sin(time * 2.0 + a_clump_id * 15.0) * 0.08 * (30.0 / current_radius);
        
        float current_angle = a_initial_angle + time * omega - spiral_offset * 0.1 + turbulence + clump_instability;

        float thickness = 0.03 * current_radius;
        float warp = sin(current_angle * 3.0 - time * 0.5) * cos(current_radius * 0.2) * 1.5;
        float current_y = a_random_y * thickness + warp;

        float edge_fade = smoothstep(horizon, horizon + 5.0, current_radius) * (1.0 - smoothstep(outer_edge - 15.0, outer_edge, current_radius));
        v_alpha = edge_fade;

        vec3 warmColor;
        vec3 coolColor;
        
        if (current_radius < 18.0) warmColor = vec3(1.0, 0.98, 0.95);
        else if (current_radius < 35.0) warmColor = vec3(1.0, 0.7, 0.2);
        else warmColor = vec3(0.6, 0.1, 0.05);

        if (current_radius < 18.0) coolColor = vec3(0.9, 0.95, 1.0);
        else if (current_radius < 35.0) coolColor = vec3(0.2, 0.6, 1.0);
        else coolColor = vec3(0.05, 0.1, 0.4);
        
        v_color = mix(warmColor, coolColor, u_mode);
        
        float view_doppler = sin(current_angle + 2.0); 
        float doppler_mult = smoothstep(-0.8, 1.0, view_doppler) * 3.0 + 0.5;
        v_brightness = (600.0 / (current_radius * current_radius * 0.2 + 5.0)) * u_temperature * doppler_mult;
        
        float clump_brightness = 1.0 + 0.5 * sin(a_clump_id * 10.0 + time * 5.0);
        v_brightness *= clump_brightness;

        vec3 pos;
        pos.x = current_radius * cos(current_angle);
        pos.z = current_radius * sin(current_angle);
        pos.y = current_y;

        vec4 mv_position = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv_position;
        
        float size_attenuation = (600.0 / -mv_position.z);
        gl_PointSize = max(0.0, a_scale * size_attenuation);
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
        glow = glow * glow * (3.0 - 2.0 * glow); 
        
        vec3 final_color = v_color;
        final_color *= v_brightness;
        
        float core = smoothstep(0.0, 0.15, 0.5 - dist) * smoothstep(2.0, 8.0, v_brightness);
        final_color = mix(final_color, vec3(1.0), core);

        gl_FragColor = vec4(final_color, v_alpha * glow * 0.8);
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

        if (radius < 0.28) discard;
        if (radius > 1.0) discard;

        float speed = 5.0 / (radius * radius + 0.1); 
        float rot_angle = angle + u_time * speed * 0.1;

        float n1 = snoise(vec2(rot_angle * 8.0, radius * 12.0));
        float n2 = snoise(vec2(rot_angle * 4.0, radius * 3.0 - u_time * 0.1));
        
        float streaks = (n1 * 0.4 + 0.6) * (n2 * 0.4 + 0.6);
        streaks = pow(streaks, 1.5); 

        float r_norm = (radius - 0.28) / (1.0 - 0.28);
        
        vec3 col_inner_warm = vec3(1.0, 0.95, 0.85); 
        vec3 col_mid_warm = vec3(1.0, 0.5, 0.1);    
        vec3 col_outer_warm = vec3(0.2, 0.02, 0.01);

        vec3 col_inner_cool = vec3(0.95, 0.98, 1.0); 
        vec3 col_mid_cool = vec3(0.2, 0.6, 1.0);    
        vec3 col_outer_cool = vec3(0.02, 0.05, 0.2);

        vec3 col_inner = mix(col_inner_warm, col_inner_cool, u_mode);
        vec3 col_mid = mix(col_mid_warm, col_mid_cool, u_mode);
        vec3 col_outer = mix(col_outer_warm, col_outer_cool, u_mode);
        
        vec3 color;
        float mid_point = 0.45; 
        if (r_norm < mid_point) {
            float t = r_norm / mid_point;
            color = mix(col_inner, col_mid, t * t);
        } else {
            float t = (r_norm - mid_point) / (1.0 - mid_point);
            color = mix(col_mid, col_outer, sqrt(t));
        }

        color = mix(color, vec3(1.0), (u_temperature - 1.0) * 0.3);
        float alpha = smoothstep(0.28, 0.35, radius) * (1.0 - smoothstep(0.9, 1.0, radius));
        
        float doppler = sin(angle + 1.8); 
        float beaming = 1.0 + doppler * 0.5;
        
        if (doppler > 0.0) {
            color = mix(color, vec3(1.0, 1.0, 1.0), doppler * 0.15);
            beaming = pow(beaming, 1.1);
        } else {
            color *= vec3(0.9, 0.7, 0.6); 
            beaming *= 0.5; 
        }

        vec3 final_color = color * streaks * u_brightness * beaming;
        final_color *= (1.0 + u_mode * 0.1);

        float inner_glow = exp(-(radius - 0.28) * 30.0);
        final_color += col_inner * inner_glow * 1.5;

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

    const float SCHWARZSCHILD_RADIUS = 0.125; 
    const float LENSING_RADIUS = 0.7; 

    void main() {
        vec2 uv = v_uv;
        vec2 uv_center = uv - 0.5;
        uv_center.x *= u_resolution.x / u_resolution.y;
        float dist = length(uv_center);
        
        if (dist < SCHWARZSCHILD_RADIUS) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }
        
        float rs = SCHWARZSCHILD_RADIUS;
        float normalized_dist = dist / rs;
        float d_strength = 0.025 * u_lensing_strength;
        float offset = d_strength / (pow(normalized_dist - 0.9, 2.0) + 0.02);
        offset *= smoothstep(LENSING_RADIUS, rs, dist);
        
        vec2 direction = normalize(uv_center);
        vec2 sampling_offset = direction * offset;
        sampling_offset.x /= (u_resolution.x / u_resolution.y); 
        
        float ca = 0.008 * offset * 40.0; 
        
        vec2 uv_r = uv - sampling_offset * (1.0 + ca);
        vec2 uv_g = uv - sampling_offset;
        vec2 uv_b = uv - sampling_offset * (1.0 - ca);
        
        float r = texture2D(t_background, uv_r).r;
        float g = texture2D(t_background, uv_g).g;
        float b = texture2D(t_background, uv_b).b;
        
        vec3 color = vec3(r, g, b);
        float edge_dist = dist - SCHWARZSCHILD_RADIUS;
        float ring_width = 0.002;
        float photon_ring = smoothstep(ring_width, 0.0, edge_dist);
        photon_ring += exp(-edge_dist * 150.0) * 0.4;
        
        vec3 ring_warm = vec3(1.0, 0.95, 0.85); 
        vec3 ring_cool = vec3(0.8, 0.95, 1.0);  
        vec3 ring_col = mix(ring_warm, ring_cool, u_mode);

        color += ring_col * photon_ring * (1.5 + u_lensing_strength * 0.5);
        gl_FragColor = vec4(color, 1.0);
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
        
        float t = u_time * a_twinkle_speed;
        float wave1 = sin(t + a_twinkle_offset);
        float wave2 = sin(t * 0.64 + a_twinkle_offset * 2.3); 
        
        float combinedTwinkle = (wave1 + wave2) / 2.0;
        float pulse = smoothstep(-1.0, 1.0, combinedTwinkle);
        pulse = pow(pulse, 1.5);

        v_opacity = a_opacity * (0.6 + 0.4 * pulse); 
        v_color = a_color;
        
        float sizeMod = 0.8 + 0.4 * pulse;
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
    
    currentMode: number = 0; 
    isMobile: boolean = false;
    
    disposables: any[] = [];

    targetCameraPosition: THREE.Vector3;
    isAnimatingCamera: boolean = false;

    constructor(container: HTMLElement) {
        this.isMobile = window.innerWidth < 768;
        
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
            depth: false
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
            colors.push(1,1,1); 
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
        this.isMobile = width < 768;
        
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

        <div className="mb-12">
             <div className="relative rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-black border border-gray-200 dark:border-white/10 shadow-2xl w-full aspect-square md:aspect-[21/9] flex flex-col group transition-colors duration-500">
                
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

                <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md z-20 absolute top-0 left-0 w-full">
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
                        <div className="flex items-center gap-2 opacity-70">
                            <Globe size={14} className="text-black dark:text-white" />
                            <span className="text-[10px] font-mono uppercase text-black dark:text-white tracking-widest">GARGANTUA_OBS // LIVE_FEED</span>
                        </div>
                    </div>
                </div>

                <div ref={containerRef} className="absolute inset-0 w-full h-full z-10" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 bg-gradient-to-t from-gray-200/90 dark:from-black/80 to-transparent pointer-events-none flex justify-between items-end">
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

        <div className="bg-white dark:bg-eh-gray p-8 rounded-[2rem] border border-gray-200 dark:border-white/5 relative overflow-hidden shadow-lg transition-colors duration-500 max-w-6xl mx-auto w-full">
             <div className="relative z-10">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{t('bh_controls')}</h3>
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
