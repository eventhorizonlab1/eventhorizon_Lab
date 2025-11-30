uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_is_light; // 0.0 = Dark Mode, 1.0 = Light Mode
uniform float u_scroll;   // Scroll progress 0.0 to 1.0

varying vec2 vUv;

// --- NOISE FUNCTIONS ---
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

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
    float freq = 1.0;
    for(int i=0; i<5; i++) {
        f += amp * snoise(p * freq);
        p.xy *= 1.6; 
        p.z *= 1.1;
        amp *= 0.5;
        freq *= 1.4;
    }
    return f;
}

void main() {
    vec2 uv = (vUv - 0.5) * 2.0;
    uv.x *= u_resolution.x / u_resolution.y;

    // PARALLAX EFFECT: Move camera Y position based on scroll
    vec3 ro = vec3(0.0, 0.08 + u_scroll * 3.0, -12.0); 
    
    vec3 target = vec3(0.0, -0.5, 0.0);
    vec3 forward = normalize(target - ro);
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
    vec3 up = cross(forward, right);
    
    vec3 rd = normalize(forward * 2.5 + uv.x * right + uv.y * up);

    float mx = u_mouse.x * 0.5;
    float my = u_mouse.y * 0.2;
    mat2 rotX = mat2(cos(mx), sin(mx), -sin(mx), cos(mx));
    ro.xz *= rotX; rd.xz *= rotX;
    
    float rs = 1.0; 
    float isco = 1.5; 
    float diskRad = 9.0; 
    
    vec3 p = ro;
    vec3 col = vec3(0.0);
    float accum = 0.0; 
    float trans = 1.0; 
    
    float stepSize = 0.06; // Slightly increased step size for performance
    
    // Loop count reduced for mobile performance
    for(int i=0; i<90; i++) {
        float r = length(p);
        
        vec3 force = -normalize(p) * (2.5 / (r * r + 0.01)); 
        rd += force * stepSize;
        rd = normalize(rd);
        
        if(r < rs) {
            accum += 0.0; 
            trans = 0.0;  
            break;
        }
        
        float distToPlane = abs(p.y); 
        
        if(distToPlane < 0.5 && r > isco && r < diskRad) {
            float angle = atan(p.z, p.x);
            float rad = length(p.xz);
            
            float density = exp(-(rad - isco) * 0.8);
            
            float rotSpeed = 8.0 / (rad + 0.1);
            float noiseVal = fbm(vec3(rad * 2.0, angle * 3.0 + u_time * rotSpeed * 0.2, p.y * 8.0));
            
            float rings = 0.5 + 0.5 * sin(rad * 10.0 + noiseVal * 2.0);
            density *= rings;
            density *= (noiseVal * 0.5 + 0.5); 
            
            density *= smoothstep(0.4, 0.0, distToPlane);

            vec3 tangent = normalize(vec3(-p.z, 0.0, p.x)); 
            float doppler = dot(rd, tangent); 
            
            float beam = smoothstep(-0.5, 1.0, doppler * 1.5 + 0.2);
            beam = pow(beam, 3.0); 
            
            float stepDens = density * stepSize * 4.0; 
            
            float light = stepDens * beam;
            accum += light * trans; 
            trans *= (1.0 - stepDens); 
            
            if(trans < 0.01) break; 
        }
        
        float nextStep = max(0.05, r * 0.05);
        p += rd * nextStep;
        
        if(r > 20.0) break; 
    }
    
    col = vec3(accum);
    
    col = pow(col, vec3(0.6)); 
    col = smoothstep(0.0, 1.2, col); 

    // --- ORGANIC FILM GRAIN ---
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    
    // High frequency noise (Fine grain)
    float grain = hash(vUv * 800.0 + u_time * 10.0);
    
    // Luminance Masking (Organic) - concentrate in mid-tones
    float grainMask = smoothstep(0.05, 0.4, lum) * (1.0 - smoothstep(0.7, 1.0, lum));
    
    float grainIntensity = 0.06; 
    
    col += (grain - 0.5) * grainIntensity * grainMask;
    
    float vig = 1.0 - smoothstep(0.5, 1.6, length(vUv - 0.5) * 2.0);
    col *= vig;
    
    float gray = dot(col, vec3(0.299, 0.587, 0.114));
    gray = smoothstep(0.02, 0.9, gray);
    
    // --- THEME MIXING ---
    // 1. Dark Mode Color (Black Hole)
    vec3 darkColor = vec3(gray);

    // 2. Light Mode Color (Scientific Paper Style)
    vec3 paperColor = vec3(0.96, 0.96, 0.98); 
    vec3 inkColor = vec3(0.1, 0.12, 0.18); 
    
    float inkMask = smoothstep(0.05, 0.8, gray); 
    
    vec3 lightColor = mix(paperColor, inkColor, inkMask);
    
    float grid = 0.0;
    if (mod(vUv.x * 40.0, 1.0) < 0.05 || mod(vUv.y * 40.0 * (u_resolution.y/u_resolution.x), 1.0) < 0.05) {
        grid = 0.1;
    }
    lightColor -= grid * 0.1;

    // 3. Smooth Mix based on u_is_light uniform (interpolated in JS)
    vec3 finalColor = mix(darkColor, lightColor, u_is_light);

    gl_FragColor = vec4(finalColor, 1.0);
}
