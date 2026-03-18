// Speed Racer Game Logic (Enhanced from Snippet)
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
let score = 0;

let car = {x: 180, y: 400, width: 40, height: 70, speed: 6};
let enemies = [];
let keys = {};

window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup', e => { keys[e.key] = false; });

// Touch and Mouse support
let touchX = null;
if(c) {
    c.addEventListener('touchstart', e => { 
        e.preventDefault(); 
        touchX = e.touches[0].clientX; 
    }, {passive: false});
    
    c.addEventListener('touchmove', e => {
        e.preventDefault();
        let rect = c.getBoundingClientRect();
        let scaleX = c.width / rect.width;
        touchX = (e.touches[0].clientX - rect.left) * scaleX;
    }, {passive: false});
    
    c.addEventListener('touchend', () => { touchX = null; });
    
    c.addEventListener('mousedown', e => {
        let rect = c.getBoundingClientRect();
        let scaleX = c.width / rect.width;
        touchX = (e.clientX - rect.left) * scaleX;
    });
    
    c.addEventListener('mousemove', e => {
        if(e.buttons > 0) {
            let rect = c.getBoundingClientRect();
            let scaleX = c.width / rect.width;
            touchX = (e.clientX - rect.left) * scaleX;
        }
    });
    
    c.addEventListener('mouseup', () => { touchX = null; });
    c.addEventListener('mouseleave', () => { touchX = null; });
}

function drawCar(xPos, yPos, color, isEnemy = false) {
    x.save();
    x.translate(xPos, yPos);
    if(isEnemy) {
        // Enemies travel down, so turn them around 180 deg.
        x.translate(40, 70);
        x.rotate(Math.PI);
    }
    
    // Body shadow
    x.fillStyle = 'rgba(0,0,0,0.3)';
    x.beginPath(); x.roundRect(4, 4, 40, 70, 8); x.fill();
    
    // Main Body
    x.fillStyle = color;
    x.beginPath(); x.roundRect(0, 0, 40, 70, 8); x.fill();
    x.lineWidth = 1;
    x.strokeStyle = '#333';
    x.stroke();
    
    // Windshield (Front)
    x.fillStyle = "#333";
    x.beginPath(); x.roundRect(5, 15, 30, 15, 3); x.fill();
    
    // Windshield (Rear)
    x.beginPath(); x.roundRect(5, 48, 30, 10, 2); x.fill();
    
    // Headlights
    x.fillStyle = isEnemy ? "#ffeb3b" : "#fff";
    x.beginPath(); x.arc(8, 2, 4, 0, Math.PI*2); x.fill();
    x.beginPath(); x.arc(32, 2, 4, 0, Math.PI*2); x.fill();
    
    x.restore();
}

function drawRoad() {
    // Road background
    x.fillStyle = "#606060";
    x.fillRect(50, 0, 300, 500);
    
    // Road border stripes
    x.fillStyle = "#e0e0e0";
    x.fillRect(45, 0, 5, 500);
    x.fillRect(350, 0, 5, 500);
    
    // Dashed center lines (scrolling illusion)
    x.strokeStyle = "#fff";
    x.lineWidth = 6;
    x.setLineDash([30, 30]);
    x.lineDashOffset = -(frameCount * 5) % 60;
    
    // Two lanes marking
    x.beginPath(); x.moveTo(150, 0); x.lineTo(150, 500); x.stroke();
    x.beginPath(); x.moveTo(250, 0); x.lineTo(250, 500); x.stroke();
    
    x.setLineDash([]); // Reset
}

