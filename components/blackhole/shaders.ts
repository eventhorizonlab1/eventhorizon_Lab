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

    // --- UTILS ---
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    
    // 3D Noise classique
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
    
    // FBM (Fractal Brownian Motion) modifié pour créer des stries orbitales
    float fbmDisk(vec3 p) {
        float f = 0.0;
        float amp = 0.5;
        // On étire le bruit sur l'axe angulaire pour créer l'effet de vitesse
        vec3 shift = vec3(100.0);
        
        for(int i=0; i<5; i++) {
            // Plus de détails sur les hautes fréquences
            f += amp * noise(p);
            p = p * 2.2 + shift;
            amp *= 0.45; // Décroissance rapide pour garder des détails fins
        }
        return f;
    }

    void main() {
        vec3 ro = u_cameraPos;
        vec3 rd = normalize(vWorldPosition - u_cameraPos);
        
        vec3 col = vec3(0.0);
        
        // --- PHYSIQUE DE GARGANTUA ---
        float rs = 2.5; // Rayon de Schwarzschild
        float isco = 3.0 * rs; // Bord interne du disque (très net)
        float diskRad = 22.0; // Rayon externe (plus diffus)
        float accretionHeight = 0.4; // Disque très fin comme dans le film
        
        vec3 p = ro;
        // Pas adaptatif initial
        float stepSize = 0.2;
        
        float accum = 0.0; 
        float trans = 1.0; 
        
        // Optimisation : boucle réduite mais pas adaptatif plus intelligent
        for(int i=0; i<90; i++) {
            float r = length(p);
            
            // 1. GRAVITÉ (Lentille)
            // Formule simplifiée de courbure de l'espace-temps
            // u_lensing permet d'exagérer l'effet pour le côté cinématique
            float bend = (4.0 * u_lensing) / (r * r + 0.1);
            vec3 gravity = -normalize(p) * bend;
            rd += gravity * stepSize;
            rd = normalize(rd);
            
            // 2. HORIZON DES ÉVÉNEMENTS
            if(r < rs) {
                trans = 0.0;
                break; // Le rayon est absorbé
            }
            
            // 3. DISQUE D'ACCRÉTION VOLUMÉTRIQUE
            float distToPlane = abs(p.y);
            
            // On vérifie si on est dans la zone géométrique du disque
            if(distToPlane < accretionHeight * 4.0 && r > isco && r < diskRad) {
                
                // Coordonnées polaires locales
                float angle = atan(p.z, p.x);
                float rad = length(p.xz);
                
                // Densité de base (falloff exponentiel)
                float density = exp(-(rad - isco) * 0.4);
                
                // Vitesse de rotation Keplerienne (plus rapide au centre)
                float rotSpeed = 8.0 / sqrt(rad);
                
                // Coordonnée de texture "étirée" pour les stries
                // On étire fortement sur l'angle (angle * 10.0) et on compresse sur la hauteur (p.y * 8.0)
                vec3 texCoord = vec3(rad * 1.5, angle * 12.0 + u_time * rotSpeed, p.y * 6.0);
                
                // Bruit fractal
                float noiseVal = fbmDisk(texCoord);
                
                // Modulation de la densité par le bruit
                // On augmente le contraste pour avoir des "vides" entre les anneaux
                noiseVal = smoothstep(0.3, 0.9, noiseVal); 
                density *= noiseVal;
                
                // Affinement vertical (le disque est plus dense au centre du plan Y)
                density *= smoothstep(accretionHeight, 0.0, distToPlane);
                
                // Bord interne net (ISCO)
                density *= smoothstep(isco, isco + 0.5, rad);
                
                // --- EFFET DOPPLER (Beaming) ---
                // Le côté qui vient vers nous est plus brillant et bleu
                // Le côté qui s'éloigne est plus sombre et rouge
                vec3 tangent = normalize(vec3(-p.z, 0.0, p.x)); // Vecteur vitesse
                float doppler = dot(rd, tangent); // Produit scalaire avec le rayon de vue
                
                // Facteur d'intensité Doppler (ajustable)
                float beam = exp(doppler * 1.8); 
                
                // --- COULEUR INTERSTELLAR ---
                // Base: Orange brûlé / Doré
                vec3 baseColor = vec3(1.0, 0.6, 0.2); 
                // Hot spots: Blanc/Jaune
                vec3 hotColor = vec3(1.0, 0.9, 0.8);
                // Cold spots: Rouge profond
                vec3 coldColor = vec3(0.8, 0.1, 0.05);
                
                vec3 diskColor = mix(baseColor, hotColor, noiseVal); // Variation locale
                
                // Application du Doppler sur la couleur
                // Vers le bleu/blanc si ça approche, vers le rouge si ça s'éloigne
                diskColor = mix(diskColor, coldColor, clamp(-doppler, 0.0, 1.0) * 0.8);
                diskColor = mix(diskColor, vec3(0.9, 0.9, 1.0), clamp(doppler - 0.5, 0.0, 1.0) * 0.5);
                
                // Température globale (slider)
                diskColor *= u_temp;

                // Accumulation de la lumière (Rendu volumétrique)
                float stepDens = density * stepSize * u_disk_density;
                float light = stepDens * beam * u_bloom;
                
                // Composition Alpha (Front-to-back)
                accum += light * trans;
                trans *= (1.0 - stepDens);
                
                // Si c'est totalement opaque, on arrête
                if(trans < 0.02) break;
            }
            
            // Pas de marche adaptatif
            // On avance vite loin du trou, et doucement près du disque
            float nextStep = stepSize;
            if(r < diskRad + 5.0 && abs(p.y) < 3.0) {
                nextStep = 0.08; // Précision près du disque
            } else {
                nextStep = max(stepSize, r * 0.08); // Vitesse au loin
            }
            
            p += rd * nextStep;
            
            if(r > 80.0) break; // Trop loin
        }
        
        // Tone Mapping (ACES approximation pour un look cinématique)
        vec3 color = vec3(accum);
        color = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);
        
        // Correction Gamma
        color = pow(color, vec3(1.0 / 2.2));
        
        // Fond étoilé subtil si transparence
        if(trans > 0.01) {
             // Simple bruit pour les étoiles lointaines déformées
             float stars = pow(hash(dot(rd, vec3(12.9898, 78.233, 45.543))), 300.0) * 0.8;
             color += vec3(stars) * trans;
        }

        gl_FragColor = vec4(color, 1.0);
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
        float twinkle = sin(u_time * a_twinkle_speed + position.x * 10.0);
        vTwinkle = (twinkle + 1.0) * 0.5;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = a_size * (400.0 / -mvPosition.z);
    }
`;

export const StarfieldFragmentShader = `
    varying float vOpacity;
    varying float vTwinkle;

    void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if(dist > 0.5) discard;
        
        // Soft particle edge
        float alpha = (1.0 - smoothstep(0.3, 0.5, dist)) * vOpacity;
        alpha *= (0.7 + 0.3 * vTwinkle);
        
        gl_FragColor = vec4(0.9, 0.95, 1.0, alpha);
    }
`;
