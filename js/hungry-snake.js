// Hungry Snake Game Logic (Enhanced from User Snippet)
const c = document.getElementById("game-canvas");
const x = c ? c.getContext("2d", { alpha: false }) : null;

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
let score = 0;

let gridSize = 20; // 400x400 Canvas means 20x20 Grid
let snake = [];
let dx = gridSize, dy = 0;
let nextDx = gridSize, nextDy = 0;

let food = {x: 100, y: 100};
let lastRenderTime = 0;
let baseSpeed = 8; // Steps per second

// --- Input Controls ---
window.addEventListener('keydown', e => {
    if(!isPlaying) return;
    
    if((e.key === "ArrowUp" || e.key === "w" || e.key === "W") && dy === 0) {
        nextDx = 0; nextDy = -gridSize;
        e.preventDefault();
    }
    if((e.key === "ArrowDown" || e.key === "s" || e.key === "S") && dy === 0) {
        nextDx = 0; nextDy = gridSize;
        e.preventDefault();
    }
    if((e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && dx === 0) {
        nextDx = -gridSize; nextDy = 0;
        e.preventDefault();
    }
    if((e.key === "ArrowRight" || e.key === "d" || e.key === "D") && dx === 0) {
        nextDx = gridSize; nextDy = 0;
        e.preventDefault();
    }
});

// Mobile Swipe Controls
let touchStartX = 0;
let touchStartY = 0;

if(c) {
    c.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        e.preventDefault(); // Prevents page scrolling
    }, {passive: false});

    c.addEventListener('touchmove', e => {
        if(!isPlaying) return;
        e.preventDefault();
        
        let touchEndX = e.touches[0].clientX;
        let touchEndY = e.touches[0].clientY;
        
        let diffX = touchEndX - touchStartX;
        let diffY = touchEndY - touchStartY;
        
        // Threshold for swipe detection
        if(Math.abs(diffX) > 20 || Math.abs(diffY) > 20) {
            if(Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal Swipe
                if(diffX > 0 && dx === 0) { nextDx = gridSize; nextDy = 0; }
                else if(diffX < 0 && dx === 0) { nextDx = -gridSize; nextDy = 0; }
            } else {
                // Vertical Swipe
                if(diffY > 0 && dy === 0) { nextDx = 0; nextDy = gridSize; }
                else if(diffY < 0 && dy === 0) { nextDx = 0; nextDy = -gridSize; }
            }
            // Reset start to avoid firing multiple times in one continuous drag
            touchStartX = touchEndX;
            touchStartY = touchEndY;
        }
    }, {passive: false});
}

// --- Graphical Rendering ---
function draw() {
    // 1. Draw Field
    x.fillStyle = "#2e7d32";
    x.fillRect(0, 0, c.width, c.height);
    
    // Subtle Grid overlay
    x.strokeStyle = "rgba(255, 255, 255, 0.05)";
    x.lineWidth = 1;
    for(let i = 0; i <= c.width; i += gridSize) {
        x.beginPath(); x.moveTo(i, 0); x.lineTo(i, c.height); x.stroke();
        x.beginPath(); x.moveTo(0, i); x.lineTo(c.width, i); x.stroke();
    }

    // 2. Draw Food (Apple Style)
    let fx = food.x;
    let fy = food.y;
    let halfGrid = gridSize / 2;
    
    x.fillStyle = "#f44336"; // Red Apple
    x.beginPath();
    x.arc(fx + halfGrid, fy + halfGrid + 1, halfGrid - 2, 0, Math.PI * 2);
    x.fill();
    
    x.fillStyle = "#795548"; // Stem
    x.fillRect(fx + halfGrid - 1, fy + 2, 2, 6);
    
    x.fillStyle = "#8bc34a"; // Leaf
    x.beginPath();
    x.ellipse(fx + halfGrid + 3, fy + 4, 3, 2, -Math.PI/4, 0, Math.PI*2);
    x.fill();

    // 3. Draw Snake Array
    snake.forEach((s, index) => {
        let isHead = (index === 0);
        
        if (isHead) {
            x.fillStyle = "#aed581"; // Lighter head
            x.beginPath();
            x.roundRect(s.x + 1, s.y + 1, gridSize - 2, gridSize - 2, 6);
            x.fill();
            
            // Draw Eyes based on direction
            x.fillStyle = "#fff";
            x.beginPath();
            if(dx > 0) { // Right
                x.arc(s.x + 14, s.y + 6, 3, 0, Math.PI*2); x.arc(s.x + 14, s.y + 14, 3, 0, Math.PI*2);
            } else if(dx < 0) { // Left
                x.arc(s.x + 6, s.y + 6, 3, 0, Math.PI*2); x.arc(s.x + 6, s.y + 14, 3, 0, Math.PI*2);
            } else if(dy > 0) { // Down
                x.arc(s.x + 6, s.y + 14, 3, 0, Math.PI*2); x.arc(s.x + 14, s.y + 14, 3, 0, Math.PI*2);
            } else { // Up
                x.arc(s.x + 6, s.y + 6, 3, 0, Math.PI*2); x.arc(s.x + 14, s.y + 6, 3, 0, Math.PI*2);
            }
            x.fill();
            
            x.fillStyle = "#000";
            if(dx > 0) { x.fillRect(s.x+15, s.y+5, 2, 2); x.fillRect(s.x+15, s.y+13, 2, 2); }
            else if(dx < 0) { x.fillRect(s.x+5, s.y+5, 2, 2); x.fillRect(s.x+5, s.y+13, 2, 2); }
            else if(dy > 0) { x.fillRect(s.x+5, s.y+15, 2, 2); x.fillRect(s.x+13, s.y+15, 2, 2); }
            else { x.fillRect(s.x+5, s.y+5, 2, 2); x.fillRect(s.x+13, s.y+5, 2, 2); }
        } else {
            x.fillStyle = "#689f38"; // Darker body
            x.beginPath();
            x.roundRect(s.x + 2, s.y + 2, gridSize - 4, gridSize - 4, 4);
            x.fill();
            x.strokeStyle = "#558b2f";
            x.stroke();
        }
    });
}

