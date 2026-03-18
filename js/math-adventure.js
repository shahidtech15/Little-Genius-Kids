// Premium Math Logic Engine (Replaces User Snippet)
const qDisplay = document.getElementById('qDisplay');
const ansDisplay = document.getElementById('ansDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const streakDisplay = document.getElementById('streakDisplay');
const rocket = document.getElementById('rocket');
const mathArea = document.getElementById('mathArea');

let currentAnswer = "";
let expectedResult = 0;
let score = 0;
let streak = 0;
let level = 1; 

function generateQuestion() {
    let a, b, op;
    
    // Dynamic difficulty progression!
    if (score < 8) level = 1;     // Easy Addition
    else if (score < 20) level = 2; // Addition & Subtraction
    else level = 3;               // Addition, Subtraction & Multiplication

    if (level === 1) {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        expectedResult = a + b;
        op = "+";
    } else if (level === 2) {
        op = Math.random() > 0.5 ? "+" : "-";
        if (op === "+") {
            a = Math.floor(Math.random() * 15) + 5;
            b = Math.floor(Math.random() * 15) + 5;
            expectedResult = a + b;
        } else {
            a = Math.floor(Math.random() * 20) + 10;
            // Ensure no negative numbers
            b = Math.floor(Math.random() * a); 
            expectedResult = a - b;
        }
    } else {
        let r = Math.random();
        if (r < 0.4) op = "+";
        else if (r < 0.8) op = "-";
        else op = "×";
        
        if (op === "+") { 
            a = Math.floor(Math.random() * 40) + 10; 
            b = Math.floor(Math.random() * 40) + 10; 
            expectedResult = a+b; 
        }
        else if (op === "-") { 
            a = Math.floor(Math.random() * 50) + 20; 
            b = Math.floor(Math.random() * a); 
            expectedResult = a-b; 
        }
        else { 
            a = Math.floor(Math.random() * 8) + 2; 
            b = Math.floor(Math.random() * 8) + 2; 
            expectedResult = a*b; 
        }
    }
    
    qDisplay.textContent = `${a} ${op} ${b}`;
    currentAnswer = "";
    ansDisplay.textContent = "?";
}

function feedInput(num) {
    if(currentAnswer.length < 4) { // Prevents infinite string tapping overflow
        currentAnswer += num;
        ansDisplay.textContent = currentAnswer;
    }
}

function clearInput() {
    currentAnswer = "";
    ansDisplay.textContent = "?";
}

function submitAnswer() {
    if(currentAnswer === "") return;
    
    if(parseInt(currentAnswer) === expectedResult) {
        // --- Correct Behavior ---
        score += 10; // 10 points per win
        streak++;
        scoreDisplay.textContent = `Score: ${score}`;
        streakDisplay.textContent = `Streak: ${streak} 🔥`;
        
        // Green immersive Flash replacing the old "alert()"
        ansDisplay.style.background = "#C8E6C9"; 
        ansDisplay.style.borderColor = "#4CAF50";
        ansDisplay.style.color = "#2E7D32";
        
        setTimeout(() => {
            ansDisplay.style.background = "#E1F5FE";
            ansDisplay.style.borderColor = "#03A9F4";
            ansDisplay.style.color = "#0288D1";
            generateQuestion(); // Infinite loop generation replaces location.reload()!
        }, 500);
        
        // Progress visualizer: Raise the rocket based on score!
        let targetBottom = Math.min(85, (score * 0.5) + 10);
        rocket.style.bottom = `${targetBottom}%`;
        
        // Sky gets darker showing altitude progress!
        if(score > 150) mathArea.style.background = "#2C3E50"; // Twilight
        else if(score > 50) mathArea.style.background = "#E3F2FD"; // Light blue
        
    } else {
        // --- Wrong Behavior ---
        streak = 0; // Streak breaks
        streakDisplay.textContent = `Streak: ${streak} 🔥`;
        
        // Red negative feedback flash
        ansDisplay.style.background = "#FFCDD2";
        ansDisplay.style.borderColor = "#F44336";
        ansDisplay.style.color = "#C62828";
        
        // Shake physics
        ansDisplay.classList.add('shake');
        
        setTimeout(() => {
            ansDisplay.classList.remove('shake');
            ansDisplay.style.background = "#E1F5FE";
            ansDisplay.style.borderColor = "#03A9F4";
            ansDisplay.style.color = "#0288D1";
            clearInput();
        }, 500);
    }
}

// Map the custom visual Numpad buttons to functions
document.querySelectorAll('.num-btn.num').forEach(btn => {
    btn.addEventListener('click', () => feedInput(btn.textContent));
});
document.querySelector('.num-btn.clear').addEventListener('click', clearInput);
document.querySelector('.num-btn.submit').addEventListener('click', submitAnswer);

// Allow Hardware Keyboard Typing Support
window.addEventListener('keydown', e => {
    if(!isNaN(e.key) && e.key !== " ") {
        feedInput(e.key);
    } else if (e.key === "Backspace" || e.key === "Escape") {
        clearInput();
    } else if (e.key === "Enter") {
        submitAnswer();
    }
});

// Boot loop
generateQuestion();