function gameLoop() {
    if (!isPlaying) return;
    
    score += 0.05; // Base survival score
    frameCount++;
    
    // --- Input Processing ---
    if(keys["ArrowLeft"] || keys["a"] || keys["A"]) car.x -= car.speed;
    if(keys["ArrowRight"] || keys["d"] || keys["D"]) car.x += car.speed;
    
    if(touchX !== null) {
        // Deadzone of 10px so it doesn't jitter
        if(touchX < car.x + 20 - 5) car.x -= car.speed;
        if(touchX > car.x + 20 + 5) car.x += car.speed;
    }
    
    // Clamp to road bounds (Vehicle width is 40)
    car.x = Math.max(50, Math.min(310, car.x));
    
    // --- Rendering ---
    x.clearRect(0, 0, 400, 500);
    
    // Draw Grass side borders
    x.fillStyle = "#8BC34A";
    x.fillRect(0, 0, 400, 500);
    
    drawRoad();
    
    // --- Enemy Logic ---
    // Spawn enemies
    if(frameCount % 50 === 0 || Math.random() < 0.015) {
        // Prevent overlapping spawns
        let canSpawn = true;
        if(enemies.length > 0 && enemies[enemies.length-1].y < 120) {
            canSpawn = false; 
        }
        
        if(canSpawn) {
            let ex = 55 + Math.random() * 250;
            // Car Colors: Blue, Purple, Pink, Cyan, Yellow
            let colors = ["#2196F3", "#9C27B0", "#E91E63", "#00BCD4", "#FFEB3B"];
            let color = colors[Math.floor(Math.random() * colors.length)];
            enemies.push({
                x: ex, 
                y: -80, 
                speed: 4 + Math.random() * 3 + (score * 0.01), 
                color: color, 
                passed: false
            });
        }
    }
    
    enemies.forEach(e => {
        e.y += e.speed;
        
        // Pass Logic
        if(!e.passed && e.y > car.y + 70) {
            e.passed = true;
            score += 10;
        }
        
        drawCar(e.x, e.y, e.color, true);

        // Exact Collision Logic (Hitbox reduction for fairness)
        let tolerance = 4;
        let cRect = {l: car.x + tolerance, r: car.x + 40 - tolerance, t: car.y + tolerance, b: car.y + 70 - tolerance};
        let eRect = {l: e.x + tolerance, r: e.x + 40 - tolerance, t: e.y + tolerance, b: e.y + 70 - tolerance};
        
        if(cRect.l < eRect.r && cRect.r > eRect.l && cRect.t < eRect.b && cRect.b > eRect.t) {
            endGame();
        }
    });
    
    drawCar(car.x, car.y, "#ff3300", false);
    
    // Score update
    scoreDisplay.textContent = `Score: ${Math.floor(score)}`;
    
    // Cleanup old enemies
    if(enemies.length > 0 && enemies[0].y > 550) enemies.shift();
    
    if(isPlaying) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    c.style.display = 'block';
    hud.style.display = 'flex';
    
    car.x = 180;
    enemies = [];
    score = 0;
    frameCount = 0;
    scoreDisplay.textContent = `Score: ${Math.floor(score)}`;
    
    let hs = localStorage.getItem('speedRacerHS') || 0;
    highScoreDisplay.textContent = `Best: ${hs}`;

    isPlaying = true;
    keys = {}; // Reset input states
    gameLoop();
}

function endGame() {
    isPlaying = false;
    cancelAnimationFrame(animationId);
    
    // Screen shake
    c.style.transform = `translate(${(Math.random()-0.5)*20}px, ${(Math.random()-0.5)*20}px)`;
    setTimeout(() => { c.style.transform = 'translate(0,0)'; }, 100);
    
    c.style.display = 'none';
    hud.style.display = 'none';
    gameOverScreen.style.display = 'flex';

    let hs = localStorage.getItem('speedRacerHS') || 0;
    let finalIntScore = Math.floor(score);
    if(finalIntScore > hs) {
        localStorage.setItem('speedRacerHS', finalIntScore);
        hs = finalIntScore;
    }
    
    finalScoreText.innerHTML = `You scored: <strong style="font-size:1.5em">${finalIntScore}</strong><br>Best: ${hs}`;
}

if(startBtn) startBtn.addEventListener('click', startGame);
if(restartBtn) restartBtn.addEventListener('click', startGame);
