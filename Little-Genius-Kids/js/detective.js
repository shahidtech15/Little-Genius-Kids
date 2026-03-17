/* =========================================================================
   Word Detective Game Logic
   ========================================================================= */

// Database structured by difficulty level
const detectiveDB = {
    1: [
        { sentence: "The dog runs", type: "noun", target: "dog" },
        { sentence: "The dog runs", type: "verb", target: "runs" },
        { sentence: "She eats apples", type: "noun", target: "apples" },
        { sentence: "She eats apples", type: "verb", target: "eats" },
        { sentence: "The cat sleeps", type: "noun", target: "cat" },
        { sentence: "The cat sleeps", type: "verb", target: "sleeps" },
        { sentence: "We jump high", type: "verb", target: "jump" },
        { sentence: "He reads books", type: "noun", target: "books" },
        { sentence: "He reads books", type: "verb", target: "reads" },
        { sentence: "Birds fly fast", type: "noun", target: "Birds" },
        { sentence: "Birds fly fast", type: "verb", target: "fly" }
    ],
    2: [
        { sentence: "The big dog barks", type: "adjective", target: "big" },
        { sentence: "The big dog barks", type: "verb", target: "barks" },
        { sentence: "A red apple falls", type: "adjective", target: "red" },
        { sentence: "A red apple falls", type: "noun", target: "apple" },
        { sentence: "Fast cars go zoom", type: "adjective", target: "Fast" },
        { sentence: "Fast cars go zoom", type: "noun", target: "cars" },
        { sentence: "Cute kittens play toy", type: "adjective", target: "Cute" },
        { sentence: "Cute kittens play toy", type: "noun", target: "kittens" },
        { sentence: "My blue bird sings", type: "adjective", target: "blue" },
        { sentence: "My blue bird sings", type: "noun", target: "bird" },
        { sentence: "The loud baby cries", type: "adjective", target: "loud" }
    ],
    3: [
        { sentence: "The quick brown fox jumps over the lazy dog", type: "adjective", target: "quick" },
        { sentence: "The quick brown fox jumps over the lazy dog", type: "noun", target: "fox" },
        { sentence: "The quick brown fox jumps over the lazy dog", type: "verb", target: "jumps" },
        { sentence: "A small green frog hops on a big lily pad", type: "adjective", target: "small" },
        { sentence: "A small green frog hops on a big lily pad", type: "noun", target: "frog" },
        { sentence: "A small green frog hops on a big lily pad", type: "verb", target: "hops" },
        { sentence: "Two happy children play outside in the warm sun", type: "adjective", target: "happy" },
        { sentence: "Two happy children play outside in the warm sun", type: "noun", target: "children" },
        { sentence: "Two happy children play outside in the warm sun", type: "verb", target: "play" },
        { sentence: "The old gray cat sleeps on the soft rug", type: "adjective", target: "old" },
        { sentence: "The old gray cat sleeps on the soft rug", type: "noun", target: "rug" }
    ]
};

let wdCurrentLevel = 1;
let wdCurrentRound = 0;
let wdStars = 0;
let wdQuestions = [];

const MAX_WD_ROUNDS = 10;

// DOM Elements
const wdLevelSelect = document.getElementById('wd-level-select');
const wdArena = document.getElementById('wd-arena');
const wdSentenceContainer = document.getElementById('wd-sentence-container');
const wdTargetTypeEl = document.getElementById('wd-target-type');
const wdRoundEl = document.getElementById('wd-round');
const wdStarsEl = document.getElementById('wd-stars');
const wdFeedbackEl = document.getElementById('wd-feedback');
const wdWinMsg = document.getElementById('wd-win-msg');
const wdFinalScore = document.getElementById('wd-final-score');

// Init Game
function initDetectiveGame() {
    if (!wdLevelSelect) return;

    // Reset everything
    wdLevelSelect.style.display = 'block';
    wdArena.style.display = 'none';
    wdWinMsg.style.display = 'none';

    // Bind level buttons
    document.getElementById('btn-wd-lvl-1').onclick = () => startWdLevel(1);
    document.getElementById('btn-wd-lvl-2').onclick = () => startWdLevel(2);
    document.getElementById('btn-wd-lvl-3').onclick = () => startWdLevel(3);

    // Bind end screen buttons
    document.getElementById('btn-wd-menu').onclick = initDetectiveGame;
    document.getElementById('btn-wd-next').onclick = () => {
        if (wdCurrentLevel < 3) {
            startWdLevel(wdCurrentLevel + 1);
        } else {
            initDetectiveGame();
        }
    };
}

