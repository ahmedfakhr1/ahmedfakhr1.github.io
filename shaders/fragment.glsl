uniform vec3 color;
uniform float time;
uniform float opacity;
uniform bool isDarkTheme;

varying vec2 vUv;
varying float vNoise;

void main() {
    // Create a dynamic color based on the noise
    vec3 finalColor = isDarkTheme ? vec3(0.1, 0.1, 0.15) : vec3(0.95, 0.95, 1.0);
    
    // Add subtle color variation based on noise
    float noiseColor = smoothstep(-10.0, 10.0, vNoise);
    finalColor = mix(finalColor, color, noiseColor * 0.2);
    
    // Add wave pattern
    float wave = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time) * 0.1;
    finalColor += wave;
    
    gl_FragColor = vec4(finalColor, opacity);
}
