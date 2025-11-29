// --- SHADERS GLSL (MONOCHROME & FLUIDE) ---

export const BlackHoleVertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

export const BlackHoleFragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_warp; // Facteur d'interaction (clic)
    
    varying vec2 vUv;

    // --- OUTILS MATHÉMATIQUES ---
    mat2 rot(float a) {
        float s = sin(a), c = cos(a);
        return mat2(c, -s, s, c);
    }

    // Hash sans sinus pour éviter les artefacts sur certains GPU
    float hash(vec2 p) {
        vec3 p3  = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }

    // Noise 3D optimisé
    float noise(vec3 p) {
        const vec3 step = vec3(110, 241, 171);
        vec3 i = floor(p);
        vec3 f = fract(p);
        float n = dot(i, step);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(i.xy + vec2(0,0) + vec2(0, i.z)), hash(i.xy + vec2(1,0) + vec2(0, i.z)), u.x),
                   mix(hash(i.xy + vec2(0,1) + vec2(0, i.z)), hash(i.xy + vec2(1,1) + vec2(0, i.z)), u.x), u.y),
                   mix(mix(hash(i.xy + vec2(0,0) + vec2(0, i.z + 1.0)), hash(i.xy + vec2(1,0) + vec2(0, i.z + 1.0)), u.x),
                   mix(hash(i.xy + vec2(0,1) + vec2(0, i.z + 1.0)), hash(i.xy + vec2(1,1) + vec2(0, i.z + 1.0)), u.x), u.y), u.z);
    }

    // --- DOMAIN WARPING (L'effet "Liquide/Plasma") ---
    float fbm(vec3 p) {
        float f = 0.0;
        float amp = 0.5;
        // Première couche
        vec3 q = p;
        q.xy *= rot(u_time * 0.1); // Rotation lente globale
        
        // Distorsion du domaine
        vec3 offset = vec3(
            noise(p * 2.0 + vec3(u_time * 0.2)),
            noise(p * 2.0 + vec3(u_time * 0.3 + 4.0)),
            0.0
        );
        
        // Application du bruit sur le domaine distordu
        f = noise(p + offset * 1.5);
        
        // On ajoute du détail
        f += noise(p * 4.0) * 0.25;
        
        return f;
    }

    void main() {
        // 1. Setup UV
        vec2 uv = (vUv - 0.5) * 2.0;
        uv.x *= u_resolution.x / u_resolution.y;

        // 2. Caméra Dynamique (Effet Warp)
        float camDist = 8.0 + u_warp * 4.0; 
        float fov = 1.5 + u_warp * 1.0;
        
        vec3 ro = vec3(0.0, 1.5 - u_warp, -camDist); 
        vec3 target = vec3(0.0, 0.0, 0.0);
        
        vec3 forward = normalize(target - ro);
        vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
        vec3 up = cross(forward, right);
        
        vec3 rd = normalize(forward * fov + uv.x * right + uv.y * up);

        // Rotation Souris
        float mx = u_mouse.x * 0.8;
        float my = u_mouse.y * 0.4;
        mat2 rotCam = rot(mx);
        ro.xz *= rotCam;
        rd.xz *= rotCam;
        
        // 3. Physique
        float rs = 1.0; // Horizon
        float isco = 1.5 + sin(u_time * 0.5) * 0.1; // ISCO "respirant"
        
        vec3 p = ro;
        vec3 col = vec3(0.0);
        float alpha = 1.0;
        
        float stepSize = 0.08;
        
        // --- RAY MARCHING LOOP ---
        for(int i=0; i<90; i++) {
            float r = length(p);
            
            // A. Lensing Gravitationnel
            vec3 gravity = -normalize(p) * (1.8 / (r*r + 0.1));
            rd += gravity * stepSize * (1.0 + u_warp); 
            rd = normalize(rd);
            
            // B. Horizon (Le Vide)
            if(r < rs) {
                break;
            }
            
            // C. Disque de Plasma (Volumétrique)
            float diskHeight = 0.1 + r * 0.05;
            float distToPlane = abs(p.y);
            
            if(distToPlane < diskHeight && r > isco && r < 8.0) {
                // Coordonnées polaires
                float angle = atan(p.z, p.x);
                
                // Vitesse de rotation différentielle
                float speed = 4.0 / sqrt(r);
                float flowAngle = angle + u_time * speed * 0.5;
                
                // Échantillonnage de densité (Liquide)
                float plasma = fbm(vec3(r * 1.5, flowAngle, p.y * 4.0));
                
                // Masquage bords
                float fade = smoothstep(isco, isco + 0.5, r) * (1.0 - smoothstep(6.0, 8.0, r));
                float density = plasma * fade * exp(-distToPlane * 4.0);
                
                // --- COLORIMÉTRIE DOPPLER MONOCHROME ---
                vec3 tangent = normalize(vec3(-p.z, 0.0, p.x)); // Sens de rotation
                float doppler = dot(rd, tangent); 
                
                // Mapping du Doppler vers l'intensité (Noir et Blanc)
                // s'approche = + brillant
                // s'éloigne = + sombre
                float energy = density * (1.0 + doppler * 0.8); 
                
                // Ajout de l'effet warp à l'énergie globale
                energy *= (1.0 + u_warp * 2.0);
                
                // Conversion énergie -> Intensité lumineuse blanche (Monochrome)
                // Multiplicateur 1.5 pour un contraste fort en N&B
                vec3 intensityColor = vec3(energy * 1.5); 
                
                // Accumulation
                float stepDens = density * stepSize * 2.5;
                col += intensityColor * stepDens * alpha;
                alpha *= (1.0 - stepDens);
                
                if(alpha < 0.01) break;
            }
            
            // Pas variable
            p += rd * max(0.05, r * 0.08);
            if(r > 15.0) break;
        }
        
        // 4. Post-Processing
        
        // Glow externe (Atmosphère éthérée monochrome)
        float centerGlow = 1.0 / (length(uv) + 0.1);
        // Glow blanc bleuté très pâle pour garder une teinte froide
        col += vec3(0.3, 0.35, 0.4) * centerGlow * 0.05 * (1.0 + u_warp);

        // Tone Mapping & Gamma
        col = pow(col, vec3(0.8)); // Gamma
        col = col / (col + vec3(1.0)); // Reinhard simple
        col = smoothstep(0.0, 1.1, col); // Contraste

        // Grain numérique (Digital Noise)
        float noiseHigh = hash(uv * 100.0 + u_time);
        col += (noiseHigh - 0.5) * 0.05;
        
        // Force le noir et blanc final par sécurité (bien que le calcul soit déjà monochrome)
        float luminance = dot(col, vec3(0.299, 0.587, 0.114));
        gl_FragColor = vec4(vec3(luminance), 1.0);
    }
`;

// Unused but kept for type compatibility if needed
export const StarfieldVertexShader = `void main(){}`;
export const StarfieldFragmentShader = `void main(){}`;
