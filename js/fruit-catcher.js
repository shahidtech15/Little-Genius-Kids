// Fruit Catcher Engine (Upgraded from User Snippet)
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
let lives = 5;
let player = { x: 210, width: 80, height: 40 };
let items = [];
let particles = [];
let frameCount = 0;
const fruits = ["🍎", "🍊", "🍌", "🍉", "🍇", "🍓"];

// Clouds logic for background
let clouds = [
    {x: 50, y: 50, s: 1, speed: 0.3},
    {x: 300, y: 120, s: 0.8, speed: 0.2},
    {x: 100, y: 250, s: 1.2, speed: 0.4}
];

function getMousePos(e) {
    let rect = c.getBoundingClientRect();
    let scaleX = c.width / rect.width;
    let clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    // Center the basket on the mouse/finger and lock it within screen bounds
    let targetX = (clientX - rect.left) * scaleX - player.width / 2;
    return Math.max(0, Math.min(c.width - player.width, targetX));
}

if(c) {
    c.addEventListener('mousemove', e => {
        if(isPlaying) player.x = getMousePos(e);
    });
    c.addEventListener('touchmove', e => {
        if(isPlaying) {
            e.preventDefault(); // Stop scrolling
            player.x = getMousePos(e);
        }
    }, {passive: false});
}

function spawnItem() {
    items.push({
        x: Math.random() * (c.width - 40) + 20,
        y: -30,
        speed: 2 + Math.random() * 2 + (score * 0.05), // Dynamic scaling
        fruit: fruits[Math.floor(Math.random() * fruits.length)],
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.05
    });
}

// Particle effect for catching
function createCatchEffect(px, py) {
    for(let i=0; i<10; i++) {
        particles.push({
            x: px, y: py,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 1) * 8, // mostly going UP
            life: 1.0,
            color: ["#FFEB3B", "#ffffff", "#FF9800"][Math.floor(Math.random()*3)]
        });
    }
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
    
    // Clear and draw sky
    x.fillStyle = "#4fc3f7";
    x.fillRect(0, 0, c.width, c.height);

    // Draw Clouds
    x.fillStyle = "rgba(255,255,255,0.7)";
    clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if(cloud.x > c.width + 50) cloud.x = -100;

        x.beginPath();
        x.arc(cloud.x, cloud.y, 30 * cloud.s, 0, Math.PI*2);
        x.arc(cloud.x + 25*cloud.s, cloud.y - 15*cloud.s, 35 * cloud.s, 0, Math.PI*2);
        x.arc(cloud.x + 50*cloud.s, cloud.y, 30 * cloud.s, 0, Math.PI*2);
        x.fill();
    });

    // Handle Items
    if(frameCount % (Math.max(20, 60 - score)) === 0) {
        spawnItem();
    }
    frameCount++;

    // Draw and Update Items
    for(let i = items.length - 1; i >= 0; i--) {
        let it = items[i];
        it.y += it.speed;
        it.rotation += it.rotSpeed;

        // Draw Fruit
        x.save();
        x.translate(it.x, it.y);
        x.rotate(it.rotation);
        x.font = "30px Arial";
        x.textAlign = "center";
        x.textBaseline = "middle";
        x.fillText(it.fruit, 0, 0);
        x.restore();

        // Collision Check (Basket sits at Y: 430, Height: 40)
        let basketHitboxTop = 430;
        if(it.y + 15 > basketHitboxTop && it.y < basketHitboxTop + 20) {
            // Check horizontal bounds (Generous bounds)
            if(it.x + 15 > player.x && it.x - 15 < player.x + player.width) {
                // Caught!
                score += 10;
                updateHUD();
                createCatchEffect(it.x, basketHitboxTop);
                items.splice(i, 1);
                
                // Basket bounce effect
                c.style.transform = "scale(0.98)";
                setTimeout(()=> c.style.transform = "scale(1)", 50);
                continue;
            }
        }

        // Dropped Check
        if(it.y > c.height + 30) {
            items.splice(i, 1);
            lives--;
            updateHUD();
            
            // Screen shake
            c.style.transform = "rotate(2deg)";
            setTimeout(()=> c.style.transform = "rotate(-2deg)", 50);
            setTimeout(()=> c.style.transform = "rotate(0deg)", 100);

            if(lives <= 0) {
                endGame();
                return;
            }
        }
    }

    // Particles
    for(let i=particles.length-1; i>=0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // Gravity
        p.life -= 0.05;
        
        if(p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        x.globalAlpha = p.life;
        x.fillStyle = p.color;
        x.beginPath();
        x.arc(p.x, p.y, 4, 0, Math.PI*2);
        x.fill();
        x.globalAlpha = 1.0;
    }

    // Draw Player (Basket)
    let bx = player.x;
    let by = 430;
    let bw = player.width;
    let bh = player.height;

    // Basket Body
    x.fillStyle = "#8D6E63"; // Brown
    x.beginPath();
    x.moveTo(bx + 5, by);
    x.lineTo(bx + bw - 5, by);
    x.lineTo(bx + bw, by + bh);
    x.lineTo(bx, by + bh);
    x.closePath();
    x.fill();
    // Basket Lines
    x.strokeStyle = "#5D4037";
    x.lineWidth = 3;
    x.stroke();
    
    // Weave pattern
    x.beginPath();
    x.moveTo(bx + 5, by + 10); x.lineTo(bx + bw - 5, by + 10);
    x.moveTo(bx + 5, by + 25); x.lineTo(bx + bw - 5, by + 25);
    x.stroke();
}

function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    c.style.display = 'block';
    hud.style.display = 'flex';
    
    score = 0;
    lives = 5;
    items = [];
    particles = [];
    frameCount = 0;
    
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
    
    let hs = localStorage.getItem('fruitCatcherHS') || 0;
    if(score > hs) {
        localStorage.setItem('fruitCatcherHS', score);
        hs = score;
    }
    
    finalScoreText.innerHTML = `You caught <strong>${score}</strong> points worth of fruit!<br>Best Score: <strong>${hs}</strong>`;
}

if(startBtn) startBtn.addEventListener('click', startGame);
if(restartBtn) restartBtn.addEventListener('click', startGame);
