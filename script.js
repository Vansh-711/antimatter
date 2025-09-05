const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle array
const particles = [];

// Simple dot particle
class Dot {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; // Initial spread
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -Math.random() * 20 - 5;
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.6 + 0.3;
    }

    update() {
        this.y += this.speed;
        
        // Reset when off screen
        if (this.y > canvas.height + 10) {
            this.reset();
        }
    }

    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
function createParticles() {
    particles.length = 0;
    
    // Simple dots falling down
    for (let i = 0; i < 50; i++) {
        particles.push(new Dot());
    }
}

// Animation loop
function animate() {
    // Clear canvas completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animate);
}

// Orientation detection function with fade effect
function checkOrientation() {
    const rotatedPrompt = document.querySelector('.rotated-prompt');
    const container = document.querySelector('.container');
    
    if (window.matchMedia('(orientation: landscape)').matches) {
        // Fade out old container, then hide and show prompt
        if (!container.classList.contains('fade-out')) {
            container.classList.add('fade-out');
            setTimeout(() => {
                container.classList.add('hidden');
                rotatedPrompt.classList.add('visible');
            }, 1000); // match 1s fade duration
        }
    } else {
        // Show container and remove fade-out for portrait
        rotatedPrompt.classList.remove('visible');
        container.classList.remove('hidden');
        container.classList.remove('fade-out');
    }
}

// Handle window resize and orientation change
window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
    checkOrientation();
});

// Check orientation when page loads
window.addEventListener('load', checkOrientation);

// Also listen for orientation change event (for better mobile support)
window.addEventListener('orientationchange', () => {
    setTimeout(checkOrientation, 100); // Small delay to ensure orientation has changed
});

// Initialize
createParticles();
animate();
checkOrientation();
