// Star Catcher Game Logic (Enhanced from User Snippet)
const c = document.getElementById("game-canvas");
const x = c ? c.getContext("2d") : null;

const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const hud = document.getElementById('hud');
const scoreDisplay = document.getElementById('scoreDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const finalScoreText = document.getElementById('final-score-text');

let isPlaying = false;
let animationId;
let score = 0;
let timeLeft = 30; // 30 seconds timer
let lastTime = 0;
let frameCount = 0;

let target = {x: 250, y: 200, radius: 25, timer: 0};
let particles = [];

function spawnTarget() {
    target.radius = 20 + Math.random() * 15; // Random size 20 to 35
    target.x = target.radius + Math.random() * (c.width - target.radius * 2);
    target.y = target.radius + Math.random() * (c.height - target.radius * 2);
    target.timer = 0;
}

// Sparkle Particle Effect
class Particle {
    constructor(px, py) {
        this.x = px;
        this.y = py;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.radius = Math.random() * 3 + 2;
        this.life = 1.0;
        this.decay = Math.random() * 0.05 + 0.02;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        
        x.globalAlpha = Math.max(0, this.life);
        x.fillStyle = "#fff";
        x.beginPath();
        x.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        x.fill();
        x.globalAlpha = 1.0;
    }
}

function createExplosion(px, py) {
    for(let i=0; i<15; i++) {
        particles.push(new Particle(px, py));
    }
}

// Input Handlers
function handleClick(e) {
    if(!isPlaying) return;
    
    let rect = c.getBoundingClientRect();
    let scaleX = c.width / rect.width;
    let scaleY = c.height / rect.height;
    
    let mx = (e.clientX || e.touches[0].clientX) - rect.left;
    mx *= scaleX;
    
    let my = (e.clientY || e.touches[0].clientY) - rect.top;
    my *= scaleY;
    
    // Hit Detection
    let dist = Math.hypot(mx - target.x, my - target.y);
    // Add extra 10px generous bounds for kids
    if(dist < target.radius + 10) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        createExplosion(target.x, target.y);
        spawnTarget();
        
        // Slight screen bounce
        c.style.transform = "scale(0.97)";
        setTimeout(() => c.style.transform = "scale(1)", 100);
    }
}

if(c) {
    c.addEventListener('mousedown', handleClick);
    c.addEventListener('touchstart', e => {
        e.preventDefault();
        handleClick(e);
    }, {passive: false});
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let xpos = cx;
    let ypos = cy;
    let step = Math.PI / spikes;

    x.beginPath();
    x.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        xpos = cx + Math.cos(rot) * outerRadius;
        ypos = cy + Math.sin(rot) * outerRadius;
        x.lineTo(xpos, ypos);
        rot += step;

        xpos = cx + Math.cos(rot) * innerRadius;
        ypos = cy + Math.sin(rot) * innerRadius;
        x.lineTo(xpos, ypos);
        rot += step;
    }
    x.lineTo(cx, cy - outerRadius);
    x.closePath();
    
    x.fillStyle = color;
    x.fill();
    x.strokeStyle = "#ffb300";
    x.lineWidth = 2;
    x.stroke();
}

function render(timestamp) {
    if(!isPlaying) return;
    animationId = requestAnimationFrame(render);
    
    // Timer Logic
    if(!lastTime) lastTime = timestamp;
    let delta = timestamp - lastTime;
    
    if(delta >= 1000) {
        timeLeft--;
        timeDisplay.textContent = `Time: ${timeLeft}s`;
        lastTime = timestamp;
        
        if(timeLeft <= 0) {
            endGame();
            return;
        }
    }
    
    // Clear & Draw Background
    x.fillStyle = "#1a237e";
    x.fillRect(0, 0, c.width, c.height);
    
    // Twinkling background stars
    if(frameCount % 10 === 0) {
        for(let i=0; i<3; i++){
            x.fillStyle = "rgba(255,255,255," + Math.random() + ")";
            x.beginPath();
            x.arc(Math.random()*c.width, Math.random()*c.height, Math.random()*2, 0, Math.PI*2);
            x.fill();
        }
    }
    
    // Star Logic
    target.timer++;
    // If user takes too long, move the star automatically
    let maxWait = 90 - Math.min(60, score * 2); // Gets faster as you score more
    if(target.timer > maxWait) {
        spawnTarget();
    }
    
    // Draw Current Star with pulse effect
    let pulse = Math.sin(frameCount * 0.1) * 3;
    drawStar(target.x, target.y, 5, target.radius + pulse, target.radius/2 + pulse/2, "#ffca28");
    
    // Draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        } else {
            particles[i].update();
        }
    }
    
    frameCount++;
}

function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    c.style.display = 'block';
    hud.style.display = 'flex';
    
    score = 0;
    timeLeft = 30; // 30 sec reset
    scoreDisplay.textContent = `Score: ${score}`;
    timeDisplay.textContent = `Time: ${timeLeft}s`;
    
    let hs = localStorage.getItem('starCatcherHS') || 0;
    highScoreDisplay.textContent = `Best: ${hs}`;

    spawnTarget();
    particles = [];
    lastTime = 0;
    frameCount = 0;
    
    isPlaying = true;
    requestAnimationFrame(render);
}

function endGame() {
    isPlaying = false;
    cancelAnimationFrame(animationId);
    
    c.style.display = 'none';
    hud.style.display = 'none';
    gameOverScreen.style.display = 'flex';

    let hs = localStorage.getItem('starCatcherHS') || 0;
    if(score > hs) {
        localStorage.setItem('starCatcherHS', score);
        hs = score;
    }
    
    finalScoreText.innerHTML = `You caught <strong style="font-size:1.5em; color:#ffca28">${score}</strong> stars!<br>Best: ${hs}`;
}

if(startBtn) startBtn.addEventListener('click', startGame);
if(restartBtn) restartBtn.addEventListener('click', startGame);
