// Reaction Ninja Engine (Replaces basic User Javascript)
const reactionArea = document.getElementById('reaction-area');
const iconElement = document.getElementById('icon');
const mainText = document.getElementById('main-text');
const subText = document.getElementById('sub-text');
const bestTimeDisplay = document.getElementById('bestTimeDisplay');

let state = 'waiting'; 
// Valid states: 'waiting', 'ready' (red), 'go' (green), 'result' (purple)

let timeoutId;
let startTime;

function init() {
    let best = localStorage.getItem('reactionNinjaBest') || '--';
    bestTimeDisplay.textContent = `Best: ${best} ms`;
    resetToWaiting();
}

function resetToWaiting() {
    state = 'waiting';
    reactionArea.className = 'reaction-area state-waiting';
    iconElement.className = 'fa-solid fa-play';
    mainText.textContent = 'Start';
    subText.textContent = 'Click anywhere to begin!';
}

function startReadyPhase() {
    state = 'ready';
    reactionArea.className = 'reaction-area state-ready';
    iconElement.className = 'fa-solid fa-hand';
    mainText.textContent = 'Wait for Green...';
    subText.textContent = 'Do not click yet!';
    
    // Random delay between 1.5 seconds and 4.5 seconds mapping to snippet Math.random() logic
    let delay = Math.random() * 3000 + 1500; 
    timeoutId = setTimeout(() => {
        if(state === 'ready') triggerGo();
    }, delay);
}

function triggerGo() {
    state = 'go';
    reactionArea.className = 'reaction-area state-go';
    iconElement.className = 'fa-solid fa-bolt';
    mainText.textContent = 'TAP NOW!';
    subText.textContent = 'Quick!';
    startTime = Date.now();
}

function handleTooEarly() {
    clearTimeout(timeoutId);
    state = 'result';
    reactionArea.className = 'reaction-area state-result';
    iconElement.className = 'fa-solid fa-triangle-exclamation';
    mainText.textContent = 'Too Soon!';
    subText.textContent = 'You clicked before it turned green. Tap to try again!';
}

function handleResult() {
    let reactionTime = Date.now() - startTime;
    state = 'result';
    reactionArea.className = 'reaction-area state-result';
    
    // Assigning cute child feedback ratings based on MS breakpoints
    let rating = '';
    if(reactionTime < 250) rating = 'Ninja Reflexes! 🥷';
    else if(reactionTime < 350) rating = 'Lightning Fast! ⚡';
    else if(reactionTime < 500) rating = 'Great Job! 🐆';
    else rating = 'Keep Practicing! 🐢';
    
    iconElement.className = 'fa-solid fa-stopwatch';
    mainText.textContent = `${reactionTime} ms`;
    subText.textContent = `${rating} (Tap to restart)`;
    
    // Hard check localstorage
    let best = localStorage.getItem('reactionNinjaBest');
    if(!best || reactionTime < parseInt(best)) {
        localStorage.setItem('reactionNinjaBest', reactionTime);
        bestTimeDisplay.textContent = `Best: ${reactionTime} ms`;
        
        // Small visual celebration for high scores
        reactionArea.style.transform = "scale(1.05)";
        setTimeout(() => reactionArea.style.transform = "scale(1)", 200);
    }
}

// Master Interaction Router
function routeInteraction(e) {
    if(e && e.type.includes('touch')) e.preventDefault();
    
    if(state === 'waiting') {
        startReadyPhase();
    } else if(state === 'ready') {
        handleTooEarly();
    } else if(state === 'go') {
        handleResult();
    } else if(state === 'result') {
        startReadyPhase(); // Skip 'waiting' phase and go straight back to Red loop to allow fast retries
    }
}

if(reactionArea) {
    reactionArea.addEventListener('mousedown', routeInteraction);
    reactionArea.addEventListener('touchstart', routeInteraction, {passive: false});
}

// Start sequence
init();
