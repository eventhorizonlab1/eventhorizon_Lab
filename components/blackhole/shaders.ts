// components/blackhole/shaders.ts

export const BlackHoleVertexShader = `
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vec4 mvPosition = viewMatrix * worldPosition;
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

export const BlackHoleFragmentShader = `
    precision highp float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec3 u_cameraPos;
    uniform float u_bloom;
    uniform float u_lensing;
    uniform float u_disk_density;
    uniform float u_temp;
    
    varying vec3 vWorldPosition;

    // --- NOISE FUNCTIONS ---
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    
    // Bruit 3D optimisé
    float noise(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 57.0 + p.z * 113.0;
        return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                       mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
                   mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                       mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
    }

    // Fractal Brownian Motion modifié pour créer des stries
    float fbm(vec3 p) {
        float f = 0.0;
        float w = 0.5;
        // On modifie l'échelle pour étirer le bruit tangentiellement
        // Cela crée l'effet de "motion blur" circulaire typique d'Interstellar
        for (int i = 0; i < 5; i++) { 
            f += w * noise(p);
            p.xz *= 2.0; // Plus de détails sur le plan horizontal
            p.y *= 1.5;  // Moins de détails verticaux
            w *= 0.5;
        }
        return f;
    }

    void main() {
        vec3 ro = u_cameraPos;
        vec3 rd = normalize(vWorldPosition - u_cameraPos);
        
        vec3 col = vec3(0.0);
        float alpha = 0.0;
        vec3 p = ro;
        
        float stepSize = 0.1;
        float maxDist = 50.0;
        float bhRadius = 1.0; // Schwarzschild radius
        
        for(int i = 0; i < 150; i++) {
            float dist = length(p);
            
            // Event Horizon
            if(dist < bhRadius) {
                col = mix(col, vec3(0.0), 1.0 - alpha);
                alpha = 1.0;
                break;
            }
            
            if(dist > maxDist) break;
            
            // Gravitational Lensing
            // Bend light towards the black hole center
            // Force is roughly proportional to 1/r^2
            float gravityStrength = u_lensing * 0.1;
            vec3 toCenter = normalize(-p);
            vec3 gravity = toCenter * (gravityStrength / (dist * dist));
            
            // Apply curvature
            rd = normalize(rd + gravity * stepSize);
            
            // Accretion Disk
            // Disk lies in the XZ plane (y=0)
            float diskY = abs(p.y);
            float diskH = 0.1 + dist * 0.08; // Disk thickness increases with radius
            
            // Check if we are inside the disk volume
            if(diskY < diskH && dist > 2.5 && dist < 12.0) {
                // Calculate polar coordinates for noise mapping
                float angle = atan(p.z, p.x);
                float speed = 2.0 / (dist + 0.1); // Inner parts rotate faster
                
                // 3D Noise position (animated)
                vec3 noisePos = vec3(dist * 2.0, angle * 2.0 + u_time * speed, p.y * 4.0);
                float noiseVal = fbm(noisePos);
                
                // Density calculation
                float density = noiseVal * u_disk_density;
                
                // Fade edges
                density *= smoothstep(2.5, 3.5, dist); // Inner fade
                density *= smoothstep(12.0, 9.0, dist); // Outer fade
                density *= smoothstep(diskH, 0.0, diskY); // Vertical fade
                
                // Doppler Effect / Relativistic Beaming
                // Matter moves counter-clockwise
                vec3 vel = normalize(vec3(-p.z, 0.0, p.x));
                float doppler = dot(rd, vel);
                float beaming = 1.0 + doppler * 0.8;
                beaming = max(0.1, beaming);
                
                // Color mapping
                vec3 diskColor = vec3(1.0, 0.5, 0.1); // Base orange
                diskColor *= u_temp * beaming; // Apply temperature and beaming
                
                // Accumulate color
                float segmentAlpha = density * 0.2 * stepSize;
                segmentAlpha = clamp(segmentAlpha, 0.0, 1.0);
                
                col += diskColor * segmentAlpha * (1.0 - alpha);
                alpha += segmentAlpha;
                
                if(alpha > 0.99) break;
            }
            
            // Step forward
            // Variable step size for performance
            stepSize = 0.05 + dist * 0.02;
            p += rd * stepSize;
        }
        
        gl_FragColor = vec4(col, alpha);
    }
`;

export const StarfieldVertexShader = `
    uniform float u_time;
    attribute float a_size;
    attribute float a_opacity;
    attribute float a_twinkle_speed;
    varying float v_opacity;
    varying vec3 v_color;

    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        float t = u_time * a_twinkle_speed;
        float pulse = sin(t) * 0.5 + 0.5;
        v_opacity = a_opacity * (0.7 + 0.3 * pulse); 
        v_color = vec3(1.0, 1.0, 1.0);
        gl_PointSize = a_size * (300.0 / -mvPosition.z);
    }
`;

export const StarfieldFragmentShader = `
    varying float v_opacity;
    varying vec3 v_color;
    void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        float glow = 1.0 - (dist * 2.0);
        glow = pow(glow, 2.0);
        gl_FragColor = vec4(v_color, v_opacity * glow);
    }
`;
