// Space Explorer Game Engine
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const hud = document.getElementById('hud');
const scoreDisplay = document.getElementById('scoreDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const finalScoreText = document.getElementById('final-score-text');

let isPlaying = false;
let score = 0;
let lives = 3;
let entities = [];
let particles = [];
let animationId;
let frameCount = 0;

// Ship details
const ship = {
    x: canvas ? canvas.width / 2 : 400,
    y: canvas ? canvas.height - 80 : 420,
    width: 40,
    height: 60,
    speed: 5
};

// Input handling
let mouse = { x: ship.x, y: ship.y };

// Resize logic for responsive canvas scaling
function resizeCanvas() {
    if(!canvas) return;
    const container = document.querySelector('.game-container');
    const displayWidth = Math.min(800, container.clientWidth - 40);
    const displayHeight = displayWidth * (500/800);
    
    // Internal resolution remains 800x500 for consistent speeds and logic
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
}
if(typeof window !== 'undefined') window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // initial setup

// Update mouse or touch position
function updateMousePos(e) {
    if(!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX = e.clientX;
    let clientY = e.clientY;
    
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        e.preventDefault(); // prevent scrolling while playing
    }
    
    mouse.x = (clientX - rect.left) * scaleX;
    mouse.y = (clientY - rect.top) * scaleY;
}

if(canvas) {
    canvas.addEventListener('mousemove', updateMousePos);
    canvas.addEventListener('touchmove', updateMousePos, {passive: false});
}

// Game Entities
class Star {
    constructor() {
        this.radius = 12;
        this.x = Math.random() * (canvas.width - this.radius*2) + this.radius;
        this.y = -20;
        this.speed = 2 + Math.random() * 2 + (score * 0.02);
        this.type = 'star';
    }
    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.rotate(frameCount * 0.05);
        for(let i=0; i<5; i++) {
            ctx.lineTo(Math.cos((18+i*72)/180*Math.PI)*this.radius, -Math.sin((18+i*72)/180*Math.PI)*this.radius);
            ctx.lineTo(Math.cos((54+i*72)/180*Math.PI)*this.radius/2.5, -Math.sin((54+i*72)/180*Math.PI)*this.radius/2.5);
        }
        ctx.closePath();
        ctx.fillStyle = '#ffeb3b';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#fbc02d';
        ctx.stroke();
        ctx.restore();
    }
    update() {
        this.y += this.speed;
        this.draw();
    }
}

