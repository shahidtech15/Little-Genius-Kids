/**
 * Animals Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const animalGrid = document.getElementById('animal-grid');

    const animals = [
        { name: 'Dog', icon: 'fa-dog', soundDesc: 'Woof woof!' },
        { name: 'Cat', icon: 'fa-cat', soundDesc: 'Meow!' },
        { name: 'Horse', icon: 'fa-horse', soundDesc: 'Neigh!' },
        { name: 'Cow', icon: 'fa-cow', soundDesc: 'Moo!' },
        { name: 'Frog', icon: 'fa-frog', soundDesc: 'Ribbit!' },
        { name: 'Bird', icon: 'fa-dove', soundDesc: 'Tweet tweet!' },
        { name: 'Fish', icon: 'fa-fish', soundDesc: 'Glub glub!' },
        { name: 'Bug', icon: 'fa-bug', soundDesc: 'Bzzzz!' },
        { name: 'Spider', icon: 'fa-spider', soundDesc: 'Creep creep!' },
        { name: 'Hippo', icon: 'fa-hippo', soundDesc: 'Grunt!' }
    ];

    // Generate Animals
    animals.forEach(animal => {
        const card = document.createElement('div');
        card.classList.add('visual-card');

        const iconDiv = document.createElement('div');
        iconDiv.classList.add('animal-img');
        iconDiv.innerHTML = `<i class="fa-solid ${animal.icon}"></i>`;

        const title = document.createElement('div');
        title.classList.add('visual-title');
        title.textContent = animal.name;

        card.appendChild(iconDiv);
        card.appendChild(title);

        card.addEventListener('click', () => {
            playSound(animal.name, animal.soundDesc);

            // Visual bounce
            card.classList.add('bounce-in');
            setTimeout(() => card.classList.remove('bounce-in'), 1000);

            card.classList.add('played');
            setTimeout(() => card.classList.remove('played'), 1000);

            if (Math.random() < 0.2 && window.addStars) {
                window.addStars(1);
            }
        });

        animalGrid.appendChild(card);
    });

    function playSound(name, soundDesc) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const msg1 = new SpeechSynthesisUtterance(`This is a ${name}.`);
            msg1.rate = 0.9;
            msg1.pitch = 1.1;

            const msg2 = new SpeechSynthesisUtterance(soundDesc);
            msg2.rate = 0.8;
            msg2.pitch = 1.5; // High pitch for animal sounds

            window.speechSynthesis.speak(msg1);
            setTimeout(() => {
                window.speechSynthesis.speak(msg2);
            }, 1000);
        }
    }
});
