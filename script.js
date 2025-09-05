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

// Handle window resize
window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
});

// Initialize
createParticles();
animate();
