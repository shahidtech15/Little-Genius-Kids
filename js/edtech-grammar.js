/* =========================================================================
   EdTech Grammar Game Module (Production Ready)
   ========================================================================= */

const EG_STATE = {
    db: null,
    currentTopic: null,
    currentLevel: 1, // 1 to 3
    score: 0,
    timerMode: false,
    timeLeft: 0,
    timerInterval: null,
    currentQuestion: null,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    questionsAsked: 0,
    maxQuestions: 10
};

// DOM Elements
const egDashboard = document.getElementById('eg-dashboard');
const egTopicSelect = document.getElementById('eg-topic-select');
const egArena = document.getElementById('eg-arena');
const egWinMsg = document.getElementById('eg-win-msg');
const egTopicDisplay = document.getElementById('eg-topic-display');
const egLevelDisplay = document.getElementById('eg-level-display');
const egScoreDisplay = document.getElementById('eg-score-display');
const egTimerDisplay = document.getElementById('eg-timer-display');
const egTimerContainer = document.getElementById('eg-timer-container');
const egQuestionText = document.getElementById('eg-question-text');
const egSentenceText = document.getElementById('eg-sentence-text');
const egOptionsContainer = document.getElementById('eg-options-container');
const egFeedback = document.getElementById('eg-feedback');
const egProgressFill = document.getElementById('eg-progress-fill');
const egTimerModeCheckbox = document.getElementById('eg-timer-mode');

// Initialization
async function initEdtechGrammarGame() {
    if (!egTopicSelect) return;

    // Load Database if not loaded
    if (!EG_STATE.db) {
        try {
            const response = await fetch('data/grammar_questions.json');
            EG_STATE.db = await response.json();
        } catch (e) {
            console.error("Failed to load grammar database. Falling back to default data.", e);
            // Fallback just in case local fetch fails due to CORS on file://
            EG_STATE.db = {
                "nouns": {
                    "level1": [{ "q": "Find the NOUN.", "sentenceMsg": "The cat sleeps.", "options": ["The", "cat", "sleeps"], "answer": "cat" }]
                },
                "verbs": {
                    "level1": [{ "q": "Find the VERB.", "sentenceMsg": "Birds fly.", "options": ["Birds", "fly"], "answer": "fly" }]
                },
                "adjectives": {
                    "level1": [{ "q": "Find the ADJECTIVE.", "sentenceMsg": "A happy boy.", "options": ["A", "happy", "boy"], "answer": "happy" }]
                }
            };
        }
    }

    resetEGState();

    // Bind topic buttons
    document.getElementById('btn-eg-nouns').onclick = () => startEGTopic('nouns');
    document.getElementById('btn-eg-verbs').onclick = () => startEGTopic('verbs');
    document.getElementById('btn-eg-adjectives').onclick = () => startEGTopic('adjectives');
    document.getElementById('btn-eg-menu').onclick = initEdtechGrammarGame;
}

function resetEGState() {
    clearEGTimer();
    egTopicSelect.style.display = 'block';
    egDashboard.style.display = 'none';
    egArena.style.display = 'none';
    egWinMsg.style.display = 'none';
    EG_STATE.score = 0;
    EG_STATE.consecutiveCorrect = 0;
    EG_STATE.consecutiveIncorrect = 0;
    EG_STATE.questionsAsked = 0;
    EG_STATE.currentLevel = 1;
}

function startEGTopic(topic) {
    EG_STATE.currentTopic = topic;
    EG_STATE.timerMode = egTimerModeCheckbox.checked;

    egTopicSelect.style.display = 'none';
    egDashboard.style.display = 'flex';
    egArena.style.display = 'block';
    egWinMsg.style.display = 'none';

    egTopicDisplay.textContent = topic.toUpperCase();
    egScoreDisplay.textContent = EG_STATE.score;

    if (EG_STATE.timerMode) {
        egTimerContainer.style.display = 'block';
        startEGTimer(60); // 60 seconds for challenge mode
    } else {
        egTimerContainer.style.display = 'none';
    }

    loadNextEGQuestion();
}

