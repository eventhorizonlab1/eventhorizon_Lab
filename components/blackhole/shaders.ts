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
        
        vec3 p = ro;
        vec3 col = vec3(0.0);
        float accum = 0.0;
        
        // Paramètres "Interstellar"
        float rs = 3.0; // Rayon de l'horizon (plus gros pour être imposant)
        float isco = rs * 1.5; // Innermost Stable Circular Orbit
        float diskRad = 22.0; // Disque plus large
        
        // Step adaptatif pour optimiser les FPS tout en gardant la qualité au centre
        float stepSize = 0.2; 
        
        // Gravité renforcée pour bien voir le disque "derrière" le trou noir
        float gravityStrength = 0.12 * u_lensing; 

        for(int i = 0; i < 300; i++) {
            float r = length(p);
            
            // --- 1. LENTILLE GRAVITATIONNELLE (Newtonien approximé) ---
            // Courbure plus forte près du centre (1.0 / (r*r))
            vec3 force = -normalize(p) * (gravityStrength / (r * r * 0.05 + 0.01));
            rd += force * stepSize;
            rd = normalize(rd);
            
            // --- 2. HORIZON DES ÉVÉNEMENTS ---
            if(r < rs) {
                accum += 0.0; // Noir total
                break;
            }
            
            // --- 3. DISQUE D'ACCRÉTION ---
            float distToPlane = abs(p.y);
            
            // On élargit un peu la zone de détection pour attraper les rayons courbés
            if(distToPlane < 2.0 && r > isco && r < diskRad) {
                
                // Coordonnées polaires
                float angle = atan(p.z, p.x);
                float rad = length(p.xz);
                
                // Densité de base : Pic très intense près de l'ISCO (le Photon Ring)
                // exp(-(rad - isco)) crée un dégradé doux vers l'extérieur
                float baseDensity = exp(-(rad - isco) * 0.8) * 2.0;
                
                // Rotation différentielle (le centre tourne plus vite)
                float rotSpeed = 15.0 / (rad + 0.1);
                
                // Texture : On étire fortement les coordonnées pour faire des lignes
                // vec3(rad * 4.0, ...) -> crée des anneaux
                // angle * 8.0 -> crée des variations angulaires
                vec3 noiseCoord = vec3(rad * 4.0, angle * 8.0 + u_time * rotSpeed * 0.2, p.y * 10.0);
                float gas = fbm(noiseCoord);
                
                // Contraste du gaz (plus tranché)
                gas = smoothstep(0.3, 0.8, gas);
                
                // Variation en anneaux distincts (comme Saturne)
                float rings = 0.5 + 0.5 * sin(rad * 20.0 + gas * 2.0);
                
                float finalDensity = baseDensity * gas * rings;
                
                // Affinement vertical (le disque est fin au centre, plus diffus en haut/bas)
                finalDensity *= smoothstep(1.0, 0.0, distToPlane / 0.8);
                
                // --- 4. EFFET DOPPLER (Relativiste) ---
                // Le côté qui vient vers nous est plus brillant et bleu
                // Le côté qui s'éloigne est plus sombre et rouge
                vec3 tangent = normalize(vec3(-p.z, 0.0, p.x));
                float doppler = dot(rd, tangent); // Produit scalaire rayon vs rotation
                
                // Facteur de beaming très prononcé
                float beam = smoothstep(-0.8, 1.0, doppler + 0.1);
                beam = pow(beam, 2.5); // Courbe exponentielle pour assombrir fortement un côté
                
                // --- 5. COULEURS (Palette Gargantua) ---
                // Cœur : Blanc/Chaud
                // Milieu : Orange brûlé
                // Bord : Rouge sombre
                vec3 colInner = vec3(1.0, 0.9, 0.8);  // Blanc chaud
                vec3 colOuter = vec3(1.0, 0.5, 0.1);  // Orange
                vec3 colDeep  = vec3(0.4, 0.05, 0.0); // Rouge sombre
                
                vec3 dustColor = mix(colOuter, colInner, finalDensity * 0.5);
                dustColor = mix(dustColor, colDeep, smoothstep(isco, diskRad, rad));
                
                // Température globale (paramètre UI)
                dustColor *= u_temp;
                
                // Accumulation volumétrique
                float stepDens = finalDensity * stepSize * 0.8 * u_disk_density;
                
                // Appliquer le beaming et l'accumulation
                col += dustColor * stepDens * beam * (1.0 - accum);
                accum += stepDens;
                
                if(accum > 0.98) break; // Optimisation : arrêter si opaque
            }
            
            // Avancer le rayon
            // On avance plus vite quand on est loin pour gagner des FPS
            float nextStep = max(stepSize, r * 0.08);
            p += rd * nextStep;
            
            if(r > 60.0) break;
        }
        
        // Tone mapping filmique simple
        col = col / (col + vec3(1.0)); // Reinhard
        col = pow(col, vec3(1.0 / 2.2)); // Gamma correction
        
        // Intensité globale (Bloom multiplier)
        col *= u_bloom * 3.0;

        gl_FragColor = vec4(col, clamp(accum, 0.0, 1.0));
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