function startWdLevel(level) {
    wdCurrentLevel = level;
    wdCurrentRound = 0;
    wdStars = 0;

    // Get 10 random questions from this level's bank
    const bank = [...detectiveDB[level]];
    wdQuestions = bank.sort(() => 0.5 - Math.random()).slice(0, MAX_WD_ROUNDS);

    // Add fallback if bank is too small
    while (wdQuestions.length < MAX_WD_ROUNDS && bank.length > 0) {
        wdQuestions.push(bank[Math.floor(Math.random() * bank.length)]);
    }

    wdLevelSelect.style.display = 'none';
    wdWinMsg.style.display = 'none';
    wdArena.style.display = 'block';

    renderWdRound();
}

function renderWdRound() {
    wdFeedbackEl.innerHTML = '';

    if (wdCurrentRound >= MAX_WD_ROUNDS) {
        endWdLevel();
        return;
    }

    // Update scoreboard
    wdRoundEl.textContent = wdCurrentRound + 1;
    wdStarsEl.textContent = wdStars;

    // Get current question
    const q = wdQuestions[wdCurrentRound];
    wdTargetTypeEl.textContent = q.type;

    // Change color based on type
    if (q.type === 'noun') wdTargetTypeEl.style.color = 'var(--card-blue)';
    if (q.type === 'verb') wdTargetTypeEl.style.color = 'var(--card-red)';
    if (q.type === 'adjective') wdTargetTypeEl.style.color = 'var(--card-orange)';

    // Render words
    const words = q.sentence.split(' ');
    wdSentenceContainer.innerHTML = '';

    words.forEach(wordStr => {
        const punctuationRegex = /[.,!?]/g;
        const cleanWord = wordStr.replace(punctuationRegex, '');

        const btn = document.createElement('div');
        btn.classList.add('wd-word');
        btn.textContent = wordStr;

        btn.onclick = () => checkWdAnswer(cleanWord, q.target, btn);

        wdSentenceContainer.appendChild(btn);
    });
}

function checkWdAnswer(clickedString, targetString, btnElement) {
    // Disable all buttons to prevent double clicking during animation
    const allBtns = wdSentenceContainer.querySelectorAll('.wd-word');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    // Case insensitive comparison
    if (clickedString.toLowerCase() === targetString.toLowerCase()) {
        // Correct
        btnElement.classList.add('correct');
        wdFeedbackEl.innerHTML = '<span style="color: var(--card-green);">Correct! Great magnifying glass work! 🌟</span>';

        if (window.playSound) window.playSound('pop');
        if (window.addStars) window.addStars(1);

        wdStars++;
        wdStarsEl.textContent = wdStars;

        setTimeout(() => {
            wdCurrentRound++;
            renderWdRound();
        }, 1500);

    } else {
        // Incorrect
        btnElement.classList.add('incorrect');
        wdFeedbackEl.innerHTML = '<span style="color: var(--card-red);">Oops! That\'s not a ' + wdTargetTypeEl.textContent + '. Keep looking!</span>';

        if (window.playSound) window.playSound("Oops, try again!");

        setTimeout(() => {
            btnElement.classList.remove('incorrect');
            wdFeedbackEl.innerHTML = '';
            // Re-enable interactions
            allBtns.forEach(b => b.style.pointerEvents = 'auto');
        }, 1500);
    }
}

function endWdLevel() {
    wdArena.style.display = 'none';
    wdWinMsg.style.display = 'block';
    wdFinalScore.textContent = wdStars;

    if (window.playSound) window.playSound("Amazing! You solved the case!");

    const nextBtn = document.getElementById('btn-wd-next');
    if (wdCurrentLevel < 3) {
        nextBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'none';
    }
}

// Make globally available
window.initDetectiveGame = initDetectiveGame;
