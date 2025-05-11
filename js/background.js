import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';

let scene, camera, renderer;
let geometry, material, mesh;
let uniformData;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const canvas = document.getElementById('background-canvas');
    if (!canvas) {
        console.error('Background canvas not found');
        return;
    }

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    uniformData = {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };

    geometry = new THREE.PlaneGeometry(2, 2);
    material = new THREE.ShaderMaterial({
        uniforms: uniformData,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec2 resolution;
            varying vec2 vUv;

            void main() {
                vec2 uv = vUv * resolution.xy / min(resolution.x, resolution.y);
                float gradient = 0.5 + 0.5 * sin(uv.y * 5.0 + time); // Animated gradient

                vec3 baseColor = vec3(0.0); // Black
                vec3 highlightColor = vec3(0.3); // Dark gray

                vec3 color = mix(baseColor, highlightColor, gradient);
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        transparent: true
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    window.addEventListener('resize', onWindowResize, { passive: true });

    animate();
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniformData.resolution.value.set(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    uniformData.time.value += 0.01;
    renderer.render(scene, camera);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}