/**
 * Grammar Adventure Game Logic
 * Little Genius Kids Learning Platform
 */

document.addEventListener('DOMContentLoaded', () => {
    // Game State
    let grammarLevel = 1;
    let grammarScore = 0;
    let currentQuestionIndex = 0;
    let unlockedLevels = JSON.parse(localStorage.getItem('littleGeniusGrammarLevels')) || [1];
    let isGrammarTransitioning = false;

    // DOM Elements
    const levelSelectView = document.getElementById('grammar-level-select');
    const quizView = document.getElementById('grammar-quiz-view');
    const winMsgView = document.getElementById('grammar-win-msg');

    const levelsContainer = document.querySelector('.grammar-levels');

    const levelTitle = document.getElementById('grammar-level-title');
    const scoreDisplay = document.getElementById('grammar-score');
    const qnumDisplay = document.getElementById('grammar-qnum');
    const emojiDisplay = document.getElementById('grammar-emoji');
    const questionText = document.getElementById('grammar-question-text');
    const optionsContainer = document.getElementById('grammar-options');
    const feedbackText = document.getElementById('grammar-feedback');

    const finalScore = document.getElementById('grammar-final-score');
    const btnMenu = document.getElementById('btn-grammar-menu');
    const btnNext = document.getElementById('btn-grammar-next');

    // Make init function global so games.js can call it when the tab is clicked
    window.initGrammarGame = function () {
        levelSelectView.style.display = 'block';
        quizView.style.display = 'none';
        winMsgView.style.display = 'none';
        renderLevelSelect();
    };

    // Grammar Database (5 Levels, 10 Questions each)
    const grammarDB = [
        {
            level: 1,
            title: "Nouns (Naming Words)",
            emoji: "🍎",
            questions: [
                { q: "Which word is an animal?", options: ["Run", "Dog", "Blue"], answer: "Dog", emoji: "🐶" },
                { q: "Which word is a place?", options: ["Park", "Eat", "Happy"], answer: "Park", emoji: "🏞️" },
                { q: "Which word is a thing?", options: ["Car", "Sing", "Fast"], answer: "Car", emoji: "🚗" },
                { q: "Which of these is a person?", options: ["Teacher", "Apple", "Jump"], answer: "Teacher", emoji: "👩‍🏫" },
                { q: "Find the noun in: 'The cat sleeps.'", options: ["The", "cat", "sleeps"], answer: "cat", emoji: "🐱" },
                { q: "Find the noun in: 'I see a bird.'", options: ["I", "see", "bird"], answer: "bird", emoji: "🐦" },
                { q: "Which word is a fruit?", options: ["Banana", "Play", "Sad"], answer: "Banana", emoji: "🍌" },
                { q: "Which word is a toy?", options: ["Ball", "Read", "Green"], answer: "Ball", emoji: "⚽" },
                { q: "What is a book?", options: ["A Place", "A Thing", "A Person"], answer: "A Thing", emoji: "📚" },
                { q: "Which word describes a person?", options: ["Doctor", "Tree", "House"], answer: "Doctor", emoji: "👨‍⚕️" }
            ]
        },
        {
            level: 2,
            title: "Verbs (Action Words)",
            emoji: "🏃",
            questions: [
                { q: "Which word is an action?", options: ["Jump", "Cat", "Red"], answer: "Jump", emoji: "🦘" },
                { q: "What do you do with water?", options: ["Drink", "Sun", "Book"], answer: "Drink", emoji: "💧" },
                { q: "Find the action: 'The dog runs.'", options: ["The", "dog", "runs"], answer: "runs", emoji: "🐕" },
                { q: "Which word means to move fast?", options: ["Slow", "Run", "Tree"], answer: "Run", emoji: "🏃" },
                { q: "What do you do in a bed?", options: ["Sleep", "Table", "Sky"], answer: "Sleep", emoji: "🛏️" },
                { q: "Which of these is an action?", options: ["Boy", "Play", "House"], answer: "Play", emoji: "🎮" },
                { q: "What do you do with a pencil?", options: ["Write", "Paper", "Hat"], answer: "Write", emoji: "✏️" },
                { q: "Find the verb: 'Birds fly high.'", options: ["Birds", "fly", "high"], answer: "fly", emoji: "🦅" },
                { q: "What is the action word?", options: ["Eat", "Food", "Plate"], answer: "Eat", emoji: "🍽️" },
                { q: "Which word describes making music?", options: ["Sing", "Song", "Loud"], answer: "Sing", emoji: "🎤" }
            ]
        },
        {
            level: 3,
            title: "Adjectives (Describing Words)",
            emoji: "✨",
            questions: [
                { q: "Which word describes a color?", options: ["Blue", "Box", "Run"], answer: "Blue", emoji: "🔵" },
                { q: "Which size word is this?", options: ["Big", "Dog", "Bark"], answer: "Big", emoji: "🐘" },
                { q: "Find the describing word: 'A happy baby.'", options: ["A", "happy", "baby"], answer: "happy", emoji: "👶" },
                { q: "How does ice feel?", options: ["Cold", "Hot", "Water"], answer: "Cold", emoji: "🧊" },
                { q: "Which word describes fire?", options: ["Hot", "Snow", "Dark"], answer: "Hot", emoji: "🔥" },
                { q: "Find the adjective: 'The tall tree.'", options: ["The", "tall", "tree"], answer: "tall", emoji: "🌲" },
                { q: "How does a pillow feel?", options: ["Soft", "Hard", "Rock"], answer: "Soft", emoji: "☁️" },
                { q: "What word describes a fast car?", options: ["Slow", "Quick", "Walk"], answer: "Quick", emoji: "🏎️" },
                { q: "Which word describes a sunny day?", options: ["Bright", "Rain", "Night"], answer: "Bright", emoji: "☀️" },
                { q: "Find the describing word: 'A sweet apple.'", options: ["sweet", "apple", "A"], answer: "sweet", emoji: "🍎" }
            ]
        },
        {
            level: 4,
            title: "Singular & Plural (One or Many)",
            emoji: "📦",
            questions: [
                { q: "What is more than one cat?", options: ["Cats", "Cat", "Kittens"], answer: "Cats", emoji: "🐱🐱" },
                { q: "What is one dog called?", options: ["Dogs", "Dog", "Puppies"], answer: "Dog", emoji: "🐶" },
                { q: "What is more than one box?", options: ["Boxs", "Boxes", "Box"], answer: "Boxes", emoji: "📦📦" },
                { q: "Which means 'one'?", options: ["Apples", "Apple", "More"], answer: "Apple", emoji: "🍎" },
                { q: "Which word means 'many'?", options: ["Tree", "Trees", "Oak"], answer: "Trees", emoji: "🌳🌳" },
                { q: "What is the plural of 'bus'?", options: ["Buss", "Buses", "Bus"], answer: "Buses", emoji: "🚌🚌" },
                { q: "Which means just one?", options: ["Birds", "Friends", "Car"], answer: "Car", emoji: "🚗" },
                { q: "What is more than one pencil?", options: ["Pencils", "Pencil", "Pen"], answer: "Pencils", emoji: "✏️✏️" },
                { q: "Singular or Plural: 'Toys'?", options: ["Singular (One)", "Plural (Many)", "Action"], answer: "Plural (Many)", emoji: "🧸🧸" },
                { q: "Singular or Plural: 'Star'?", options: ["Singular (One)", "Plural (Many)", "Describing"], answer: "Singular (One)", emoji: "⭐" }
            ]
        },
        {
            level: 5,
            title: "Simple Sentences",
            emoji: "✍️",
            questions: [
                { q: "Which is a complete sentence?", options: ["The big dog.", "The dog barks.", "Barks loud."], answer: "The dog barks.", emoji: "🐕" },
                { q: "What comes at the end of a sentence?", options: ["Capital letter", "Period (.)", "Space"], answer: "Period (.)", emoji: "📝" },
                { q: "How should a sentence start?", options: ["Capital letter", "Small letter", "Number"], answer: "Capital letter", emoji: "🔠" },
                { q: "Complete the sentence: 'I like to __.'", options: ["Play", "Red", "Cat"], answer: "Play", emoji: "🏃" },
                { q: "Which is a question?", options: ["I am happy.", "Are you happy?", "The happy boy."], answer: "Are you happy?", emoji: "❓" },
                { q: "Complete the sentence: 'The bird can __.'", options: ["Fly", "Stone", "Blue"], answer: "Fly", emoji: "🐦" },
                { q: "Which is a sentence?", options: ["A red apple.", "Eating an apple.", "I eat an apple."], answer: "I eat an apple.", emoji: "🍎" },
                { q: "Find the correct sentence.", options: ["Sun the shines.", "The sun shines.", "Shines the sun."], answer: "The sun shines.", emoji: "☀️" },
                { q: "Complete it: 'A cow gives __.'", options: ["Milk", "Bark", "Eggs"], answer: "Milk", emoji: "🥛" },
                { q: "Which sentence makes sense?", options: ["Fish swim in water.", "Water swim in fish.", "In swim water fish."], answer: "Fish swim in water.", emoji: "🐟" }
            ]
        }
    ];

    function renderLevelSelect() {
        if (!levelsContainer) return;
        levelsContainer.innerHTML = '';

        grammarDB.forEach((lvl, index) => {
            const isUnlocked = unlockedLevels.includes(lvl.level);

            const btn = document.createElement('button');
            btn.className = `level-btn ${isUnlocked ? '' : 'level-locked'}`;

            // Set colors dynamically for unlocked levels
            if (isUnlocked) {
                const colors = ['var(--card-red)', 'var(--card-green)', 'var(--card-blue)', 'var(--card-purple)', 'var(--card-orange)'];
                btn.style.backgroundColor = colors[index % colors.length];
            }

            btn.innerHTML = `
                <span>Level ${lvl.level}</span>
                <span style="font-size: 1.2rem;">${isUnlocked ? lvl.title : '<i class="fa-solid fa-lock"></i> Locked'}</span>
            `;

            if (isUnlocked) {
                btn.addEventListener('click', () => {
                    startGrammarLevel(lvl.level);
                });
            } else {
                btn.addEventListener('click', () => {
                    if (window.playSound) window.playSound('Complete previous levels to unlock this!');
                });
            }

            levelsContainer.appendChild(btn);
        });
    }

    function startGrammarLevel(level) {
        grammarLevel = level;
        grammarScore = 0;
        currentQuestionIndex = 0;

        levelSelectView.style.display = 'none';
        quizView.style.display = 'block';
        winMsgView.style.display = 'none';

        const lvlData = grammarDB.find(l => l.level === grammarLevel);
        levelTitle.textContent = `Level ${grammarLevel}: ${lvlData.title}`;

        renderQuestion();
    }

    function renderQuestion() {
        isGrammarTransitioning = false;
        const lvlData = grammarDB.find(l => l.level === grammarLevel);
        const qData = lvlData.questions[currentQuestionIndex];

        scoreDisplay.textContent = grammarScore;
        qnumDisplay.textContent = currentQuestionIndex + 1;

        questionText.textContent = qData.q;
        emojiDisplay.textContent = qData.emoji;

        if (window.playSound) window.playSound(qData.q);

        optionsContainer.innerHTML = '';

        // Render 3 options
        qData.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'grammar-option';
            btn.textContent = opt;

            btn.addEventListener('click', () => {
                if (isGrammarTransitioning) return;

                if (opt === qData.answer) {
                    handleCorrectAnswer(btn, opt);
                } else {
                    handleWrongAnswer(btn);
                }
            });

            optionsContainer.appendChild(btn);
        });
    }

    function handleCorrectAnswer(btn, opt) {
        isGrammarTransitioning = true;
        btn.style.backgroundColor = 'var(--card-green)';
        btn.style.color = 'white';
        btn.style.borderColor = 'var(--card-green)';

        if (feedbackText) feedbackText.style.opacity = '0';

        if (window.playSound) window.playSound('Correct! ' + opt);
        if (window.addStars) window.addStars(1);

        grammarScore++;
        scoreDisplay.textContent = grammarScore;

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < 10) {
                renderQuestion();
            } else {
                endGrammarLevel();
            }
        }, 1500);
    }

    function handleWrongAnswer(btn) {
        if (window.playSound) window.playSound('Oops, try again!');
        btn.classList.remove('shake');
        void btn.offsetWidth; // trigger reflow
        btn.classList.add('shake');
        btn.style.backgroundColor = 'var(--card-red)';
        btn.style.color = 'white';
        btn.style.borderColor = 'var(--card-red)';

        if (feedbackText) feedbackText.style.opacity = '1';

        setTimeout(() => {
            if (!isGrammarTransitioning) {
                btn.style.backgroundColor = 'white';
                btn.style.color = 'var(--text-color)';
                btn.style.borderColor = 'var(--primary-color)';
                if (feedbackText) feedbackText.style.opacity = '0';
            }
        }, 1500);
    }

    function endGrammarLevel() {
        quizView.style.display = 'none';
        winMsgView.style.display = 'block';

        finalScore.textContent = grammarScore;

        if (window.playSound) window.playSound(`Level complete! You scored ${grammarScore} out of 10.`);

        // Check progression
        const passedData = grammarScore >= 6; // Pass criteria
        const isLastLevel = grammarLevel === grammarDB.length;

        const titleObj = document.getElementById('grammar-win-title');

        if (passedData) {
            titleObj.textContent = "🎉 Excellent! 🎉";
            if (!isLastLevel && !unlockedLevels.includes(grammarLevel + 1)) {
                unlockedLevels.push(grammarLevel + 1);
                localStorage.setItem('littleGeniusGrammarLevels', JSON.stringify(unlockedLevels));
            }
            if (!isLastLevel) {
                btnNext.style.display = 'inline-block';
            } else {
                btnNext.style.display = 'none';
                titleObj.textContent = "🏆 Grammar Champion! 🏆";
            }
        } else {
            titleObj.textContent = "Keep Practicing!";
            btnNext.style.display = 'none';
            if (window.playSound) window.playSound('Try this level again to unlock the next one.');
        }
    }

    // Event Listeners for end menu
    if (btnMenu) {
        btnMenu.addEventListener('click', () => {
            winMsgView.style.display = 'none';
            levelSelectView.style.display = 'block';
            renderLevelSelect();
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            startGrammarLevel(grammarLevel + 1);
        });
    }
});
