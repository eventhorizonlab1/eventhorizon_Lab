// components/blackhole/shaders.ts

// Vertex Shader générique pour une boîte englobante (Bounding Box)
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

// Le cœur du moteur graphique : Raymarching Volumétrique Relativiste
export const BlackHoleFragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec3 u_cameraPos;
    uniform float u_bloom;
    uniform float u_lensing;
    uniform float u_disk_density;
    uniform float u_temp;
    
    varying vec3 vWorldPosition;

    // --- BRUIT ET MATHS ---
    // Fonction de bruit pseudo-aléatoire rapide
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    
    // Bruit 3D pour la texture du disque
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

    // Fractal Brownian Motion pour les détails gazeux
    float fbm(vec3 p) {
        float f = 0.0;
        float w = 0.5;
        for (int i = 0; i < 4; i++) { // 4 octaves pour la performance/qualité
            f += w * noise(p);
            p *= 2.0;
            w *= 0.5;
        }
        return f;
    }

    // --- PHYSIQUE DU TROU NOIR ---
    
    void main() {
        // Configuration du Raymarching
        vec3 ro = u_cameraPos; // Origine du rayon (Caméra)
        vec3 rd = normalize(vWorldPosition - u_cameraPos); // Direction du rayon
        
        vec3 p = ro;
        vec3 col = vec3(0.0);
        float accum = 0.0; // Accumulation de lumière (volumétrie)
        
        // Paramètres physiques
        float rs = 2.5; // Rayon de Schwarzschild (Horizon des événements)
        float isco = rs * 1.5; // Orbite stable la plus proche (bord intérieur du disque)
        float diskRad = 18.0; // Rayon externe du disque
        
        // Optimisation : Pas de calcul si on regarde loin du centre
        // (Simple bounding sphere check pourrait être ajouté ici)

        float stepSize = 0.15; // Pas de base pour l'avancée du rayon
        float gravity = 0.08 * u_lensing; // Force de la courbure

        // BOUCLE DE RENDU (RAYMARCHING)
        // On limite à 120 itérations pour garder 60fps
        for(int i = 0; i < 120; i++) {
            float r = length(p); // Distance au centre du trou noir
            
            // 1. Gravité (Lentille Gravitationnelle)
            // On courbe le rayon vers le centre (0,0,0)
            // Plus on est près, plus ça courbe (1/r^2 approximé)
            vec3 force = -normalize(p) * (gravity / (r * r + 0.1));
            rd += force * stepSize; 
            rd = normalize(rd); // Renormaliser la direction après courbure
            
            // 2. Horizon des événements (L'Ombre)
            if(r < rs) {
                // Le rayon est tombé dans le trou noir
                accum += 0.0; 
                break; // Stop le calcul
            }
            
            // 3. Disque d'Accrétion (Volumétrie)
            float distToPlane = abs(p.y); // Distance au plan équatorial
            
            // Si le rayon traverse la zone du disque
            if(distToPlane < 1.5 && r > isco && r < diskRad) {
                // Coordonnées polaires pour la texture
                float angle = atan(p.z, p.x);
                float rad = length(p.xz);
                
                // Densité de base : Courbe très piquée pour le "Photon Ring" (bord net)
                float density = exp(-(rad - isco) * 2.0) * 4.0; // Bord intérieur très net
                density += exp(-(rad - isco) * 0.2) * 0.5; // Queue diffuse vers l'extérieur
                
                // Vitesse de rotation
                float rotSpeed = 14.0 / (rad + 0.1);
                
                // Texture gazeuse : Bruit plus fin pour les stries
                float gas = fbm(vec3(rad * 8.0, angle * 6.0 + u_time * rotSpeed * 0.2, p.y * 12.0));
                gas = pow(gas, 1.5); // Contraste du gaz
                
                // Structure en anneaux fins
                float rings = 0.5 + 0.5 * sin(rad * 30.0 + gas * 5.0);
                rings = pow(rings, 2.0); // Anneaux plus marqués
                
                density *= rings * gas;
                
                // Affinement vertical très strict (disque fin)
                density *= smoothstep(0.8, 0.0, distToPlane / 0.2);
                
                // BEAMING DOPPLER
                vec3 tangent = normalize(vec3(-p.z, 0.0, p.x));
                float doppler = dot(rd, tangent);
                float beam = smoothstep(-1.0, 1.0, doppler + 0.2);
                beam = pow(beam, 1.5); // Beaming plus progressif
                beam = 0.1 + 0.9 * beam; // Contraste fort mais pas noir total
                
                // PALETTE DE COULEURS "INTERSTELLAR"
                // Centre : Blanc pur / Bleu très pâle (chaleur extrême)
                // Milieu : Jaune doré
                // Bord : Rouge profond / Orange brûlé
                
                vec3 colCenter = vec3(1.0, 0.95, 0.9); // Blanc chaud
                vec3 colMid = vec3(1.0, 0.6, 0.1);     // Orange doré
                vec3 colEdge = vec3(0.6, 0.1, 0.01);   // Rouge sombre
                
                // Gradient basé sur la distance et la densité
                float t = smoothstep(isco, diskRad * 0.6, rad);
                vec3 localColor = mix(colCenter, colMid, t);
                localColor = mix(localColor, colEdge, smoothstep(0.4, 1.0, t));
                
                // Boost de luminosité au centre (Photon Ring)
                localColor += vec3(0.5) * exp(-(rad - isco) * 4.0);
                
                // Mélange final
                vec3 finalColor = localColor * u_temp;
                
                // Accumulation
                float stepDens = density * stepSize * 2.0 * u_disk_density;
                accum += stepDens;
                col += finalColor * stepDens * beam;
                
                if(accum > 1.0) break;
            }
            
            // Pas adaptatif : on avance plus vite loin du trou noir pour optimiser
            float nextStep = max(stepSize, r * 0.1);
            p += rd * nextStep;
            
            // Si on est trop loin, on arrête (sortie de la boite)
            if(r > 50.0) break;
        }
        
        // Tone mapping et Gamma
        col = pow(col, vec3(1.2)); // Contraste
        col *= u_bloom; // Intensité globale
        
        // Ajouter un fond étoilé subtil si le rayon n'a rien touché (optionnel, géré par Starfield externe habituellement)
        // Mais ici on veut du noir profond pour le contraste
        
        gl_FragColor = vec4(col, min(accum, 1.0));
    }
`;

// On garde les shaders d'étoiles originaux car ils fonctionnent bien pour l'arrière-plan
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
        v_color = vec3(1.0, 1.0, 1.0); // Étoiles blanches pures
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
