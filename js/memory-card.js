// Premium Memory Card Game Logic (Enhanced from User Snippet)
const memoryGrid = document.getElementById('memory-grid');
const startScreen = document.getElementById('start-screen');
const gameArea = document.getElementById('game-area');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const movesDisplay = document.getElementById('movesDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const finalScoreText = document.getElementById('final-score-text');

// Using cute animal emojis instead of raw letters
const emojis = ["🐶", "🐱", "🦊", "🐻", "🐼", "🐸", "🐵", "🦁"];
let cardsArray = [];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;
let time = 0;
let timerInterval;

function initGame() {
    // UI Reset
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameArea.style.display = 'block';
    
    // Variables Reset
    memoryGrid.innerHTML = '';
    matches = 0;
    moves = 0;
    time = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    
    movesDisplay.textContent = `Moves: ${moves}`;
    timeDisplay.textContent = `Time: ${time}s`;
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        time++;
        timeDisplay.textContent = `Time: ${time}s`;
    }, 1000);

    // Prepare and Shuffle Cards using Snippet Math.random logic
    cardsArray = [...emojis, ...emojis];
    cardsArray.sort(() => Math.random() - 0.5);

    // Generate accurate DOM Elements
    cardsArray.forEach((val) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.val = val;

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        cardFront.textContent = val; // Face

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back'); // Back

        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        card.addEventListener('click', flipCard);
        memoryGrid.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;
    
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.val === secondCard.dataset.val;

    if (isMatch) {
        disableCards();
        matches++;
        if (matches === emojis.length) {
            setTimeout(endGame, 700);
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    // Add small visual bump when matching
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function endGame() {
    clearInterval(timerInterval);
    gameArea.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    
    // Save to High Score
    let bestMoves = localStorage.getItem('memoryGameBestMoves') || Infinity;
    
    if (moves < bestMoves) {
        localStorage.setItem('memoryGameBestMoves', moves);
        bestMoves = moves;
        finalScoreText.innerHTML = `You found all pairs in <strong>${time} seconds</strong> requiring only <strong>${moves} moves</strong>!<br><span style="color:#FF6B6B">New Best Record!</span>`;
    } else {
        finalScoreText.innerHTML = `You found all pairs in <strong>${time} seconds</strong> using <strong>${moves} moves</strong>!<br>Best Record: ${bestMoves} moves`;
    }
    
    // Fun burst effect
    gameOverScreen.style.transform = "scale(0.8)";
    gameOverScreen.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    setTimeout(()=> gameOverScreen.style.transform = "scale(1)", 50);
}

if(startBtn) startBtn.addEventListener('click', initGame);
if(restartBtn) restartBtn.addEventListener('click', initGame);
