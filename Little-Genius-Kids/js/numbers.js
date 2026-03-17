/* =========================================================================
   Numbers Logic
   Generates 1-100 grid and handles TTS / dot counting animations.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const numbersGrid = document.getElementById('numbers-grid');
    const countingDisplay = document.getElementById('counting-display');
    const displayNumber = document.getElementById('display-number');
    const dotsContainer = document.getElementById('dots-container');
    const btnCloseDisplay = document.getElementById('btn-close-display');
    const btnCountAll = document.getElementById('btn-count-all');

    const totalNumbers = 100;

    // Generate Number Buttons
    for (let i = 1; i <= totalNumbers; i++) {
        const btn = document.createElement('button');
        btn.classList.add('number-btn');
        btn.textContent = i;

        btn.addEventListener('click', () => {
            playNumberSound(i);

            // Only show dot animation for 1-20 (too many dots otherwise)
            if (i <= 20) {
                showCountingDisplay(i);
            }

            btn.classList.add('played');

            // Random rewards
            if (Math.random() < 0.1 && window.addStars) {
                window.addStars(1);
            }
        });

        numbersGrid.appendChild(btn);
    }

    // Setup Speech Synthesis
    function playNumberSound(num) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(num.toString());
            msg.rate = 0.8;
            msg.pitch = 1.3;
            window.speechSynthesis.speak(msg);
        }
    }

    // Auto-count 1 to 10
    btnCountAll.addEventListener('click', () => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();

        let counter = 1;

        function speakNext() {
            if (counter > 10) return;
            const msg = new SpeechSynthesisUtterance(counter.toString());
            msg.rate = 0.8;
            msg.pitch = 1.3;

            // Highlight button
            const buttons = numbersGrid.querySelectorAll('.number-btn');
            buttons.forEach(b => b.classList.remove('active-play'));
            buttons[counter - 1].classList.add('active-play');

            msg.onend = () => {
                setTimeout(speakNext, 500); // Wait half a second before next number
                buttons[counter - 1].classList.remove('active-play');
                counter++;
            };

            window.speechSynthesis.speak(msg);
        }

        speakNext();
    });

    // Modal Display Logic for Dots
    function showCountingDisplay(num) {
        displayNumber.textContent = num;
        dotsContainer.innerHTML = ''; // clear previous dots

        // Generate dots one by one with a delay
        for (let i = 0; i < num; i++) {
            setTimeout(() => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.classList.add('bounce-in');
                // Randomize dot color from pastel palette based on index
                const colors = ['#FF9A9E', '#A1C4FD', '#C1E1C1', '#FDFD96', '#D4A5A5', '#FFD1BA'];
                dot.style.backgroundColor = colors[i % colors.length];

                dotsContainer.appendChild(dot);
            }, i * 200); // 200ms delay per dot
        }

        countingDisplay.style.display = 'flex';
    }

    btnCloseDisplay.addEventListener('click', () => {
        countingDisplay.style.display = 'none';
        window.speechSynthesis.cancel();
    });
});
