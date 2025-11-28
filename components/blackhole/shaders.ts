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

        float n1 = snoise(vec2(rot_angle * 8.0, radius * 12.0));
        float n2 = snoise(vec2(rot_angle * 4.0, radius * 3.0 - u_time * 0.1));
        
        float streaks = (n1 * 0.4 + 0.6) * (n2 * 0.4 + 0.6);
        streaks = pow(streaks, 1.5); 

        float r_norm = (radius - 0.28) / (1.0 - 0.28);
        
        vec3 col_inner_warm = vec3(1.0, 0.95, 0.85); 
        vec3 col_mid_warm = vec3(1.0, 0.5, 0.1);    
        vec3 col_outer_warm = vec3(0.2, 0.02, 0.01);

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
            color = mix(color, vec3(1.0, 1.0, 1.0), doppler * 0.15);
            beaming = pow(beaming, 1.1);
        } else {
            color *= vec3(0.9, 0.7, 0.6); 
            beaming *= 0.5; 
        }

        vec3 final_color = color * streaks * u_brightness * beaming;
        final_color *= (1.0 + u_mode * 0.1);

        float inner_glow = exp(-(radius - 0.28) * 30.0);
        final_color += col_inner * inner_glow * 1.5;

        gl_FragColor = vec4(final_color, alpha);
    }
`;

export const LensingVertexShader = `
    varying vec2 v_uv;
    void main() {
        v_uv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
`;

export const LensingFragmentShader = `
    uniform sampler2D t_background;
    uniform vec2 u_resolution;
    uniform float u_lensing_strength;
    uniform float u_mode; // 0.0 = Warm, 1.0 = Cool
    varying vec2 v_uv;

    const float SCHWARZSCHILD_RADIUS = 0.125; 
    const float LENSING_RADIUS = 0.7; 

    void main() {
        vec2 uv = v_uv;
        vec2 uv_center = uv - 0.5;
        uv_center.x *= u_resolution.x / u_resolution.y;
        float dist = length(uv_center);
        
        if (dist < SCHWARZSCHILD_RADIUS) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }
        
        float rs = SCHWARZSCHILD_RADIUS;
        float normalized_dist = dist / rs;
        float d_strength = 0.025 * u_lensing_strength;
        float offset = d_strength / (pow(normalized_dist - 0.9, 2.0) + 0.02);
        offset *= smoothstep(LENSING_RADIUS, rs, dist);
        
        vec2 direction = normalize(uv_center);
        vec2 sampling_offset = direction * offset;
        sampling_offset.x /= (u_resolution.x / u_resolution.y); 
        
        float ca = 0.008 * offset * 40.0; 
        
        vec2 uv_r = uv - sampling_offset * (1.0 + ca);
        vec2 uv_g = uv - sampling_offset;
        vec2 uv_b = uv - sampling_offset * (1.0 - ca);
        
        float r = texture2D(t_background, uv_r).r;
        float g = texture2D(t_background, uv_g).g;
        float b = texture2D(t_background, uv_b).b;
        
        vec3 color = vec3(r, g, b);
        float edge_dist = dist - SCHWARZSCHILD_RADIUS;
        float ring_width = 0.002;
        float photon_ring = smoothstep(ring_width, 0.0, edge_dist);
        photon_ring += exp(-edge_dist * 150.0) * 0.4;
        
        vec3 ring_warm = vec3(1.0, 0.95, 0.85); 
        vec3 ring_cool = vec3(0.8, 0.95, 1.0);  
        vec3 ring_col = mix(ring_warm, ring_cool, u_mode);

        color += ring_col * photon_ring * (1.5 + u_lensing_strength * 0.5);
        gl_FragColor = vec4(color, 1.0);
    }
`;

export const StarfieldVertexShader = `
    uniform float u_time;
    attribute float a_size;
    attribute float a_opacity;
    attribute float a_twinkle_speed;
    attribute float a_twinkle_offset;
    attribute vec3 a_color;
    varying float v_opacity;
    varying vec3 v_color;

    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        float t = u_time * a_twinkle_speed;
        float wave1 = sin(t + a_twinkle_offset);
        float wave2 = sin(t * 0.64 + a_twinkle_offset * 2.3); 
        
        float combinedTwinkle = (wave1 + wave2) / 2.0;
        float pulse = smoothstep(-1.0, 1.0, combinedTwinkle);
        pulse = pow(pulse, 1.5);

        v_opacity = a_opacity * (0.6 + 0.4 * pulse); 
        v_color = a_color;
        
        float sizeMod = 0.8 + 0.4 * pulse;
        gl_PointSize = a_size * sizeMod * (500.0 / -mvPosition.z);
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
