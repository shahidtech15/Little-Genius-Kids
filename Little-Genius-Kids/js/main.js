/**
 * Main JavaScript File
 * Handles Global interactions like Theme toggling and Mobile menu.
 * Initializes the Reward Star system in Local Storage.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // Theme Toggle (Light / Dark Mode)
    // -------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement; // <html>

    // Check local storage for theme preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    root.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const current = root.getAttribute('data-theme');
            const newTheme = current === 'light' ? 'dark' : 'light';

            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun'); // Show sun icon in dark mode
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon'); // Show moon icon in light mode
        }
    }

    // Utility: Play Sound using Speech Synthesis
    window.playSound = function (text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(text);
            msg.rate = 0.9;
            msg.pitch = 1.2;
            window.speechSynthesis.speak(msg);
        }
    };

    // -------------------------------------------------------------
    // Mobile Navigation Menu Toggle
    // -------------------------------------------------------------
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');

    if (hamburger && mobileMenu && closeMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });

        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    // -------------------------------------------------------------
    // Progress / Reward Star System Initialization
    // -------------------------------------------------------------
    // Check if stars are initialized in local storage
    if (localStorage.getItem('littleGeniusStars') === null) {
        localStorage.setItem('littleGeniusStars', '0');
    }

    // Generic function to add stars, could be called by sub-pages
    window.addStars = function (amount) {
        let currentStars = parseInt(localStorage.getItem('littleGeniusStars')) || 0;
        currentStars += amount;
        localStorage.setItem('littleGeniusStars', currentStars.toString());

        // Optional: Play a cheerful sound or show an animation globally
        showStarRewardAnimation(amount);
    };

    function showStarRewardAnimation(amount) {
        // Create an overlay to show the reward
        const rewardOverlay = document.createElement('div');
        rewardOverlay.style.position = 'fixed';
        rewardOverlay.style.top = '50%';
        rewardOverlay.style.left = '50%';
        rewardOverlay.style.transform = 'translate(-50%, -50%)';
        rewardOverlay.style.zIndex = '9999';
        rewardOverlay.style.color = '#FFD700'; // Gold
        rewardOverlay.style.fontSize = '4rem';
        rewardOverlay.style.fontWeight = 'bold';
        rewardOverlay.style.textShadow = '2px 2px 5px rgba(0,0,0,0.3)';
        rewardOverlay.style.pointerEvents = 'none';
        rewardOverlay.style.animation = 'bounceIn 1s forwards';

        rewardOverlay.innerHTML = `<i class="fa-solid fa-star"></i> +${amount}`;

        document.body.appendChild(rewardOverlay);

        // Remove after 2 seconds
        setTimeout(() => {
            rewardOverlay.style.transition = 'opacity 0.5s';
            rewardOverlay.style.opacity = '0';
            setTimeout(() => rewardOverlay.remove(), 500);
        }, 2000);
    }
});
