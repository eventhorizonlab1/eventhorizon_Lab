uniform float u_time;
uniform vec2 u_resolution;

// PARAMÈTRES ORBITAUX
uniform vec2 u_orbit; // x: Azimut, y: Élévation
uniform float u_dist; // Distance au centre
uniform float u_focus; // Dilatation temporelle

varying vec2 vUv;

#define PI 3.14159265359

// --- MATHS & NOISE ---
float hash(vec2 p) {
    vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

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

float fbm(vec3 p) {
    float f = 0.0;
    float amp = 0.5;
    vec3 shift = vec3(100.0);
    for(int i=0; i<4; i++) {
        f += amp * noise(p);
        p = p * 2.0 + shift;
        amp *= 0.5;
    }
    return f;
}

vec3 getStars(vec3 rd) {
    vec3 col = vec3(0.0);
    vec2 uv = vec2(atan(rd.z, rd.x), asin(rd.y));
    uv *= 150.0; 
    
    vec2 id = floor(uv);
    vec2 grid = fract(uv) - 0.5;
    float rnd = hash(id);
    
    if(rnd > 0.98) {
        float brightness = (rnd - 0.98) * 50.0;
        float twinkleSpeed = 5.0 * (1.0 - u_focus * 0.9);
        brightness *= (0.8 + 0.4 * sin(u_time * twinkleSpeed + rnd * 100.0));
        float dist = length(grid);
        float star = max(0.0, 1.0 - dist * 4.0); 
        star = pow(star, 8.0); 
        col += vec3(1.0) * star * brightness;
    }
    return col;
}

// Fonction Caméra LookAt
mat3 setCamera(in vec3 ro, in vec3 ta, float cr) {
    vec3 cw = normalize(ta - ro);
    vec3 cp = vec3(sin(cr), cos(cr), 0.0); // Up vector temporaire
    vec3 cu = normalize(cross(cw, cp));
    vec3 cv = normalize(cross(cu, cw));
    return mat3(cu, cv, cw);
}

void main() {
    vec2 uv = (vUv - 0.5) * 2.0;
    uv.x *= u_resolution.x / u_resolution.y;

    // --- ORBITAL CAMERA LOGIC ---
    float az = u_orbit.x;
    float el = u_orbit.y;
    float d = u_dist;

    // Conversion Sphérique -> Cartésien (Y-Up)
    vec3 ro = vec3(
        d * cos(el) * sin(az),
        d * sin(el),
        d * cos(el) * cos(az)
    );

    vec3 ta = vec3(0.0); // Cible : Centre du Trou Noir
    
    // Construction de la matrice caméra
    mat3 camMat = setCamera(ro, ta, 0.0);
    
    // Ray Direction
    // FOV = 1.5 (Standard ~50-60mm)
    vec3 rd = camMat * normalize(vec3(uv, 1.5));

    // --- PHYSIQUE TROU NOIR ---
    float rs = 1.0; 
    float isco = 2.0; 
    float diskRad = 12.0; 
    
    vec3 p = ro;
    vec3 col = vec3(0.0);
    float alpha = 1.0; 
    
    float stepSize = 0.1;
    float maxDist = 80.0;
    
    for(int i=0; i<100; i++) {
        float r = length(p);
        
        // Lensing
        // Focus augmente la gravité perçue (Zoom temporel)
        float lensPower = 4.0 + u_focus * 2.0; 
        vec3 gravity = -normalize(p) * (lensPower / (r*r + 0.1));
        rd += gravity * stepSize * 0.08;
        rd = normalize(rd);
        
        if(r < rs) {
            alpha = 0.0;
            break;
        }
        
        float distToPlane = abs(p.y);
        float diskHeight = 0.05 + r * 0.04; 
        
        if(distToPlane < diskHeight && r > isco && r < diskRad) {
            float angle = atan(p.z, p.x);
            float rad = length(p.xz);
            float speed = 8.0 / sqrt(rad);
            
            float timeScale = 1.0 - u_focus * 0.8; 
            float rotAngle = angle + u_time * speed * 0.2 * timeScale; 
            
            float rings = 0.5 + 0.5 * sin(rad * 15.0);
            float dust = fbm(vec3(rad * 4.0, rotAngle, p.y * 10.0));
            
            float density = (rings * 0.6 + dust * 0.4);
            density *= smoothstep(isco, isco+1.0, rad) * smoothstep(diskRad, diskRad-4.0, rad);
            density *= smoothstep(diskHeight, 0.0, distToPlane);
            
            // Doppler Beaming
            // Calcul tangentiel correct quelque soit l'angle de vue
            vec3 tangent = normalize(cross(vec3(0.0, 1.0, 0.0), p)); 
            float doppler = dot(rd, tangent);
            
            float beam = 1.0 + doppler * 0.7;
            beam = pow(beam, 2.0);
            
            float intensity = density * beam * 2.0;
            intensity *= (1.0 + u_focus * 0.5); 
            
            float stepDens = density * stepSize * 0.8;
            col += vec3(1.0) * intensity * stepDens * alpha;
            alpha *= (1.0 - stepDens);
            
            if(alpha < 0.01) break;
        }
        
        float nextStep = max(0.05, r * 0.08);
        p += rd * nextStep;
        
        if(length(p - ro) > maxDist) break;
    }
    
    if(alpha > 0.01) {
        col += getStars(rd) * alpha;
    }

    // --- POST PROCESS ---
    
    float centerGlow = 1.0 / (length(uv) + 0.2);
    col += vec3(0.2) * centerGlow * 0.05;

    col = vec3(1.0) - exp(-col * 1.5); 
    col = pow(col, vec3(0.9)); 
    float gray = dot(col, vec3(0.299, 0.587, 0.114));
    col = vec3(gray);

    float vignetteStrength = 1.8 + u_focus * 1.5;
    col *= 1.0 - smoothstep(0.5, vignetteStrength, length(vUv - 0.5) * 2.0);
    
    if (u_focus > 0.01) {
            float blurAmount = smoothstep(0.2, 0.8, length(vUv - 0.5)) * u_focus * 0.5;
            col *= (1.0 - blurAmount);
    }

    gl_FragColor = vec4(col, 1.0);
}