function loadNextEGQuestion() {
    egFeedback.innerHTML = '';

    // Update Progress Bar
    const percent = (EG_STATE.questionsAsked / EG_STATE.maxQuestions) * 100;
    egProgressFill.style.width = `${percent}%`;

    // Check Win Condition (Max questions or timer ran out handled separately)
    if (EG_STATE.questionsAsked >= EG_STATE.maxQuestions) {
        endEGTopic(true);
        return;
    }

    egLevelDisplay.textContent = EG_STATE.currentLevel;

    // Get pool for current level (fallback to level 1 if missing)
    let levelKey = `level${EG_STATE.currentLevel}`;
    let pool = EG_STATE.db[EG_STATE.currentTopic][levelKey];
    if (!pool || pool.length === 0) {
        EG_STATE.currentLevel = 1;
        levelKey = "level1";
        pool = EG_STATE.db[EG_STATE.currentTopic][levelKey];
    }

    // Pick random question
    const randomIndex = Math.floor(Math.random() * pool.length);
    EG_STATE.currentQuestion = pool[randomIndex];

    // Render Question
    egQuestionText.textContent = EG_STATE.currentQuestion.q;
    egSentenceText.textContent = EG_STATE.currentQuestion.sentenceMsg;

    // Render Options
    egOptionsContainer.innerHTML = '';
    // Shuffle options
    const options = [...EG_STATE.currentQuestion.options].sort(() => 0.5 - Math.random());

    options.forEach(opt => {
        const btn = document.createElement('div');
        btn.classList.add('eg-option-btn');
        btn.textContent = opt;
        btn.onclick = () => handleEGAnswer(opt, btn);
        egOptionsContainer.appendChild(btn);
    });

    EG_STATE.questionsAsked++;
}

