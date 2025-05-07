let particles = [];
const numParticles = 1000; // Reduced from 2000 for better performance
const noiseScale = 0.003;
const timeScale = 0.0005; // Reduced for smoother animation
let time = 0;
let isDarkMode = false;
let offscreenCanvas;
let offscreenCtx;
let lastFrameTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    pixelDensity(1); // Set to 1 for better performance
    
    // Create offscreen canvas for better performance
    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = windowWidth;
    offscreenCanvas.height = windowHeight;
    offscreenCtx = offscreenCanvas.getContext('2d', { alpha: false });
    
    // Check initial theme
    isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Initialize particles with optimized properties
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            pos: createVector(random(width), random(height)),
            baseY: random(height),
            size: random(0.8, 1.5),
            speed: random(0.1, 0.4),
            offset: random(TWO_PI),
            opacity: random(0.05, 0.2)
        });
    }

    // Set drawing mode once
    offscreenCtx.globalCompositeOperation = 'source-over';
}

function draw() {
    const currentTime = performance.now();
    if (currentTime - lastFrameTime < frameInterval) return;
    lastFrameTime = currentTime;

    // Clear both canvases
    clear();
    offscreenCtx.clearRect(0, 0, width, height);
    
    // Update time
    time += timeScale;
    
    // Draw particles in batches
    offscreenCtx.beginPath();
    particles.forEach(p => {
        // Simplified wave pattern
        let wave = sin(p.pos.x * 0.002 + time + p.offset) * (height * 0.02);
        
        // Update position
        p.pos.y = p.baseY + wave;
        p.pos.x += p.speed;
        
        // Wrap around screen
        if (p.pos.x > width) {
            p.pos.x = 0;
            p.pos.y = p.baseY = random(height);
        }
        
        // Draw grain particle
        let grainColor = isDarkMode ? 255 : 0;
        offscreenCtx.fillStyle = `rgba(${grainColor}, ${grainColor}, ${grainColor}, ${p.opacity})`;
        offscreenCtx.moveTo(p.pos.x, p.pos.y);
        offscreenCtx.arc(p.pos.x, p.pos.y, p.size, 0, TWO_PI);
    });
    offscreenCtx.fill();
    
    // Draw offscreen canvas to main canvas
    image(offscreenCanvas, 0, 0);
}

// Throttled window resize handler
let resizeTimeout;
function windowResized() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas(windowWidth, windowHeight);
        offscreenCanvas.width = windowWidth;
        offscreenCanvas.height = windowHeight;
        particles.forEach(p => {
            p.pos = createVector(random(width), random(height));
            p.baseY = p.pos.y;
        });
    }, 250);
}

// Optimized mouse interaction with throttling and RAF
const mouseMoved = (() => {
    let lastTime = 0;
    const throttleMs = 16; // Limit to ~60fps
    let rafId;
    
    return (event) => {
        if (rafId) return;
        
        rafId = requestAnimationFrame(() => {
            const now = performance.now();
            if (now - lastTime < throttleMs) {
                rafId = null;
                return;
            }
            
            lastTime = now;
            const mousePos = createVector(mouseX, mouseY);
            particles.forEach(p => {
                let d = p5.Vector.dist(p.pos, mousePos);
                if (d < 60) {
                    let force = p5.Vector.sub(p.pos, mousePos);
                    force.setMag(map(d, 0, 60, 2, 0));
                    p.pos.add(force);
                }
            });
            
            rafId = null;
        });
    };
})();

// Theme change observer with debouncing
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});