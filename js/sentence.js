/* =========================================================================
   Sentence Builder Game Logic
   ========================================================================= */

const sentencesDB = [
    "I like apples",
    "She has a dog",
    "He runs very fast",
    "The cat is black",
    "We go to school",
    "They play in the park",
    "I can read a book",
    "The sun shines bright",
    "My mom loves me",
    "The bird sings a song"
];

let sbCurrentRound = 0;
let sbStars = 0;
const totalSbRounds = sentencesDB.length;

// DOM Elements
const sbWordsContainer = document.getElementById('sb-words-container');
const sbDropzoneContainer = document.getElementById('sb-dropzone-container');
const sbRoundEl = document.getElementById('sb-round');
const sbStarsEl = document.getElementById('sb-stars');
const btnSbCheck = document.getElementById('btn-sb-check');
const sbWinMsg = document.getElementById('sb-win-msg');
const sbFinalScore = document.getElementById('sb-final-score');
const btnRestartSb = document.getElementById('btn-restart-sb');

// Initialize the game
function initSentenceGame() {
    if (!sbWordsContainer) return;

    sbCurrentRound = 0;
    sbStars = 0;

    sbWinMsg.style.display = 'none';
    btnSbCheck.style.display = 'inline-block';
    document.querySelector('.sentence-builder-area').style.display = 'block';

    updateSbScoreboard();
    startSbRound();
}

// Start a specific round
function startSbRound() {
    if (sbCurrentRound >= totalSbRounds) {
        endSbGame();
        return;
    }

    sbWordsContainer.innerHTML = '';
    sbDropzoneContainer.innerHTML = '';
    btnSbCheck.style.display = 'inline-block';
    btnSbCheck.textContent = 'Check Answer';
    btnSbCheck.disabled = false;
    btnSbCheck.style.backgroundColor = '';

    const targetSentence = sentencesDB[sbCurrentRound];
    const words = targetSentence.split(' ');

    // Shuffle words
    const shuffledWords = [...words].sort(() => 0.5 - Math.random());

    // Create draggables
    shuffledWords.forEach((word, index) => {
        const wordEl = document.createElement('div');
        wordEl.classList.add('sb-word');
        wordEl.textContent = word;
        wordEl.setAttribute('draggable', true);
        wordEl.id = `sb-word-${index}`;

        // Drag Events
        wordEl.addEventListener('dragstart', handleSbDragStart);
        wordEl.addEventListener('dragend', handleSbDragEnd);

        sbWordsContainer.appendChild(wordEl);
    });

    // Create dropzones
    words.forEach((_, index) => {
        const zoneEl = document.createElement('div');
        zoneEl.classList.add('sb-dropzone');
        zoneEl.dataset.index = index;

        // Drop Events
        zoneEl.addEventListener('dragover', handleSbDragOver);
        zoneEl.addEventListener('dragleave', handleSbDragLeave);
        zoneEl.addEventListener('drop', handleSbDrop);

        sbDropzoneContainer.appendChild(zoneEl);
    });

    // Allow dropping back to the container
    sbWordsContainer.addEventListener('dragover', handleSbDragOver);
    sbWordsContainer.addEventListener('dragleave', handleSbDragLeave);
    sbWordsContainer.addEventListener('drop', handleSbDropToContainer);

    updateSbScoreboard();
}

function updateSbScoreboard() {
    if (sbRoundEl) sbRoundEl.textContent = Math.min(sbCurrentRound + 1, totalSbRounds);
    if (sbStarsEl) sbStarsEl.textContent = sbStars;
}

// --- Drag and Drop Handlers ---
let draggedSbWord = null;

function handleSbDragStart(e) {
    draggedSbWord = this;
    setTimeout(() => this.classList.add('dragging'), 0);

    // Necessary for Firefox
    if (e.dataTransfer) {
        e.dataTransfer.setData('text/plain', this.id);
        e.dataTransfer.effectAllowed = 'move';
    }

    if (window.playSound) window.playSound('pop');
}

function handleSbDragEnd() {
    this.classList.remove('dragging');
    draggedSbWord = null;

    // clean up dropzones visuals
    document.querySelectorAll('.sb-dropzone').forEach(z => z.classList.remove('drag-over'));
    sbWordsContainer.classList.remove('drag-over');
}

function handleSbDragOver(e) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

    if (this.classList.contains('sb-dropzone') && !this.hasChildNodes()) {
        this.classList.add('drag-over');
    } else if (this === sbWordsContainer) {
        // Only allow dropping if it's not the container itself
        e.dataTransfer.dropEffect = 'move';
    }
}

function handleSbDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleSbDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    if (draggedSbWord && !this.hasChildNodes()) {
        this.appendChild(draggedSbWord);
        if (window.playSound) window.playSound('pop');
    }
}

function handleSbDropToContainer(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    if (draggedSbWord) {
        sbWordsContainer.appendChild(draggedSbWord);
        if (window.playSound) window.playSound('pop');
    }
}


// --- Check Answer ---
if (btnSbCheck) {
    btnSbCheck.addEventListener('click', checkSbAnswer);
}

function checkSbAnswer() {
    const targetSentence = sentencesDB[sbCurrentRound];

    // Gather words from dropzones in order
    const dropzones = Array.from(sbDropzoneContainer.children);
    let constructedSentence = [];
    let isComplete = true;

    dropzones.forEach(zone => {
        if (zone.children.length > 0) {
            constructedSentence.push(zone.children[0].textContent);
        } else {
            isComplete = false;
        }
    });

    if (!isComplete) {
        if (window.playSound) window.playSound("Please fill all the boxes first");
        return;
    }

    const currentStr = constructedSentence.join(' ');

    if (currentStr === targetSentence) {
        // Correct
        if (window.playSound) window.playSound("Correct! Great job!");
        if (window.addStars) window.addStars(1);
        sbStars++;
        updateSbScoreboard();

        btnSbCheck.textContent = 'Correct!';
        btnSbCheck.style.backgroundColor = 'var(--card-green)';
        btnSbCheck.disabled = true;

        setTimeout(() => {
            sbCurrentRound++;
            startSbRound();
        }, 2000);

    } else {
        // Incorrect
        if (window.playSound) window.playSound("Oops, try again!");

        sbDropzoneContainer.classList.add('shake');
        setTimeout(() => {
            sbDropzoneContainer.classList.remove('shake');
        }, 500);
    }
}

function endSbGame() {
    document.querySelector('.sentence-builder-area').style.display = 'none';
    btnSbCheck.style.display = 'none';
    sbWinMsg.style.display = 'block';

    if (sbFinalScore) sbFinalScore.textContent = sbStars;
    if (window.playSound) window.playSound("Wow! You are a sentence master!");
}

if (btnRestartSb) {
    btnRestartSb.addEventListener('click', initSentenceGame);
}

// Make init globally available so tab logic can call it
window.initSentenceGame = initSentenceGame;
