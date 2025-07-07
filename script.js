// script.js
// JavaScript for the simple website

// Function to change the text inside the paragraph with id="message"
function changeText() {
    // Get the paragraph element by its ID
    const paragraph = document.getElementById("message");
    // Change the text inside the paragraph
    paragraph.textContent = "You clicked the button! 🎉";
}

// --- Animated pulsating monochrome background using Three.js ---
// This creates a fullscreen canvas and animates a monochrome gradient

// Create renderer and add to body
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '-1';
document.body.prepend(renderer.domElement);

// Create camera and scene
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const scene = new THREE.Scene();

// Create a plane with a custom shader material for the gradient
const geometry = new THREE.PlaneGeometry(2, 2);
const uniforms = {
    time: { value: 0.0 }
};
const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
            // Six animated points for the monochrome gradient
            float cx1 = 0.2 + 0.05 * sin(time);
            float cy1 = 0.3 + 0.05 * cos(time * 0.7);
            float cx2 = 0.8 + 0.05 * cos(time * 1.2);
            float cy2 = 0.7 + 0.05 * sin(time * 0.9);
            float cx3 = 0.5 + 0.1 * sin(time * 0.5);
            float cy3 = 0.4 + 0.1 * cos(time * 0.8);
            // Three more points at random locations (fixed for session)
            float cx4 = 0.15 + 0.1 * sin(time * 0.8);
            float cy4 = 0.8 + 0.05 * cos(time * 1.3);
            float cx5 = 0.65 + 0.07 * cos(time * 1.5);
            float cy5 = 0.15 + 0.09 * sin(time * 1.1);
            float cx6 = 0.35 + 0.09 * sin(time * 1.7);
            float cy6 = 0.6 + 0.07 * cos(time * 1.4);

            float d1 = distance(vUv, vec2(cx1, cy1));
            float d2 = distance(vUv, vec2(cx2, cy2));
            float d3 = distance(vUv, vec2(cx3, cy3));
            float d4 = distance(vUv, vec2(cx4, cy4));
            float d5 = distance(vUv, vec2(cx5, cy5));
            float d6 = distance(vUv, vec2(cx6, cy6));

            float g1 = smoothstep(0.0, 0.7, d1);
            float g2 = smoothstep(0.0, 0.7, d2);
            float g3 = smoothstep(0.0, 0.7, d3);
            float g4 = smoothstep(0.0, 0.7, d4);
            float g5 = smoothstep(0.0, 0.7, d5);
            float g6 = smoothstep(0.0, 0.7, d6);

            float shade = 1.0 - 0.3 * g1 - 0.2 * g2 - 0.15 * g3 - 0.15 * g4 - 0.1 * g5 - 0.1 * g6;
            shade = clamp(shade, 0.0, 1.0);
            gl_FragColor = vec4(vec3(shade), 1.0);
        }
    `
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Animation loop
function animate() {
    // Double the speed again (was 0.002)
    uniforms.time.value = performance.now() * 0.0045;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});
  