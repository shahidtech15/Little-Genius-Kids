// Flying Bird Game Logic (Enhanced from Snippet)
const c = document.getElementById("game-canvas");
const x = c ? c.getContext("2d") : null;

const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const hud = document.getElementById('hud');
const scoreDisplay = document.getElementById('scoreDisplay');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const finalScoreText = document.getElementById('final-score-text');

let isPlaying = false;
let animationId;
let frameCount = 0;

let bird = {x: 50, y: 200, v: 0, radius: 15};
let pipes = [];
let score = 0;

function jump() {
    if(isPlaying) {
        bird.v = -8;
    }
}

// Input Controls
if(c) {
    c.addEventListener('mousedown', jump);
    c.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); }, {passive: false});
}
window.addEventListener('keydown', (e) => {
    if((e.code === 'Space' || e.code === 'ArrowUp') && isPlaying) {
        e.preventDefault(); // prevents page scrolling
        jump();
    }
});

function drawBird() {
    x.save();
    x.translate(bird.x, bird.y);
    // Rotate bird dependent on velocity (dropping = face down, jumping = face up)
    let rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.v * 0.1)));
    x.rotate(rotation);

    // Body
    x.fillStyle = "#ffeb3b";
    x.beginPath();
    x.arc(0, 0, bird.radius, 0, Math.PI * 2);
    x.fill();
    x.lineWidth = 2;
    x.strokeStyle = "#fbc02d";
    x.stroke();

    // Eye
    x.fillStyle = "white";
    x.beginPath();
    x.arc(6, -5, 5, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = "black";
    x.beginPath();
    x.arc(8, -5, 2, 0, Math.PI * 2);
    x.fill();

    // Beak
    x.fillStyle = "#ff9800";
    x.beginPath();
    x.moveTo(10, 2);
    x.lineTo(24, 6);
    x.lineTo(10, 10);
    x.fill();
    x.stroke();

    // Wing animation
    x.fillStyle = "#fff";
    x.beginPath();
    x.ellipse(-5, 2, 8, 5, -Math.PI / 6 + (Math.sin(frameCount * 0.5) * 0.5), 0, Math.PI * 2);
    x.fill();
    x.stroke();

    x.restore();
}

function drawPipes() {
    pipes.forEach(p => {
        let gradient = x.createLinearGradient(p.x, 0, p.x + 50, 0);
        gradient.addColorStop(0, "#8BC34A");
        gradient.addColorStop(0.5, "#aedd78");
        gradient.addColorStop(1, "#689F38");
        x.fillStyle = gradient;
        x.strokeStyle = "#33691E";
        x.lineWidth = 2;
        
        // Top Pipe
        x.fillRect(p.x, 0, 50, p.top);
        x.strokeRect(p.x, 0, 50, p.top);
        x.fillRect(p.x - 5, p.top - 20, 60, 20); // Cap
        x.strokeRect(p.x - 5, p.top - 20, 60, 20);

        // Bottom Pipe
        x.fillRect(p.x, p.top + 150, 50, 500);
        x.strokeRect(p.x, p.top + 150, 50, 500);
        x.fillRect(p.x - 5, p.top + 150, 60, 20); // Cap
        x.strokeRect(p.x - 5, p.top + 150, 60, 20);
    });
}

function drawBackground() {
    // Dynamic Sky Gradient
    let bg = x.createLinearGradient(0, 0, 0, c.height);
    bg.addColorStop(0, "#4facfe");
    bg.addColorStop(1, "#c1e8ff");
    x.fillStyle = bg;
    x.fillRect(0, 0, 400, 500);

    // Simple procedural clouds parallax
    x.fillStyle = "rgba(255, 255, 255, 0.6)";
    x.beginPath();
    let cx1 = (frameCount * 0.3) % 460 - 60;
    x.arc(cx1, 100, 30, 0, Math.PI*2);
    x.arc(cx1 + 30, 100, 40, 0, Math.PI*2);
    x.arc(cx1 + 60, 100, 30, 0, Math.PI*2);
    x.fill();
    
    // Floor
    x.fillStyle = "#ded895";
    x.fillRect(0, 470, 400, 30);
    x.fillStyle = "#8BC34A";
    x.fillRect(0, 470, 400, 10);
}

function loop() {
    if (!isPlaying) return;
    drawBackground();

    // Physics
    bird.v += 0.5; // gravity
    bird.y += bird.v;
    frameCount++;

    // Spawning logic based on snippet
    if (frameCount % 90 === 0 || Math.random() < 0.005) { 
        // Fixed spawn rate plus a tiny random chance for variance, ensuring nice spacing
        if(pipes.length === 0 || (400 - pipes[pipes.length-1].x) > 150) {
            pipes.push({ x: 400, top: Math.random() * 200 + 50, passed: false });
        }
    }

    // Processing Pipes
    pipes.forEach(p => {
        p.x -= 3;
        
        // Scoring
        if(p.x + 50 < bird.x && !p.passed) {
            score++;
            p.passed = true;
            scoreDisplay.textContent = `Score: ${score}`;
        }

        // Exact Collision logic improved slightly with radius tolerance
        let tolerance = 12;
        if (bird.x + Math.max(0, tolerance) > p.x && 
            bird.x - Math.max(0, tolerance) < p.x + 50 &&
            (bird.y - Math.max(0, tolerance) < p.top || bird.y + Math.max(0, tolerance) > p.top + 150)) {
            endGame();
        }
    });

    // Floor and Ceiling Collision
    if (bird.y > 450 || bird.y < -20) {
        endGame();
    }

    drawPipes();
    drawBird();

    // Garbage collection of old pipes
    if (pipes.length > 0 && pipes[0].x < -60) {
        pipes.shift();
    }

    if(isPlaying) {
        animationId = requestAnimationFrame(loop);
    }
}

function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    c.style.display = 'block';
    hud.style.display = 'flex';
    
    bird = {x: 50, y: 200, v: 0, radius: 15};
    pipes = [];
    score = 0;
    frameCount = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    
    let hs = localStorage.getItem('flyingBirdHS') || 0;
    highScoreDisplay.textContent = `Best: ${hs}`;

    isPlaying = true;
    loop();
}

function endGame() {
    isPlaying = false;
    cancelAnimationFrame(animationId);
    
    c.style.display = 'none';
    hud.style.display = 'none';
    gameOverScreen.style.display = 'flex';

    let hs = localStorage.getItem('flyingBirdHS') || 0;
    if(score > hs) {
        localStorage.setItem('flyingBirdHS', score);
        hs = score;
    }
    
    finalScoreText.innerHTML = `You scored: <strong style="font-size:1.5em">${score}</strong><br>Best: ${hs}`;
}

if(startBtn) startBtn.addEventListener('click', startGame);
if(restartBtn) restartBtn.addEventListener('click', startGame);
