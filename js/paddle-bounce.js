// Paddle Bounce Engine (Transformed User Snippet)
const c = document.getElementById("game-canvas");
const x = c ? c.getContext("2d") : null;

const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const hud = document.getElementById('hud');
const scoreDisplay = document.getElementById('scoreDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const finalScoreText = document.getElementById('final-score-text');

let isPlaying = false;
let animationId;
let score = 0;
let lives = 3;

// Core actors
let ball = { x: 250, y: 200, dx: 4, dy: -4, radius: 12 };
let paddle = { x: 200, width: 100, height: 16, y: 460 };
let speedMult = 1;
let trails = []; 

function getMousePos(e) {
    let rect = c.getBoundingClientRect();
    let scaleX = c.width / rect.width;
    let clientX = e.clientX || (e.touches ? e.touches[0].clientX : paddle.x + paddle.width/2);
    // Locks paddle into the screen correctly
    return Math.max(0, Math.min(c.width - paddle.width, (clientX - rect.left) * scaleX - paddle.width / 2));
}

if(c) {
    c.addEventListener('mousemove', e => {
        if(isPlaying) paddle.x = getMousePos(e);
    });
    c.addEventListener('touchmove', e => {
        if(isPlaying){ e.preventDefault(); paddle.x = getMousePos(e); }
    }, {passive: false});
}

function updateHUD() {
    scoreDisplay.textContent = `Score: ${score}`;
    let hearts = "";
    for(let i=0; i<lives; i++) hearts += "❤️";
    livesDisplay.textContent = `Lives: ${hearts}`;
}

function render() {
    if(!isPlaying) return;
    animationId = requestAnimationFrame(render);
    
    // Gradient Sky Background
    let grad = x.createLinearGradient(0, 0, 0, c.height);
    grad.addColorStop(0, '#1E1E2F');
    grad.addColorStop(1, '#0e0e1a');
    x.fillStyle = grad;
    x.fillRect(0, 0, c.width, c.height);

    // Ball Trails Visuals
    trails.push({x: ball.x, y: ball.y, age: 1.0});
    if(trails.length > 5) trails.shift();
    
    TrailsDraw: for(let i=0; i<trails.length; i++) {
        let t = trails[i];
        t.age -= 0.15;
        if(t.age <= 0) continue ThreadsDraw;
        x.fillStyle = `rgba(0, 229, 255, ${t.age * 0.5})`;
        x.beginPath();
        x.arc(t.x, t.y, ball.radius * t.age, 0, Math.PI*2);
        x.fill();
    }

    // Ball physics movement
    ball.x += ball.dx * speedMult;
    ball.y += ball.dy * speedMult;

    // Boundary Collisions
    if (ball.x - ball.radius < 0) { ball.x = ball.radius; ball.dx *= -1; }
    if (ball.x + ball.radius > c.width) { ball.x = c.width - ball.radius; ball.dx *= -1; }
    if (ball.y - ball.radius < 0) { ball.y = ball.radius; ball.dy *= -1; }

    // --- Dynamic Paddle Collision ---
    if (ball.dy > 0 && 
        ball.y + ball.radius >= paddle.y && 
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.x >= paddle.x && 
        ball.x <= paddle.x + paddle.width) {
        
        ball.y = paddle.y - ball.radius;
        ball.dy *= -1;
        
        // Add dynamic spin logic based on hit position
        let hitPoint = ball.x - (paddle.x + paddle.width / 2);
        // Gives horizontal velocity from -6 to 6
        ball.dx = (hitPoint / (paddle.width / 2)) * 6; 
        
        score += 10;
        speedMult += 0.05; // Continuously speed up!
        
        updateHUD();
        
        // Paddle hit bump logic
        paddle.y += 3;
        setTimeout(() => paddle.y -= 3, 50);
    }

    // Floor drop (Missed logic)
    if (ball.y + ball.radius > c.height) {
        lives--;
        updateHUD();
        
        // Red flash sequence
        c.style.transform = "rotate(3deg)";
        c.style.boxShadow = "0 10px 30px rgba(255,0,0,0.5)";
        setTimeout(() => c.style.transform = "rotate(-3deg)", 50);
        setTimeout(() => {
            c.style.transform = "rotate(0deg)";
            c.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
        }, 100);

        if(lives <= 0) {
            endGame();
            return;
        } else {
            // Soft reset
            ball.x = 250; ball.y = 200;
            ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
            ball.dy = -4; 
            speedMult = 1 + (score * 0.005);
            trails = [];
        }
    }

    // --- Draw Functions ---
    // Paddle Base
    x.fillStyle = "#FF4081"; // Bright Pink
    x.beginPath();
    x.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 10);
    x.fill();
    // Inner paddle shading
    x.fillStyle = "#F50057";
    x.beginPath();
    x.roundRect(paddle.x + 5, paddle.y + 4, paddle.width - 10, paddle.height - 8, 5);
    x.fill();

    // The Shiny Neon Ball
    x.fillStyle = "#00E5FF"; // Bright Cyan
    x.beginPath();
    x.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    x.fill();
    
    x.fillStyle = "#fff"; // shine
    x.beginPath();
    x.arc(ball.x - 4, ball.y - 4, 3, 0, Math.PI*2);
    x.fill();
}

function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    c.style.display = 'block';
    hud.style.display = 'flex';
    
    score = 0;
    lives = 3;
    speedMult = 1;
    trails = [];
    
    ball.x = 250; ball.y = 200;
    ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -4; // Launches upwards
    
    updateHUD();
    
    isPlaying = true;
    requestAnimationFrame(render);
}

function endGame() {
    isPlaying = false;
    cancelAnimationFrame(animationId);
    
    c.style.display = 'none';
    hud.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    
    let hs = localStorage.getItem('paddleBounceHS') || 0;
    if(score > hs) {
        localStorage.setItem('paddleBounceHS', score);
        hs = score;
    }
    
    finalScoreText.innerHTML = `You kept the ball alive for <strong>${score}</strong> points!<br>Best Record: <strong>${hs}</strong>`;
}

if(startBtn) startBtn.addEventListener('click', startGame);
if(restartBtn) restartBtn.addEventListener('click', startGame);
