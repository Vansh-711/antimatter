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
        this.y = Math.random() * canvas.height;
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

function createParticles() {
    particles.length = 0;
    for (let i = 0; i < 50; i++) {
        particles.push(new Dot());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animate);
}

// Orientation detection with fade effect
function checkOrientation() {
    const rotatedPrompt = document.querySelector('.rotated-prompt');
    const container = document.querySelector('.container');
    
    if (window.matchMedia('(orientation: landscape)').matches) {
        if (!container.classList.contains('fade-out')) {
            container.classList.add('fade-out');
            setTimeout(() => {
                container.classList.add('hidden');
                rotatedPrompt.classList.add('visible');
                
                // Add click event only to CUTIE word
                setupCutieClick();
            }, 1000);
        }
    } else {
        rotatedPrompt.classList.remove('visible');
        container.classList.remove('hidden');
        container.classList.remove('fade-out');
        
        // Reset any expanded state
        resetCutieState();
    }
}

// Setup click event for CUTIE word only
function setupCutieClick() {
    const cutieWord = document.getElementById('cutieWord');
    
    // Remove any existing listeners
    cutieWord.removeEventListener('click', handleCutieClick);
    
    // Add click event to CUTIE word
    cutieWord.addEventListener('click', handleCutieClick);
}

// Handle CUTIE word click - optimized smooth animation
function handleCutieClick() {
    const rotatedPrompt = document.querySelector('.rotated-prompt');
    const cutieWord = document.getElementById('cutieWord');
    
    // Force hardware acceleration
    cutieWord.style.willChange = 'transform, font-size, letter-spacing';
    
    // Step 1: Start expanding (fade out other words, remove background)
    rotatedPrompt.classList.add('expanding');
    
    // Step 2: After other words fade, trigger magnification with optimized timing
    setTimeout(() => {
        rotatedPrompt.classList.add('magnified');
    }, 1200); // Slightly faster for smoother feel
    
    // Add click event to magnified CUTIE to reset - with delay for smooth completion
    setTimeout(() => {
        cutieWord.addEventListener('click', handleCutieClickBack);
        // Clean up will-change after animation completes
        cutieWord.style.willChange = 'auto';
    }, 3700);
}

// Handle click on magnified CUTIE to zoom back out
function handleCutieClickBack() {
    resetCutieState();
}

// Reset CUTIE to normal state - optimized
function resetCutieState() {
    const rotatedPrompt = document.querySelector('.rotated-prompt');
    const cutieWord = document.getElementById('cutieWord');
    
    // Force hardware acceleration during reset
    cutieWord.style.willChange = 'transform, font-size, letter-spacing';
    
    rotatedPrompt.classList.remove('expanding');
    rotatedPrompt.classList.remove('magnified');
    
    // Remove click event from magnified state
    cutieWord.removeEventListener('click', handleCutieClickBack);
    
    // Re-setup original click event after animation with optimized timing
    setTimeout(() => {
        setupCutieClick();
        cutieWord.style.willChange = 'auto';
    }, 2500);
}

// Optimized event listeners
window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
    checkOrientation();
});

window.addEventListener('load', checkOrientation);

window.addEventListener('orientationchange', () => {
    setTimeout(checkOrientation, 100);
});

// Initialize
createParticles();
animate();
checkOrientation();
