// components/blackhole/shaders.ts

export const BlackHoleVertexShader = `
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
        vUv = uv;
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
    
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
        // STEP 1: VERIFY VISIBILITY
        // Output a solid red color with 50% opacity
        // If you see this, the geometry and shader pipeline are working.
        
        gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);
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
