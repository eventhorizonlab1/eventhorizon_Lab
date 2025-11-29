export const BlackHoleVertexShader = `
    varying vec3 vWorldPosition;

    void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
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

    // --- NOISE & UTILS ---
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 57.0 + 113.0 * p.z;
        return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                       mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
                   mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                       mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
    }
    
    // FBM for Disk Texture
    float fbm(vec3 p) {
        float f = 0.0;
        float amp = 0.5;
        for(int i=0; i<4; i++) {
            f += amp * noise(p);
            p *= 2.0;
            amp *= 0.5;
        }
        return f;
    }

    void main() {
        vec3 ro = u_cameraPos;
        vec3 rd = normalize(vWorldPosition - u_cameraPos);
        
        vec3 col = vec3(0.0);
        
        // PARAMS
        float rs = 3.0; // Schwarzschild Radius
        float isco = 3.0 * rs; // Innermost Stable Circular Orbit
        float diskRad = 18.0; // Disk Outer Radius
        
        vec3 p = ro;
        float stepSize = 0.15;
        
        float accum = 0.0; // Light accumulation
        float trans = 1.0; // Transmittance
        
        for(int i=0; i<150; i++) {
            float r = length(p);
            
            // 1. GRAVITY
            vec3 gravity = -normalize(p) * (4.0 * u_lensing / (r * r + 0.1));
            rd += gravity * stepSize;
            rd = normalize(rd);
            
            // 2. EVENT HORIZON
            if(r < rs) {
                // Hit Black Hole
                trans = 0.0;
                break;
            }
            
            // 3. ACCRETION DISK
            float distToPlane = abs(p.y);
            
            if(distToPlane < 1.0 && r > isco && r < diskRad) {
                // We are inside the disk volume
                
                // Calculate disk coordinates
                float angle = atan(p.z, p.x);
                float rad = length(p.xz);
                
                // Density falloff
                float density = exp(-(rad - isco) * 0.3);
                
                // Rotation & Noise
                float rot = 5.0 / (rad + 0.1);
                float noiseVal = fbm(vec3(rad * 2.0, angle * 3.0 + u_time * rot, p.y * 4.0));
                
                density *= (noiseVal * 0.8 + 0.2);
                density *= smoothstep(1.0, 0.0, distToPlane); // Fade out vertically
                
                // Doppler Beaming
                vec3 tangent = normalize(vec3(-p.z, 0.0, p.x));
                float doppler = dot(rd, tangent);
                float beam = smoothstep(-0.5, 1.0, doppler * 2.0 + 0.5);
                
                // Color
                vec3 diskColor = vec3(1.0, 0.5, 0.1) * u_temp;
                diskColor = mix(diskColor, vec3(0.1, 0.5, 1.0), beam * 0.5); // Blue shift
                
                // Accumulate light
                float stepDens = density * stepSize * u_disk_density;
                float light = stepDens * beam * u_bloom;
                
                accum += light * trans;
                trans *= (1.0 - stepDens);
                
                if(trans < 0.01) break;
            }
            
            // Adaptive Step
            float nextStep = stepSize;
            if(r > diskRad * 1.2) nextStep = max(stepSize, r * 0.1);
            else if(distToPlane < 2.0 && r < diskRad + 2.0) nextStep = 0.08; // Slow down near disk
            
            p += rd * nextStep;
            
            if(r > 100.0) break;
        }
        
        // Tone mapping
        col = vec3(accum);
        col = pow(col, vec3(0.4545)); // Gamma
        
        // Add stars background if transparent
        if(trans > 0.01) {
             float stars = pow(noise(rd * 150.0), 30.0) * 1.5;
             col += vec3(stars) * trans;
        }

        gl_FragColor = vec4(col, 1.0);
    }
`;

export const StarfieldVertexShader = `
    attribute float a_size;
    attribute float a_opacity;
    attribute float a_twinkle_speed;
    
    varying float vOpacity;
    varying float vTwinkle;
    
    uniform float u_time;

    void main() {
        vOpacity = a_opacity;
        
        // Twinkle effect
        float twinkle = sin(u_time * a_twinkle_speed + position.x);
        vTwinkle = (twinkle + 1.0) * 0.5; // 0 to 1
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = a_size * (300.0 / -mvPosition.z);
    }
`;

export const StarfieldFragmentShader = `
    varying float vOpacity;
    varying float vTwinkle;

    void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        if(length(coord) > 0.5) discard;
        
        float alpha = vOpacity * (0.5 + 0.5 * vTwinkle);
        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    }
`;
