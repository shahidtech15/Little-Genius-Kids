// Digital Coloring Canvas Engine (Upgraded from User Snippet)
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

const colors = document.querySelectorAll('.color-circle');
const sizes = document.querySelectorAll('.brush-size');
const eraserBtn = document.getElementById('eraser-btn');
const clearBtn = document.getElementById('clear-btn');
const saveBtn = document.getElementById('save-btn');

let drawing = false;
let currentColor = '#000000';
let currentSize = 8;
let isEraser = false;

if (canvas && ctx) {
    // Advanced Responsive Dynamic Scaling
    function setupCanvas() {
        const container = document.querySelector('.game-container');
        // Let the container define the true max width, minus padding
        const displayWidth = Math.min(800, container.clientWidth - 40);
        // We use a 4:3 aspect ratio block for drawing
        const displayHeight = displayWidth * (3/4);
        
        let tempCanvas = document.createElement('canvas');
        
        // Save current strokes before resizing (which wipes canvas natively)
        if(canvas.width > 0) {
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            tempCanvas.getContext('2d').drawImage(canvas, 0, 0);
        }

        canvas.width = displayWidth;
        canvas.height = displayHeight;
        
        // Ensure a solid white background (transparent background turns black on jpeg export)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Restore old drawing if it existed
        if(tempCanvas.width > 0) {
            ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
        }
        
        // Must redefine context state after each resize
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    // Run setup initially
    setupCanvas();
    window.addEventListener('resize', setupCanvas);

    // Get true internal canvas coordinates relative to CSS scale
    function getCursorPos(e) {
        let rect = canvas.getBoundingClientRect();
        let scaleX = canvas.width / rect.width;
        let scaleY = canvas.height / rect.height;
        
        let clientX = e.clientX;
        let clientY = e.clientY;
        
        if(e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    function startPosition(e) {
        drawing = true;
        draw(e); // draw a single dot even if no move
        if(e.type.includes('touch')) e.preventDefault();
    }

    function endPosition() {
        drawing = false;
        ctx.beginPath(); // breaks the stroke so paths don't link together
    }

    function draw(e) {
        if (!drawing) return;
        if(e.type.includes('touch')) e.preventDefault(); // stops scrolling!
        
        let pos = getCursorPos(e);
        
        ctx.lineWidth = currentSize;
        ctx.strokeStyle = isEraser ? '#ffffff' : currentColor;
        
        // Using continuous line strokes replacing the raw blocky 'fillRect'
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        
        // Re-begin path natively connected to allow smooth curves
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    // Mouse Listeners
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseleave', endPosition);

    // Touch Listeners
    canvas.addEventListener('touchstart', startPosition, {passive: false});
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchcancel', endPosition);
    canvas.addEventListener('touchmove', draw, {passive: false});

    // --- Tools UI Logic ---
    
    colors.forEach(c => {
        c.addEventListener('click', () => {
            colors.forEach(col => col.classList.remove('active'));
            eraserBtn.classList.remove('active');
            c.classList.add('active');
            currentColor = c.dataset.color;
            isEraser = false;
        });
    });

    sizes.forEach(s => {
        s.addEventListener('click', () => {
            sizes.forEach(sz => sz.classList.remove('active'));
            s.classList.add('active');
            currentSize = parseInt(s.dataset.size);
        });
    });

    if(eraserBtn) {
        eraserBtn.addEventListener('click', () => {
            colors.forEach(col => col.classList.remove('active'));
            eraserBtn.classList.add('active');
            isEraser = true;
        });
    }

    if(clearBtn) {
        clearBtn.addEventListener('click', () => {
            // Animative clear confirmation
            canvas.style.transform = "scale(0.95)";
            setTimeout(() => canvas.style.transform = "scale(1)", 150);
            
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    }

    if(saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Little bump effect
            saveBtn.style.transform = "scale(1.1)";
            setTimeout(()=> saveBtn.style.transform = "scale(1)", 200);

            const link = document.createElement('a');
            link.download = 'little-genius-art.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
}
