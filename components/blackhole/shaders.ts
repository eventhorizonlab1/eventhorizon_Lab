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
    varying vec2 vUv;

    // --- NOISE FUNCTIONS (Simplex 3D) ---
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; 
        vec3 x3 = x0 - 1.0 + 3.0*C.xxx; 

        i = mod289(i);
        vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        float n_ = 0.142857142857; 
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ ); 

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    float fbm(vec3 p) {
        float f = 0.0;
        float amp = 0.5;
        float freq = 2.0; 
        for (int i = 0; i < 4; i++) { 
            f += amp * snoise(p * freq);
            p.xy *= 1.6; 
            p.z *= 1.1;
            amp *= 0.5;
            freq *= 1.4;
        }
        return f;
    }

    void main() {
        vec3 ro = u_cameraPos;
        vec3 rd = normalize(vWorldPosition - u_cameraPos);
        
        float rs = 2.0; 
        float isco = 3.0 * rs; 
        float diskRad = 18.0; 
        
        vec3 p = ro;
        vec3 col = vec3(0.0);
        float accum = 0.0; 
        float trans = 1.0; 
        
        float stepSize = 0.15; 
        
        // CORRECTION MAJEURE : Limite de la boucle et distance de coupure
        // 150 itérations pour une meilleure qualité
        for(int i=0; i<150; i++) {
            float r = length(p);
            
            // Lentille Gravitationnelle
            vec3 gravity = -normalize(p) * (4.0 * u_lensing / (r * r + 0.1)); 
            rd += gravity * stepSize;
            rd = normalize(rd);
            
            // Horizon des événements
            if(r < rs) {
                accum += 0.0;
                trans = 0.0;
                break;
            }
            
            // Disque d'accrétion
            float distToPlane = abs(p.y); 
            
            if(distToPlane < 1.0 && r > isco && r < diskRad) {
                float angle = atan(p.z, p.x);
                float rad = length(p.xz);
                
                float density = exp(-(rad - isco) * 0.5);
                float rotSpeed = 10.0 / (rad + 0.1);
                
                float noiseVal = fbm(vec3(rad * 1.5, angle * 2.0 + u_time * rotSpeed * 0.1, p.y * 4.0));
                
                float rings = 0.5 + 0.5 * sin(rad * 8.0 + noiseVal * 3.0);
                density *= rings;
                density *= (noiseVal * 0.5 + 0.5); 
                density *= smoothstep(0.8, 0.0, distToPlane);

                // Relativistic Beaming
                vec3 tangent = normalize(vec3(-p.z, 0.0, p.x)); 
                float doppler = dot(rd, tangent); 
                float beam = smoothstep(-0.5, 1.0, doppler * 2.0 + 0.3);
                beam = pow(beam, 2.0); 
                
                // Température et Couleur
                vec3 diskColor = vec3(1.0, 0.6, 0.3); 
                float tempFactor = u_temp * (1.0 + doppler * 0.5);
                if (tempFactor > 1.2) diskColor = vec3(0.6, 0.8, 1.0);
                else if (tempFactor < 0.8) diskColor = vec3(1.0, 0.2, 0.1); 
                
                float stepDens = density * stepSize * u_disk_density; 
                float light = stepDens * beam * u_bloom;
                
                col += diskColor * light * trans; 
                trans *= (1.0 - stepDens); 
                
                if(trans < 0.01) break; 
            }
            
            float nextStep = max(stepSize, r * 0.05);
            p += rd * nextStep;
            
            // CORRECTION : Augmentation de la limite de rendu de 60.0 à 300.0
            // Cela empêche le trou noir de disparaître si la caméra recule
            if(r > 300.0) break; 
        }
        
        col = pow(col, vec3(0.4545)); // Gamma Correction
        
        gl_FragColor = vec4(col, 1.0 - trans);
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
