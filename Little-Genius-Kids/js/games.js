/**
 * Interactive Games Logic
 * 1. Alphabet Match
 * 2. Number counting
 * 3. Color ID
 * 4. Animal Sounds
 * 5. Shape Match
 */

document.addEventListener('DOMContentLoaded', () => {
    // Utility: Play Sound using Speech Synthesis
    function playSound(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(text);
            msg.rate = 0.9;
            msg.pitch = 1.2;
            window.speechSynthesis.speak(msg);
        }
    }

    // Utility: Add Stars (uses global addStars if exists, otherwise mock)
    function awardStars() {
        if (window.addStars) {
            window.addStars(5);
        }
    }

    // =====================================================================
    // Tab Switching
    // =====================================================================
    const games = ['alphabet', 'numbers', 'colors', 'animals', 'shapes', 'color-catch', 'farm-count', 'grammar', 'sentence', 'detective', 'edtech-grammar'];

    games.forEach(game => {
        const tabBtn = document.getElementById(`tab-${game}`);
        const section = document.getElementById(`${game}-game`);

        if (tabBtn) {
            tabBtn.addEventListener('click', () => {
                // Hide all sections and reset tab colors
                games.forEach(g => {
                    const s = document.getElementById(`${g}-game`);
                    const t = document.getElementById(`tab-${g}`);
                    if (s) s.style.display = 'none';
                    if (t) {
                        t.classList.remove('active-tab');
                        t.style.opacity = '0.7';
                    }
                });

                // Stop Color Catch game if switching tabs
                if (typeof stopColorCatchGame === 'function') {
                    stopColorCatchGame();
                }

                // Show current
                if (section) section.style.display = 'block';
                if (tabBtn) {
                    tabBtn.classList.add('active-tab');
                    tabBtn.style.opacity = '1';
                }

                // Initialize game based on selection
                if (game === 'alphabet') initAlphabetGame();
                if (game === 'numbers') initNumbersGame();
                if (game === 'colors') initColorsGame();
                if (game === 'animals') initAnimalsGame();
                if (game === 'shapes') initShapesGame();
                if (game === 'color-catch') initColorCatchGame();
                if (game === 'farm-count') initFarmCountGame();
                if (game === 'grammar' && typeof initGrammarGame === 'function') initGrammarGame();
                if (game === 'sentence' && typeof initSentenceGame === 'function') initSentenceGame();
                if (game === 'detective' && typeof initDetectiveGame === 'function') initDetectiveGame();
                if (game === 'edtech-grammar' && typeof initEdtechGrammarGame === 'function') initEdtechGrammarGame();
            });
        }
    });

    // =====================================================================
    // 1. Alphabet Match (Capital to Lowercase)
    // =====================================================================
    const alphabetDraggables = document.getElementById('alphabet-draggables');
    const alphabetDropZones = document.getElementById('alphabet-drop-zones');
    const alphabetWinMsg = document.getElementById('alphabet-win-msg');
    const btnRestartAlphabet = document.getElementById('btn-restart-alphabet');

    const letters = [
        { cap: 'A', low: 'a' },
        { cap: 'B', low: 'b' },
        { cap: 'C', low: 'c' }
    ];
    let alphabetMatched = 0;

    function initAlphabetGame() {
        if (!alphabetDraggables) return;
        alphabetDraggables.innerHTML = '';
        alphabetDropZones.innerHTML = '';
        alphabetWinMsg.style.display = 'none';
        alphabetMatched = 0;

        const shuffledLetters = [...letters].sort(() => 0.5 - Math.random());
        const shuffledZones = [...letters].sort(() => 0.5 - Math.random());

        shuffledZones.forEach(l => {
            const zone = document.createElement('div');
            zone.classList.add('drop-zone');
            zone.dataset.letter = l.cap;
            zone.textContent = l.low;

            zone.addEventListener('dragover', e => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const draggedLetter = e.dataTransfer.getData('text/plain');

                if (draggedLetter === l.cap) {
                    zone.classList.add('dropped');
                    zone.innerHTML = `<i class="fa-solid fa-check fa-2x" style="color:var(--card-green);"></i>`;
                    playSound("Correct! " + l.cap + " is for " + l.low);
                    alphabetMatched++;
                    const dragElem = document.getElementById(`drag-letter-${l.cap}`);
                    if (dragElem) dragElem.style.visibility = 'hidden';

                    if (alphabetMatched === letters.length) {
                        setTimeout(() => {
                            alphabetWinMsg.style.display = 'block';
                            awardStars();
                            playSound("Amazing! You matched all the letters!");
                        }, 500);
                    }
                } else {
                    playSound("Oops! Try again.");
                }
            });
            alphabetDropZones.appendChild(zone);
        });

        shuffledLetters.forEach(l => {
            const item = document.createElement('div');
            item.classList.add('drag-item');
            item.style.backgroundColor = 'var(--card-blue)';
            item.id = `drag-letter-${l.cap}`;
            item.draggable = true;
            item.textContent = l.cap;

            item.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', l.cap);
                setTimeout(() => item.style.opacity = '0.5', 0);
            });
            item.addEventListener('dragend', () => item.style.opacity = '1');

            alphabetDraggables.appendChild(item);
        });
    }
    if (btnRestartAlphabet) btnRestartAlphabet.addEventListener('click', initAlphabetGame);

    // =====================================================================
    // 2. Number Counting Game
    // =====================================================================
    const countingObjects = document.getElementById('counting-objects');
    const countingOptions = document.getElementById('counting-options');
    const numbersWinMsg = document.getElementById('numbers-win-msg');
    const btnRestartNumbers = document.getElementById('btn-restart-numbers');

    let currentCount = 0;

    function initNumbersGame() {
        if (!countingObjects) return;
        countingObjects.innerHTML = '';
        countingOptions.innerHTML = '';
        numbersWinMsg.style.display = 'none';

        currentCount = Math.floor(Math.random() * 5) + 1; // 1 to 5

        for (let i = 0; i < currentCount; i++) {
            const obj = document.createElement('div');
            obj.classList.add('count-object');
            obj.innerHTML = '🍎';
            countingObjects.appendChild(obj);
        }

        let options = [currentCount];
        while (options.length < 3) {
            let r = Math.floor(Math.random() * 6) + 1;
            if (!options.includes(r)) options.push(r);
        }
        options.sort(() => 0.5 - Math.random());

        options.forEach(num => {
            const btn = document.createElement('button');
            btn.classList.add('number-option');
            btn.textContent = num;
            btn.addEventListener('click', () => {
                if (num === currentCount) {
                    playSound("Great job! There are " + currentCount + " apples.");
                    numbersWinMsg.style.display = 'block';
                    awardStars();
                    countingOptions.innerHTML = ''; // Hide buttons on win
                } else {
                    playSound("Not quite! Let's count them again.");
                }
            });
            countingOptions.appendChild(btn);
        });

        playSound("How many apples do you see?");
    }
    if (btnRestartNumbers) btnRestartNumbers.addEventListener('click', initNumbersGame);

    // =====================================================================
    // 3. Color Identification Game
    // =====================================================================
    const colorsOptionsContainer = document.getElementById('colors-options');
    const colorsWinMsg = document.getElementById('colors-win-msg');
    const btnRestartColors = document.getElementById('btn-restart-colors');
    const colorInstruction = document.getElementById('color-instruction');

    const colorsList = [
        { name: 'Red', hex: '#FF6B6B' },
        { name: 'Blue', hex: '#4DABF7' },
        { name: 'Green', hex: '#69DB7C' },
        { name: 'Yellow', hex: '#FCC419' }
    ];

    function initColorsGame() {
        if (!colorsOptionsContainer) return;
        colorsOptionsContainer.innerHTML = '';
        colorsWinMsg.style.display = 'none';

        const selectedColors = [...colorsList].sort(() => 0.5 - Math.random()).slice(0, 3);
        const targetColor = selectedColors[Math.floor(Math.random() * selectedColors.length)];

        colorInstruction.textContent = `Find the ${targetColor.name} circle!`;
        playSound(`Can you find the ${targetColor.name} circle?`);

        selectedColors.forEach(c => {
            const circle = document.createElement('div');
            circle.classList.add('color-option');
            circle.style.backgroundColor = c.hex;

            circle.addEventListener('click', () => {
                if (c.name === targetColor.name) {
                    playSound("You found it! That is " + targetColor.name);
                    colorsWinMsg.style.display = 'block';
                    awardStars();
                    colorsOptionsContainer.innerHTML = '';
                } else {
                    playSound("That is " + c.name + ", try again!");
                }
            });
            colorsOptionsContainer.appendChild(circle);
        });
    }
    if (btnRestartColors) btnRestartColors.addEventListener('click', initColorsGame);

    // =====================================================================
    // 4. Animal Sound Guessing Game
    // =====================================================================
    const animalsOptionsContainer = document.getElementById('animals-options');
    const animalsWinMsg = document.getElementById('animals-win-msg');
    const btnRestartAnimals = document.getElementById('btn-restart-animals');
    const btnPlayAnimalSound = document.getElementById('btn-play-animal-sound');

    const animalsList = [
        { name: 'Dog', icon: 'fa-dog', sound: 'Woof woof!' },
        { name: 'Cat', icon: 'fa-cat', sound: 'Meow meow!' },
        { name: 'Cow', icon: 'fa-cow', sound: 'Moo moo!' },
        { name: 'Pig', icon: 'fa-piggy-bank', sound: 'Oink oink!' }
    ];

    let currentAnimal = null;

    function initAnimalsGame() {
        if (!animalsOptionsContainer) return;
        animalsOptionsContainer.innerHTML = '';
        animalsWinMsg.style.display = 'none';

        const selectedAnimals = [...animalsList].sort(() => 0.5 - Math.random()).slice(0, 3);
        currentAnimal = selectedAnimals[Math.floor(Math.random() * selectedAnimals.length)];

        selectedAnimals.forEach(a => {
            const opt = document.createElement('div');
            opt.classList.add('animal-option');
            opt.innerHTML = `<i class="fa-solid ${a.icon}"></i>`;

            opt.addEventListener('click', () => {
                if (a.name === currentAnimal.name) {
                    playSound("Correct! It's a " + currentAnimal.name);
                    animalsWinMsg.style.display = 'block';
                    awardStars();
                    animalsOptionsContainer.innerHTML = '';
                } else {
                    playSound("Nope! That's a " + a.name);
                }
            });
            animalsOptionsContainer.appendChild(opt);
        });

        playSound("Listen carefully. Click the button to hear the sound.");
    }

    if (btnPlayAnimalSound) {
        btnPlayAnimalSound.addEventListener('click', () => {
            if (currentAnimal) playSound(currentAnimal.sound);
        });
    }

    if (btnRestartAnimals) btnRestartAnimals.addEventListener('click', initAnimalsGame);

    // =====================================================================
    // 5. Shape Match (Drag and Drop)
    // =====================================================================
    const shapeDraggables = document.getElementById('shape-draggables');
    const shapeDropZones = document.getElementById('shape-drop-zones');
    const shapesWinMsg = document.getElementById('shapes-win-msg');
    const btnRestartShapes = document.getElementById('btn-restart-shapes');

    const shapesList = [
        { name: 'Circle', color: '#4DABF7', borderRadius: '50%', clipPath: 'none' },
        { name: 'Square', color: '#FF6B6B', borderRadius: '15px', clipPath: 'none' },
        { name: 'Triangle', color: '#69DB7C', borderRadius: '0', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }
    ];

    let shapesMatched = 0;

    function initShapesGame() {
        if (!shapeDraggables) return;
        shapeDraggables.innerHTML = '';
        shapeDropZones.innerHTML = '';
        shapesWinMsg.style.display = 'none';
        shapesMatched = 0;

        const shuffledShapes = [...shapesList].sort(() => 0.5 - Math.random());
        const shuffledZones = [...shapesList].sort(() => 0.5 - Math.random());

        shuffledZones.forEach(s => {
            const zone = document.createElement('div');
            zone.classList.add('drop-zone');
            zone.dataset.shape = s.name;
            if (s.name === 'Circle') zone.style.borderRadius = '50%';
            else if (s.name === 'Square') zone.style.borderRadius = '15px';

            zone.addEventListener('dragover', e => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const draggedShape = e.dataTransfer.getData('text/plain');

                if (draggedShape === s.name) {
                    zone.classList.add('dropped');
                    playSound("Correct! It's a " + s.name);
                    shapesMatched++;

                    // Award star immediately
                    if (window.addStars) window.addStars(1);

                    const dragElem = document.getElementById(`drag-shape-${s.name}`);
                    if (dragElem) {
                        // Visually snap into the drop zone
                        dragElem.draggable = false;
                        dragElem.classList.add('snap-in');
                        zone.innerHTML = ''; // clear any placeholder text
                        zone.appendChild(dragElem);
                    }

                    if (shapesMatched === shapesList.length) {
                        setTimeout(() => {
                            shapesWinMsg.style.display = 'block';
                            playSound("Amazing! You sorted all shapes!");
                        }, 500);
                    }
                } else {
                    playSound("Oops! Try again.");
                    const wrongElem = document.getElementById(`drag-shape-${draggedShape}`);
                    if (wrongElem) {
                        wrongElem.classList.remove('shake');
                        void wrongElem.offsetWidth; // trigger reflow
                        wrongElem.classList.add('shake');
                    }
                }
            });
            shapeDropZones.appendChild(zone);
        });

        shuffledShapes.forEach(s => {
            const item = document.createElement('div');
            item.classList.add('drag-item');
            item.id = `drag-shape-${s.name}`;
            item.draggable = true;
            item.style.backgroundColor = s.color;
            item.style.borderRadius = s.borderRadius;
            if (s.clipPath && s.clipPath !== 'none') {
                item.style.clipPath = s.clipPath;
            }

            item.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', s.name);
                setTimeout(() => item.style.opacity = '0.01', 0); // Hide original immediately, leaving ghost
            });
            item.addEventListener('dragend', () => {
                item.style.opacity = '1';
                // Provide visual fix if it drops outside bounds correctly
            });

            shapeDraggables.appendChild(item);
        });
    }
    if (btnRestartShapes) btnRestartShapes.addEventListener('click', initShapesGame);

    // =====================================================================
    // 6. Color Catch Game
    // =====================================================================
    const colorCatchArea = document.getElementById('color-catch-area');
    const colorCatchWinMsg = document.getElementById('color-catch-win-msg');
    const btnRestartColorCatch = document.getElementById('btn-restart-color-catch');
    const ccInstruction = document.getElementById('cc-instruction');
    const ccStarsDisplay = document.getElementById('cc-stars');

    let ccScore = 0;
    let ccGameInterval = null;
    let ccSpawnInterval = null;
    let ccBalloons = [];
    let ccTargetColor = null;

    const ccColors = [
        { name: 'Red', hex: '#FF4D4D' },
        { name: 'Blue', hex: '#4D94FF' },
        { name: 'Green', hex: '#4DFF4D' },
        { name: 'Yellow', hex: '#FFFF4D' },
        { name: 'Purple', hex: '#B84DFF' }
    ];

    function stopColorCatchGame() {
        if (ccGameInterval) clearInterval(ccGameInterval);
        if (ccSpawnInterval) clearInterval(ccSpawnInterval);
        ccBalloons.forEach(b => {
            if (b.element && b.element.parentNode) {
                b.element.parentNode.removeChild(b.element);
            }
        });
        ccBalloons = [];
    }

    function spawnBalloon() {
        if (!colorCatchArea) return;

        const colorObj = ccColors[Math.floor(Math.random() * ccColors.length)];
        const balloon = document.createElement('div');
        balloon.classList.add('cc-balloon');
        balloon.style.backgroundColor = colorObj.hex;

        const maxX = colorCatchArea.clientWidth - 60;
        const startX = Math.max(0, Math.floor(Math.random() * maxX));
        balloon.style.left = startX + 'px';

        colorCatchArea.appendChild(balloon);

        const speed = 1.5 + Math.random() * 2;
        let yPos = -80;

        const balloonObj = {
            element: balloon,
            color: colorObj,
            y: yPos,
            speed: speed,
            active: true
        };

        ccBalloons.push(balloonObj);

        balloon.addEventListener('click', () => {
            if (!balloonObj.active) return;
            balloonObj.active = false;

            if (balloonObj.color.name === ccTargetColor.name) {
                playSound("Pop!");
                createConfetti(startX + 30, balloonObj.y + 35);
                balloon.classList.add('pop-animation');
                ccScore++;
                ccStarsDisplay.textContent = ccScore;

                setTimeout(() => {
                    if (balloon.parentNode) balloon.parentNode.removeChild(balloon);
                }, 300);

                if (ccScore >= 10) {
                    winColorCatch();
                } else {
                    if (ccScore % 3 === 0) setNextTargetColor();
                }
            } else {
                playSound("Oops! Looking for " + ccTargetColor.name);
                balloon.style.opacity = '0.5';
                setTimeout(() => {
                    if (balloon.parentNode) balloon.parentNode.removeChild(balloon);
                }, 500);
            }
        });
    }

    function createConfetti(x, y) {
        for (let i = 0; i < 8; i++) {
            const conf = document.createElement('div');
            conf.classList.add('confetti');
            conf.style.left = x + 'px';
            conf.style.top = y + 'px';
            conf.style.backgroundColor = ccColors[Math.floor(Math.random() * ccColors.length)].hex;

            const angle = Math.random() * Math.PI * 2;
            const velocity = 20 + Math.random() * 30;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity - 20;

            conf.style.transform = `translate(${vx}px, ${vy}px) rotate(${Math.random() * 360}deg)`;

            colorCatchArea.appendChild(conf);
            setTimeout(() => {
                if (conf.parentNode) conf.parentNode.removeChild(conf);
            }, 1000);
        }
    }

    function setNextTargetColor() {
        ccTargetColor = ccColors[Math.floor(Math.random() * ccColors.length)];
        if (ccInstruction) {
            ccInstruction.textContent = `Catch the ${ccTargetColor.name.toUpperCase()} balloons!`;
            ccInstruction.style.color = ccTargetColor.name === 'Yellow' ? '#D4A017' : ccTargetColor.hex;
        }
        playSound(`Catch ${ccTargetColor.name}`);
    }

    function winColorCatch() {
        stopColorCatchGame();
        if (colorCatchWinMsg) colorCatchWinMsg.style.display = 'block';
        playSound("Incredible! You earned a ribbon!");
        awardStars();

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                createConfetti(Math.random() * colorCatchArea.clientWidth, Math.random() * colorCatchArea.clientHeight);
            }, i * 50);
        }

        // Hide score and headers
        const ccHeader = document.querySelector('.cc-header');
        if (ccHeader) ccHeader.style.display = 'none';
        if (colorCatchArea) colorCatchArea.style.display = 'none';
    }

    function updateColorCatch() {
        if (ccScore >= 10) return;

        for (let i = ccBalloons.length - 1; i >= 0; i--) {
            let b = ccBalloons[i];
            if (!b.active) continue;

            b.y += b.speed;
            b.element.style.top = b.y + 'px';

            if (b.y > colorCatchArea.clientHeight + 100) {
                if (b.element.parentNode) b.element.parentNode.removeChild(b.element);
                ccBalloons.splice(i, 1);
            }
        }
    }

    function initColorCatchGame() {
        if (!colorCatchArea) return;

        // Restore visibility
        const ccHeader = document.querySelector('.cc-header');
        if (ccHeader) ccHeader.style.display = 'flex';
        colorCatchArea.style.display = 'block';

        stopColorCatchGame();
        colorCatchWinMsg.style.display = 'none';
        ccScore = 0;
        ccStarsDisplay.textContent = ccScore;

        setNextTargetColor();

        ccGameInterval = setInterval(updateColorCatch, 16);
        ccSpawnInterval = setInterval(spawnBalloon, 1000);

        spawnBalloon();
    }

    if (btnRestartColorCatch) btnRestartColorCatch.addEventListener('click', initColorCatchGame);

    // =====================================================================
    // 7. Counting Farm Game
    // =====================================================================
    const farmArea = document.getElementById('farm-area');
    const fcOptionsContainer = document.getElementById('fc-options');
    const fcWinMsg = document.getElementById('fc-win-msg');
    const btnRestartFarm = document.getElementById('btn-restart-farm');
    const fcInstruction = document.getElementById('fc-instruction');
    const fcRoundDisplay = document.getElementById('fc-round');
    const fcStarsDisplay = document.getElementById('fc-stars');
    const fcFinalScore = document.getElementById('fc-final-score');

    const farmAnimalsList = [
        { name: 'Cows', plural: 'cows', emoji: '🐄' },
        { name: 'Pigs', plural: 'pigs', emoji: '🐖' },
        { name: 'Chickens', plural: 'chickens', emoji: '🐔' },
        { name: 'Sheep', plural: 'sheep', emoji: '🐑' },
        { name: 'Horses', plural: 'horses', emoji: '🐎' }
    ];

    let fcRound = 1;
    let fcScore = 0;
    let fcCurrentCount = 0;
    let isTransitioning = false;

    function initFarmCountGame() {
        if (!farmArea) return;
        fcRound = 1;
        fcScore = 0;
        isTransitioning = false;

        fcWinMsg.style.display = 'none';
        farmArea.style.display = 'flex';
        fcOptionsContainer.style.display = 'flex';

        // Ensure header visibility is restored
        const fcHeader = document.querySelector('.fc-header');
        if (fcHeader) fcHeader.style.display = 'flex';

        generateFarmRound();
    }

    function generateFarmRound() {
        if (fcRound > 10) {
            endFarmGame();
            return;
        }

        isTransitioning = false;
        farmArea.innerHTML = '';
        fcOptionsContainer.innerHTML = '';

        fcRoundDisplay.textContent = fcRound;
        fcStarsDisplay.textContent = fcScore;

        const animalObj = farmAnimalsList[Math.floor(Math.random() * farmAnimalsList.length)];
        fcCurrentCount = Math.floor(Math.random() * 10) + 1; // 1 to 10

        fcInstruction.textContent = `How many ${animalObj.plural}?`;
        playSound(`How many ${animalObj.plural}?`);

        // Render animals
        for (let i = 0; i < fcCurrentCount; i++) {
            const animalEl = document.createElement('div');
            animalEl.classList.add('fc-animal');
            animalEl.textContent = animalObj.emoji;
            farmArea.appendChild(animalEl);
        }

        // Generate options (1 correct, 2 random wrong offsets)
        let options = [fcCurrentCount];
        while (options.length < 3) {
            // Random offset from -3 to +3, avoiding 0 or numbers <= 0, capped roughly
            let offset = Math.floor(Math.random() * 7) - 3;
            if (offset === 0) offset = 1;
            let wrongCount = fcCurrentCount + offset;
            if (wrongCount < 1) wrongCount = Math.abs(wrongCount) + 1; // force positive
            if (wrongCount > 15) wrongCount = 15;

            if (!options.includes(wrongCount)) {
                options.push(wrongCount);
            }
        }

        options.sort(() => 0.5 - Math.random());

        options.forEach(num => {
            const btn = document.createElement('button');
            btn.classList.add('number-option');
            // Give these farm buttons a slightly different color to distinguish them
            btn.style.backgroundColor = 'var(--card-green)';
            btn.textContent = num;

            btn.addEventListener('click', () => {
                if (isTransitioning) return; // Prevent multiple clicks

                if (num === fcCurrentCount) {
                    isTransitioning = true;
                    playSound(`Correct! ${fcCurrentCount} ${animalObj.plural}`);
                    btn.style.backgroundColor = 'var(--card-yellow)';
                    btn.classList.add('snap-in');

                    fcScore++;
                    if (window.addStars) window.addStars(1);
                    fcStarsDisplay.textContent = fcScore;

                    // Proceed to next round automatically
                    setTimeout(() => {
                        fcRound++;
                        generateFarmRound();
                    }, 1200);

                } else {
                    playSound(`Not quite! Let's count them again.`);
                    btn.classList.remove('shake');
                    void btn.offsetWidth; // trigger reflow
                    btn.classList.add('shake');
                    btn.style.backgroundColor = 'var(--card-orange)'; // indicate wrong briefly
                    setTimeout(() => {
                        if (!isTransitioning) btn.style.backgroundColor = 'var(--card-green)';
                    }, 800);
                }
            });
            fcOptionsContainer.appendChild(btn);
        });
    }

    function endFarmGame() {
        const fcHeader = document.querySelector('.fc-header');
        if (fcHeader) fcHeader.style.display = 'none';
        farmArea.style.display = 'none';
        fcOptionsContainer.style.display = 'none';

        fcFinalScore.textContent = fcScore;
        fcWinMsg.style.display = 'block';
        playSound(`Farm complete! You earned ${fcScore} stars.`);
    }

    if (btnRestartFarm) btnRestartFarm.addEventListener('click', initFarmCountGame);

    // Initialize the first active game
    initAlphabetGame();
    // Default tabs styling
    games.forEach(g => {
        if (g !== 'alphabet') {
            const t = document.getElementById(`tab-${g}`);
            if (t) t.style.opacity = '0.7';
        }
    });
});

