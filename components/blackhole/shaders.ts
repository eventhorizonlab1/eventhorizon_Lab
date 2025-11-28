export const DebrisVertexShader = `
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

export const DebrisFragmentShader = `
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

export const AccretionDiskVertexShader = `
    varying vec2 v_uv;
    varying vec3 v_worldPosition;
    void main() {
        v_uv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        v_worldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
`;

export const AccretionDiskFragmentShader = `
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

        float n1 = snoise(vec2(rot_angle * 12.0, radius * 20.0));
        float n2 = snoise(vec2(rot_angle * 8.0, radius * 6.0 - u_time * 0.2));
        float n3 = snoise(vec2(rot_angle * 24.0, radius * 40.0)); // Fine detail
        
        float streaks = (n1 * 0.4 + 0.6) * (n2 * 0.4 + 0.6) * (n3 * 0.2 + 0.8);
        streaks = pow(streaks, 2.0); // Higher contrast 

        float r_norm = (radius - 0.28) / (1.0 - 0.28);
        
        // Gargantua-inspired Warm Palette
        vec3 col_inner_warm = vec3(1.0, 0.9, 0.7); // Bright white-gold
        vec3 col_mid_warm = vec3(1.0, 0.6, 0.1);   // Deep orange-gold
        vec3 col_outer_warm = vec3(0.4, 0.05, 0.01); // Dark reddish-brown

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
            color = mix(color, vec3(1.0, 1.0, 0.9), doppler * 0.3); // Whiter doppler
            beaming = pow(beaming, 1.5); // Sharper beaming
        } else {
            color *= vec3(0.9, 0.7, 0.6); 
            beaming *= 0.5; 
        }

        vec3 final_color = color * streaks * u_brightness * beaming;
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
                
                // Densité de base (plus dense près du centre)
                float density = exp(-(rad - isco) * 0.5);
                
                // Vitesse de rotation (Keplerienne : plus vite au centre)
                float rotSpeed = 12.0 / (rad + 0.1);
                
                // Texture gazeuse qui tourne
                float gas = fbm(vec3(rad * 3.0, angle * 4.0 + u_time * rotSpeed * 0.3, p.y * 6.0));
                
                // Structure en anneaux
                float rings = 0.5 + 0.5 * sin(rad * 15.0 + gas * 3.0);
                
                density *= rings * gas;
                
                // Affinement vertical (le disque est plat)
                density *= smoothstep(1.0, 0.0, distToPlane / 0.5);
                
                // BEAMING DOPPLER (Effet Relativiste)
                // Le côté qui vient vers nous est plus brillant et bleu
                // Le côté qui s'éloigne est plus sombre et rouge
                vec3 tangent = normalize(vec3(-p.z, 0.0, p.x)); // Vecteur vitesse du gaz
                float doppler = dot(rd, tangent); // Produit scalaire avec la vue
                float beam = pow(smoothstep(-1.0, 1.0, doppler + 0.4), 2.0);
                
                // Calcul de la couleur à ce point
                // Palette "Gargantua" : Orange Brûlé -> Jaune -> Blanc
                vec3 hotColor = vec3(1.0, 0.9, 0.8); // Blanc chaud
                vec3 coldColor = vec3(1.0, 0.3, 0.05); // Orange profond
                
                // Mélange basé sur la température et le Doppler
                vec3 localColor = mix(coldColor, hotColor, density * beam * u_temp);
                
                // Accumulation de la lumière (Alpha Blending additif)
                float stepDens = density * stepSize * 0.8 * u_disk_density;
                accum += stepDens * beam; // Ajout à la luminosité globale
                col += localColor * stepDens * beam; // Ajout à la couleur
                
                // Si c'est trop opaque, on arrête (optimisation)
                if(accum > 1.5) break;
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
        if (length(coord) > 0.5) discard;
        
        float strength = 1.0 - (length(coord) * 2.0);
        strength = pow(strength, 2.0); 
        
        gl_FragColor = vec4(v_color, v_opacity * strength);
    }
`;
