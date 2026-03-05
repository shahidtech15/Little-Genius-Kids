/**
 * Colors & Shapes Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const colorGrid = document.getElementById('color-grid');
    const shapeGrid = document.getElementById('shape-grid');

    const colors = [
        { name: 'Red', hex: '#FF6B6B' },
        { name: 'Blue', hex: '#4DABF7' },
        { name: 'Green', hex: '#69DB7C' },
        { name: 'Yellow', hex: '#FCC419' },
        { name: 'Orange', hex: '#FF922B' },
        { name: 'Purple', hex: '#CC5DE8' },
        { name: 'Pink', hex: '#FAA2C1' },
        { name: 'Brown', hex: '#8B4513' },
        { name: 'Black', hex: '#343A40' },
        { name: 'White', hex: '#F8F9FA' }
    ];

    const shapes = [
        { name: 'Circle', class: 'shape-circle' },
        { name: 'Square', class: 'shape-square' },
        { name: 'Triangle', class: 'shape-triangle' },
        { name: 'Rectangle', class: 'shape-rectangle' },
        { name: 'Star', class: 'shape-star', icon: 'fa-star' },
        { name: 'Heart', class: 'shape-heart', icon: 'fa-heart' }
    ];

    // Generate Colors
    colors.forEach(color => {
        const card = document.createElement('div');
        card.classList.add('visual-card');

        const visual = document.createElement('div');
        visual.style.width = '100px';
        visual.style.height = '100px';
        visual.style.backgroundColor = color.hex;
        visual.style.borderRadius = '20px'; // soft corners
        if (color.name === 'White') {
            visual.style.border = '2px solid #ccc';
        }

        const title = document.createElement('div');
        title.classList.add('visual-title');
        title.textContent = color.name;

        card.appendChild(visual);
        card.appendChild(title);

        card.addEventListener('click', () => {
            playSound(color.name);
            card.classList.add('played');
            setTimeout(() => card.classList.remove('played'), 1000);
            giveStar();
        });

        colorGrid.appendChild(card);
    });

    // Generate Shapes
    shapes.forEach(shape => {
        const card = document.createElement('div');
        card.classList.add('visual-card');

        const visual = document.createElement('div');
        visual.classList.add('shape', shape.class);

        if (shape.icon) {
            visual.innerHTML = `<i class="fa-solid ${shape.icon}"></i>`;
        }

        const title = document.createElement('div');
        title.classList.add('visual-title');
        title.textContent = shape.name;

        card.appendChild(visual);
        card.appendChild(title);

        card.addEventListener('click', () => {
            playSound(shape.name);
            card.classList.add('played');
            setTimeout(() => card.classList.remove('played'), 1000);
            giveStar();
        });

        shapeGrid.appendChild(card);
    });

    function playSound(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(text);
            msg.rate = 0.9;
            msg.pitch = 1.2;
            window.speechSynthesis.speak(msg);
        }
    }

    function giveStar() {
        if (Math.random() < 0.15 && window.addStars) {
            window.addStars(1);
        }
    }
});
