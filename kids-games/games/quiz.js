// Element Match Logic (Assigned safely to games/quiz.js)

let elements = [
    {symbol: "H", name: "Hydrogen"},
    {symbol: "O", name: "Oxygen"},
    {symbol: "C", name: "Carbon"},
    {symbol: "N", name: "Nitrogen"},
    {symbol: "He", name: "Helium"}, // Added a few extra kid-friendly elements to make it fun!
    {symbol: "Au", name: "Gold"}
];
  
let score = 0;
let pickedSymbolCard = null; // Tracks both the DOM element and the data object

function shuffle(a) { return a.sort(() => Math.random() - 0.5); }

// Generate two separate shuffled arrays so the visual grid is randomized
let symbols = shuffle([...elements]);
let names = shuffle([...elements]);

function render() {
    let symGrid = document.getElementById("symbolsGrid");
    let nameGrid = document.getElementById("namesGrid");
    
    if(!symGrid || !nameGrid) return; // Prevent crashing if loaded on incorrect page

    symGrid.innerHTML = "";
    nameGrid.innerHTML = "";

    symbols.forEach(e => {
        let btn = document.createElement("button");
        btn.innerText = e.symbol;
        btn.className = "card";
        btn.onclick = () => pickSymbol(btn, e);
        symGrid.appendChild(btn);
    });

    names.forEach(e => {
        let btn = document.createElement("button");
        btn.innerText = e.name;
        btn.className = "card";
        btn.onclick = () => pickName(btn, e);
        nameGrid.appendChild(btn);
    });
}

function pickSymbol(btn, s) {
    // Clear previously selected buttons to prevent multi-select bugs
    document.querySelectorAll('#symbolsGrid .card').forEach(c => {
        if(!c.classList.contains('correct')) c.classList.remove('selected', 'wrong');
    });
    
    // Highlight the new selection
    btn.classList.add('selected');
    pickedSymbolCard = { btn: btn, data: s };
}

function pickName(btn, n) {
    if (!pickedSymbolCard) return; // Must select a symbol first!

    if (pickedSymbolCard.data.name === n.name) {
        // --- Correct Match! ---
        score += 10;
        
        // Lock both buttons out of play
        pickedSymbolCard.btn.classList.remove('selected', 'wrong');
        pickedSymbolCard.btn.classList.add('correct');
        btn.classList.add('correct');
        
        pickedSymbolCard = null; // Reset holding hand
    } else {
        // --- Wrong Match! ---
        btn.classList.add('wrong');
        pickedSymbolCard.btn.classList.add('wrong');
        
        // Remove the shake error classes after animation completes so they can retry
        setTimeout(() => {
            btn.classList.remove('wrong');
            if(pickedSymbolCard && !pickedSymbolCard.btn.classList.contains('correct')) {
                pickedSymbolCard.btn.classList.remove('wrong', 'selected');
            }
            pickedSymbolCard = null;
        }, 500);
    }
    
    document.getElementById("scoreDisplay").innerText = "Score: " + score;
    
    // Check for win state
    if(document.querySelectorAll('#symbolsGrid .correct').length === elements.length) {
        setTimeout(() => alert("You matched them all! Great Job!"), 300);
    }
}

// Boot the game
render();