function updateLogic() {
    dx = nextDx;
    dy = nextDy;
    
    let head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Wall Collision Check
    if (head.x < 0 || head.x >= c.width || head.y < 0 || head.y >= c.height) {
        return endGame();
    }
    
    // Self Collision Check
    for(let i=0; i<snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            return endGame();
        }
    }
    
    // Move snake
    snake.unshift(head);

    // Food logic
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        spawnFood();
    } else {
        snake.pop();
    }
}

function spawnFood() {
    let valid = false;
    while(!valid) {
        food.x = Math.floor(Math.random() * (c.width / gridSize)) * gridSize;
        food.y = Math.floor(Math.random() * (c.height / gridSize)) * gridSize;
        valid = true;
        // make sure food isn't placed ON the snake
        for(let s of snake) {
            if(s.x === food.x && s.y === food.y) {
                valid = false;
                break;
            }
        }
    }
}

function gameLoop(currentTime) {
    if (!isPlaying) return;
    animationId = requestAnimationFrame(gameLoop);

    let currentSpeed = baseSpeed + Math.floor(score / 3);
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    
    if (secondsSinceLastRender < 1 / currentSpeed) return;
    lastRenderTime = currentTime;
    
    updateLogic();
    if(isPlaying) draw(); // Draw only if we didn't just crash
}

function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    c.style.display = 'block';
    hud.style.display = 'flex';
    
    snake = [
        {x: 200, y: 200},
        {x: 180, y: 200},
        {x: 160, y: 200}
    ];
    dx = gridSize; dy = 0;
    nextDx = gridSize; nextDy = 0;
    
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    
    let hs = localStorage.getItem('hungrySnakeHS') || 0;
    highScoreDisplay.textContent = `Best: ${hs}`;
    
    spawnFood();
    lastRenderTime = 0;
    isPlaying = true;
    requestAnimationFrame(gameLoop);
}

function endGame() {
    isPlaying = false;
    cancelAnimationFrame(animationId);
    
    // Crash Screen Shake
    c.style.transform = `translate(${(Math.random()-0.5)*15}px, ${(Math.random()-0.5)*15}px)`;
    setTimeout(() => { c.style.transform = 'translate(0,0)'; }, 100);
    
    setTimeout(() => {
        c.style.display = 'none';
        hud.style.display = 'none';
        gameOverScreen.style.display = 'flex';

        let hs = localStorage.getItem('hungrySnakeHS') || 0;
        if(score > hs) {
            localStorage.setItem('hungrySnakeHS', score);
            hs = score;
        }
        finalScoreText.innerHTML = `You scored: <strong style="font-size:1.5em">${score}</strong><br>Best: ${hs}`;
    }, 500); // 500ms delay to show the crash!
}

if(startBtn) startBtn.addEventListener('click', startGame);
if(restartBtn) restartBtn.addEventListener('click', startGame);