class Asteroid {
    constructor() {
        this.radius = 18 + Math.random() * 25;
        this.x = Math.random() * (canvas.width - this.radius*2) + this.radius;
        this.y = -this.radius * 2;
        this.speed = 3 + Math.random() * 3 + (score * 0.03); // Difficulty scaling
        this.type = 'asteroid';
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.05;
        
        // Procedural rock shape
        this.points = [];
        for(let i=0; i<8; i++) {
            this.points.push(this.radius * (0.8 + Math.random() * 0.4));
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        for(let i=0; i<8; i++) {
            let angle = i * Math.PI / 4;
            let px = Math.cos(angle) * this.points[i];
            let py = Math.sin(angle) * this.points[i];
            if(i===0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = '#8a8d91';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#5c5e60';
        ctx.stroke();
        ctx.restore();
    }
    update() {
        this.y += this.speed;
        this.rotation += this.rotSpeed;
        this.draw();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.radius = Math.random() * 3 + 2;
        this.color = color;
        this.alpha = 1;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.03;
        this.draw();
    }
}

function createExplosion(x, y, color) {
    for(let i=0; i<20; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// Drawing Logic
function drawShip() {
    // Smooth interpolating follow
    ship.x += (mouse.x - ship.x) * 0.15;
    ship.y += (mouse.y - ship.y) * 0.15;

    // Constrain to canvas bounds
    ship.x = Math.max(ship.width/2, Math.min(canvas.width - ship.width/2, ship.x));
    ship.y = Math.max(ship.height/2, Math.min(canvas.height - ship.height/2, ship.y));

    ctx.save();
    ctx.translate(ship.x, ship.y);
    
    // Thruster flame (flicker)
    ctx.beginPath();
    ctx.moveTo(-10, 20);
    ctx.lineTo(0, 20 + Math.random() * 25 + 10);
    ctx.lineTo(10, 20);
    ctx.fillStyle = '#ff9800';
    ctx.fill();

    // Ship Body
    ctx.beginPath();
    ctx.moveTo(0, -30); // nose
    ctx.lineTo(20, 20); // right wing
    ctx.lineTo(-20, 20); // left wing
    ctx.closePath();
    ctx.fillStyle = '#f5f5f5';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
    
    // Cockpit
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#66fcf1';
    ctx.fill();

    ctx.restore();
}

function drawBackground() {
    // Trailing effect using alpha fill
    ctx.fillStyle = 'rgba(11, 12, 16, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Starfield points
    if(frameCount % 3 === 0) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(Math.random()*canvas.width, 0, 2, Math.random()*3+1);
    }
}

// Core Game Loop
function animate() {
    if (!isPlaying) return;
    animationId = requestAnimationFrame(animate);
    frameCount++;

    drawBackground();
    drawShip();

    // Spawning logic (gets harder as score increases)
    let starSpawnRate = 60;
    let asteroidSpawnRate = Math.max(25, 80 - Math.floor(score/3));

    if (frameCount % starSpawnRate === 0) {
        entities.push(new Star());
    }
    if (frameCount % asteroidSpawnRate === 0) {
        entities.push(new Asteroid());
    }

    // Process Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        } else {
            particles[i].update();
        }
    }

    // Process Entities & Collisions
    for (let i = entities.length - 1; i >= 0; i--) {
        const e = entities[i];
        e.update();

        // Remove off-screen items
        if (e.y > canvas.height + 50) {
            entities.splice(i, 1);
            continue;
        }

        // Circular Collision detection
        let dist = Math.hypot(ship.x - e.x, ship.y - e.y);
        
        // Ship hit area is slightly smaller than graphical size
        let hitRadius = 15; 
        
        if (dist < e.radius + hitRadius) {
            if (e.type === 'star') {
                score += 10;
                scoreDisplay.textContent = `Score: ${score}`;
                createExplosion(e.x, e.y, '#ffeb3b');
                entities.splice(i, 1);
            } else if (e.type === 'asteroid') {
                lives--;
                livesDisplay.textContent = `Lives: ${lives}`;
                createExplosion(ship.x, ship.y, '#f44336');
                entities.splice(i, 1);
                
                // Camera shake effect
                canvas.style.transform = `translate(${(Math.random()-0.5)*20}px, ${(Math.random()-0.5)*20}px)`;
                setTimeout(() => { canvas.style.transform = 'translate(0,0)'; }, 100);

                if (lives <= 0) {
                    endGame();
                }
            }
        }
    }
}

// Game Flow Management
function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';
    hud.style.display = 'flex';
    resizeCanvas();
    
    score = 0;
    lives = 3;
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    
    entities = [];
    particles = [];
    frameCount = 0;
    
    // Reset ship position
    ship.x = canvas.width / 2;
    ship.y = canvas.height - 80;
    mouse.x = ship.x;
    mouse.y = ship.y;
    
    // Clear canvas before start
    ctx.fillStyle = '#0b0c10';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    isPlaying = true;
    animate();
}

function endGame() {
    isPlaying = false;
    cancelAnimationFrame(animationId);
    
    canvas.style.display = 'none';
    hud.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    finalScoreText.textContent = `You scored: ${score}!`;
    
    // Update high score (simple localStorage implementation)
    let highScore = localStorage.getItem('spaceExplorerHighScore') || 0;
    if(score > highScore) {
        localStorage.setItem('spaceExplorerHighScore', score);
        finalScoreText.innerHTML += '<br><span style="color:#ffeb3b; font-size:1.5em;">New High Score!</span>';
    } else {
        finalScoreText.innerHTML += `<br><span style="font-size:0.8em; color:#ccc;">High Score: ${highScore}</span>`;
    }
}

if(startBtn) startBtn.addEventListener('click', startGame);
if(restartBtn) restartBtn.addEventListener('click', startGame);