function handleEGAnswer(selectedText, btnElement) {
    // Disable buttons
    const allBtns = egOptionsContainer.querySelectorAll('.eg-option-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    const isCorrect = selectedText === EG_STATE.currentQuestion.answer;

    if (isCorrect) {
        btnElement.classList.add('correct');
        egFeedback.innerHTML = '<span style="color: var(--card-green);">Excellent! 🌟</span>';
        if (window.playSound) window.playSound('pop');

        // Base score + timer bonus + level multiplier
        let pointsEarned = 10 * EG_STATE.currentLevel;
        if (EG_STATE.timerMode && EG_STATE.timeLeft > 0) {
            pointsEarned += 5;
        }
        EG_STATE.score += pointsEarned;
        egScoreDisplay.textContent = EG_STATE.score;

        // Adaptive Difficulty Logging
        EG_STATE.consecutiveCorrect++;
        EG_STATE.consecutiveIncorrect = 0;

        if (EG_STATE.consecutiveCorrect >= 3 && EG_STATE.currentLevel < 3) {
            EG_STATE.currentLevel++;
            EG_STATE.consecutiveCorrect = 0;
            egFeedback.innerHTML += ` <br><span style="font-size:1.2rem; color:var(--accent-color);">Level Up! 🚀</span>`;
            if (window.playSound) setTimeout(() => window.playSound('ta-da'), 500);
        }

    } else {
        btnElement.classList.add('incorrect');
        // Find correct button and highlight it
        allBtns.forEach(b => {
            if (b.textContent === EG_STATE.currentQuestion.answer) {
                b.style.border = "3px solid var(--card-green)";
                b.style.backgroundColor = "#e8f5e9";
            }
        });

        egFeedback.innerHTML = '<span style="color: var(--card-red);">Not quite. Learn from this!</span>';
        if (window.playSound) window.playSound("Oops, try again!");

        // Adaptive Difficulty Logging
        EG_STATE.consecutiveIncorrect++;
        EG_STATE.consecutiveCorrect = 0;

        if (EG_STATE.consecutiveIncorrect >= 2 && EG_STATE.currentLevel > 1) {
            EG_STATE.currentLevel--;
            EG_STATE.consecutiveIncorrect = 0;
            egFeedback.innerHTML += ` <br><span style="font-size:1.2rem; color:var(--card-orange);">Dropping difficulty slightly to help.</span>`;
        }
    }

    setTimeout(loadNextEGQuestion, 2000);
}

function startEGTimer(seconds) {
    EG_STATE.timeLeft = seconds;
    egTimerDisplay.textContent = `${EG_STATE.timeLeft}s`;

    EG_STATE.timerInterval = setInterval(() => {
        EG_STATE.timeLeft--;
        egTimerDisplay.textContent = `${EG_STATE.timeLeft}s`;

        if (EG_STATE.timeLeft <= 10) {
            egTimerDisplay.style.color = 'darkred';
            egTimerDisplay.style.animation = 'shake 1s infinite';
        }

        if (EG_STATE.timeLeft <= 0) {
            clearEGTimer();
            endEGTopic(false);
        }
    }, 1000);
}

function clearEGTimer() {
    if (EG_STATE.timerInterval) {
        clearInterval(EG_STATE.timerInterval);
        EG_STATE.timerInterval = null;
    }
    egTimerDisplay.style.color = 'var(--card-red)';
    egTimerDisplay.style.animation = 'none';
}

function endEGTopic(completed) {
    clearEGTimer();
    egDashboard.style.display = 'none';
    egArena.style.display = 'none';
    egWinMsg.style.display = 'block';

    const finalScoreEl = document.getElementById('eg-final-score');
    finalScoreEl.textContent = EG_STATE.score;

    const badgeContainer = document.getElementById('eg-badge-container');

    if (completed) {
        if (window.playSound) window.playSound("Amazing!");
        if (EG_STATE.score > 200) {
            badgeContainer.innerHTML = '🥇 Platinum Scholar';
        } else if (EG_STATE.score > 100) {
            badgeContainer.innerHTML = '🥈 Gold Master';
        } else {
            badgeContainer.innerHTML = '🥉 Silver Learner';
        }
        createConfetti();
    } else {
        badgeContainer.innerHTML = '⏰ Time\'s Up!';
    }

    // Save Progress via localStorage
    saveEGProgress();

    // Trigger Parent Hook Event
    triggerParentHook('lg:topicComplete', {
        topic: EG_STATE.currentTopic,
        score: EG_STATE.score,
        completed: completed,
        timerMode: EG_STATE.timerMode
    });
}

function saveEGProgress() {
    try {
        let progress = JSON.parse(localStorage.getItem('lg_user_progress')) || {};
        if (!progress.grammar) progress.grammar = {};

        // Track high score per topic
        const prevHigh = progress.grammar[EG_STATE.currentTopic] || 0;
        if (EG_STATE.score > prevHigh) {
            progress.grammar[EG_STATE.currentTopic] = EG_STATE.score;
        }

        progress.grammar.lastPlayed = new Date().toISOString();
        localStorage.setItem('lg_user_progress', JSON.stringify(progress));
    } catch (e) {
        console.warn("Could not save progress to localStorage", e);
    }
}

function triggerParentHook(eventName, dataPayload) {
    const event = new CustomEvent(eventName, {
        detail: dataPayload
    });
    document.dispatchEvent(event);
    console.log(`[Parent Hook] Triggered ${eventName}:`, dataPayload);
}

// Simple localized confetti fallback if window.createConfetti doesn't exist
function createConfetti() {
    if (window.createConfetti && typeof window.createConfetti === 'function') {
        window.createConfetti();
    } else {
        console.log("Confetti playing... 🎉");
    }
}

window.initEdtechGrammarGame = initEdtechGrammarGame;
