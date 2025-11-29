export const BlackHoleVertexShader = `
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        
        vec4 mvPosition = viewMatrix * worldPosition;
        vViewPosition = -mvPosition.xyz; // Camera space position
        
        gl_Position = projectionMatrix * mvPosition;
    }
`;

export const BlackHoleFragmentShader = `
    precision highp float;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec3 u_cameraPos;
    
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    // Basic Raymarching SDF for a Sphere
    float sdSphere(vec3 p, float s) {
        return length(p) - s;
    }

    void main() {
        // 1. Ray Setup
        vec3 ro = u_cameraPos; // Ray Origin
        vec3 rd = normalize(vWorldPosition - u_cameraPos); // Ray Direction
        
        vec3 col = vec3(0.0); // Background color (Transparent/Black)
        float alpha = 0.0;
        
        float t = 0.0; // Distance traveled
        float tmax = 200.0; // Max distance
        
        // 2. Raymarching Loop
        for(int i=0; i<64; i++) {
            vec3 p = ro + rd * t;
            
            // Test object: Sphere at (0,0,0) radius 15
            float d = sdSphere(p, 15.0);
            
            if(d < 0.1) {
                // Hit!
                col = vec3(1.0); // White
                alpha = 1.0;
                break;
            }
            
            t += d;
            if(t > tmax) break;
        }
        
        // Prevent optimization
        col += vUv.x * 0.0001;
        
        gl_FragColor = vec4(col, alpha);
    }
`;

export const StarfieldVertexShader = `
    attribute float a_size;
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = a_size * (300.0 / -mvPosition.z);
    }
`;

export const StarfieldFragmentShader = `
    void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        if(length(coord) > 0.5) discard;
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;
