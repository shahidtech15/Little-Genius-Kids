/**
 * ABC Learning Logic
 * Generates alphabet grid and handles click events for TTS & display.
 */

document.addEventListener('DOMContentLoaded', () => {
    const alphabetGrid = document.getElementById('alphabet-grid');
    const letterDisplay = document.getElementById('letter-display');
    const displayLetter = document.getElementById('display-letter');
    const displayWord = document.getElementById('display-word');
    const displayIcon = document.getElementById('display-icon');
    const btnCloseDisplay = document.getElementById('btn-close-display');

    // Tracing specific elements
    const btnTraceLetter = document.getElementById('btn-trace-letter');
    const btnBackDisplay = document.getElementById('btn-back-display');
    const btnClearCanvas = document.getElementById('btn-clear-canvas');
    const displayInfo = document.getElementById('display-info');
    const tracingContainer = document.getElementById('tracing-container');
    const tracingTitle = document.getElementById('tracing-title');
    const canvas = document.getElementById('tracing-canvas');
    const successOverlay = document.getElementById('tracing-success-overlay');

    const ctx = canvas ? canvas.getContext('2d') : null;
    let currentTraceLetter = '';
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let strokesPixels = 0;
    let totalTargetPixels = 0;
    let hasWonTracing = false;

    // Data for the alphabet (Word and FontAwesome Icon class)
    const alphabetData = [
        { letter: 'A', word: 'Apple', icon: 'fa-apple-whole' },
        { letter: 'B', word: 'Bear', icon: 'fa-paw' },
        { letter: 'C', word: 'Cat', icon: 'fa-cat' },
        { letter: 'D', word: 'Dog', icon: 'fa-dog' },
        { letter: 'E', word: 'Elephant', icon: 'fa-elephant' }, // Fallback to generic if full pro subset missing
        { letter: 'F', word: 'Fish', icon: 'fa-fish' },
        { letter: 'G', word: 'Guitar', icon: 'fa-guitar' },
        { letter: 'H', word: 'Hat', icon: 'fa-hat-wizard' },
        { letter: 'I', word: 'Ice Cream', icon: 'fa-ice-cream' },
        { letter: 'J', word: 'Jet', icon: 'fa-jet-fighter' },
        { letter: 'K', word: 'Key', icon: 'fa-key' },
        { letter: 'L', word: 'Leaf', icon: 'fa-leaf' },
        { letter: 'M', word: 'Moon', icon: 'fa-moon' },
        { letter: 'N', word: 'Note', icon: 'fa-music' },
        { letter: 'O', word: 'Orange', icon: 'fa-lemon' },
        { letter: 'P', word: 'Pizza', icon: 'fa-pizza-slice' },
        { letter: 'Q', word: 'Queen', icon: 'fa-chess-queen' },
        { letter: 'R', word: 'Rocket', icon: 'fa-rocket' },
        { letter: 'S', word: 'Star', icon: 'fa-star' },
        { letter: 'T', word: 'Tree', icon: 'fa-tree' },
        { letter: 'U', word: 'Umbrella', icon: 'fa-umbrella' },
        { letter: 'V', word: 'Volcano', icon: 'fa-mountain' },
        { letter: 'W', word: 'Watermelon', icon: 'fa-seedling' },
        { letter: 'X', word: 'Xylophone', icon: 'fa-guitar' },
        { letter: 'Y', word: 'Yacht', icon: 'fa-sailboat' },
        { letter: 'Z', word: 'Zebra', icon: 'fa-horse' }
    ];

    // Generate Alphabet Buttons
    alphabetData.forEach(item => {
        const btn = document.createElement('button');
        btn.classList.add('letter-btn');
        btn.textContent = item.letter;

        btn.addEventListener('click', () => {
            playLetterSound(item.letter, item.word);
            showLetterDisplay(item);
            btn.classList.add('played'); // mark as interacted

            // Add a star occasionally (e.g., 20% chance)
            if (Math.random() < 0.2 && window.addStars) {
                window.addStars(1);
            }
        });

        alphabetGrid.appendChild(btn);
    });

    // Setup Speech Synthesis
    function playLetterSound(letter, word) {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const msg1 = new SpeechSynthesisUtterance(`${letter}`);
            msg1.rate = 0.8;
            msg1.pitch = 1.2;

            const msg2 = new SpeechSynthesisUtterance(`${letter} is for ${word}`);
            msg2.rate = 0.9;
            msg2.pitch = 1.1;

            window.speechSynthesis.speak(msg1);

            // Speak the phrase after a short delay
            setTimeout(() => {
                window.speechSynthesis.speak(msg2);
            }, 800);
        }
    }

    // Modal Display Logic
    function showLetterDisplay(item) {
        displayLetter.textContent = item.letter;
        displayWord.textContent = item.word;
        displayIcon.className = `fa-solid ${item.icon} fa-5x`;

        // Reset view
        if (displayInfo) displayInfo.style.display = 'block';
        if (tracingContainer) tracingContainer.style.display = 'none';

        currentTraceLetter = item.letter;
        letterDisplay.style.display = 'flex';
    }

    if (btnCloseDisplay) {
        btnCloseDisplay.addEventListener('click', () => {
            letterDisplay.style.display = 'none';
            window.speechSynthesis.cancel(); // Stop talking if closed early
        });
    }

    // ==========================================
    // TRACING LOGIC
    // ==========================================

    if (btnTraceLetter) {
        btnTraceLetter.addEventListener('click', () => {
            displayInfo.style.display = 'none';
            tracingContainer.style.display = 'flex';
            tracingTitle.textContent = `Trace the letter ${currentTraceLetter}!`;
            initCanvas();
            playSound(`Trace the letter ${currentTraceLetter}`);
        });
    }

    if (btnBackDisplay) {
        btnBackDisplay.addEventListener('click', () => {
            tracingContainer.style.display = 'none';
            displayInfo.style.display = 'block';
            window.speechSynthesis.cancel();
        });
    }

    if (btnClearCanvas) {
        btnClearCanvas.addEventListener('click', () => {
            initCanvas();
        });
    }

    function initCanvas() {
        if (!canvas) return;

        hasWonTracing = false;
        successOverlay.style.display = 'none';

        // Set fixed size for simplicity, or make responsive
        const size = Math.min(window.innerWidth * 0.8, 300);
        canvas.width = size;
        canvas.height = size;

        drawGuideLetter();
    }

    function drawGuideLetter() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the light gray guide letter
        ctx.font = `bold ${canvas.height * 0.8}px "Nunito", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#E0E0E0'; // Light gray

        ctx.fillText(currentTraceLetter, canvas.width / 2, canvas.height / 2);

        // Add dotted outline to make it look like tracing
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#BDBDBD';
        ctx.setLineDash([5, 5]);
        ctx.strokeText(currentTraceLetter, canvas.width / 2, canvas.height / 2);
        ctx.setLineDash([]); // Reset dash for drawing

        // Calculate total pixels of the target letter (for crude validation)
        calculateTargetPixels();
        strokesPixels = 0;
    }

    function calculateTargetPixels() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        totalTargetPixels = 0;

        // Count non-transparent pixels
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] > 50) { // arbitrary alpha threshold
                totalTargetPixels++;
            }
        }
    }

    // Drawing Event Listeners
    if (canvas) {
        // Mouse
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Touch
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);
    }

    function getPointerPos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }

    function startDrawing(e) {
        if (hasWonTracing) return;
        isDrawing = true;
        const pos = getPointerPos(e);
        lastX = pos.x;
        lastY = pos.y;
    }

    function draw(e) {
        if (!isDrawing || hasWonTracing) return;

        const pos = getPointerPos(e);

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = 'var(--card-pink)'; // Pastel pink brush
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        lastX = pos.x;
        lastY = pos.y;

        // Roughly add to stroked pixels (crude heuristic)
        strokesPixels += ctx.lineWidth;
    }

    function stopDrawing() {
        if (!isDrawing || hasWonTracing) return;
        isDrawing = false;
        checkWinCondition();
    }

    function checkWinCondition() {
        // Simple heuristic: if they've drawn a lot, they probably filled it roughly.
        // A real pixel-perfect check requires diffing imageData, but for kids this is fine.
        const fillRatio = strokesPixels / (totalTargetPixels || 1);

        if (fillRatio > 0.4) { // 40% threshold for forgiving tracing
            hasWonTracing = true;
            successOverlay.style.display = 'flex';
            playSound(`Great job! You traced the letter ${currentTraceLetter}`);
            if (window.addStars) window.addStars(2);
        }
    }

    function playSound(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(text);
            msg.rate = 0.9;
            msg.pitch = 1.2;
            window.speechSynthesis.speak(msg);
        }
    }
});
