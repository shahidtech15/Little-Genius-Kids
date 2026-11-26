/**
 * Main JavaScript File
 * Handles Global interactions: Theme toggling, Desktop dropdown, Mobile menu drawer,
 * Speech Synthesis, and the Reward Star system in Local Storage.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // Theme Toggle (Light / Dark Mode)
    // -------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement; // <html>

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
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
        themeToggleBtn.setAttribute(
            'aria-label',
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }

    // Utility: Play Sound using Speech Synthesis (respects Parent Dashboard toggle)
    window.playSound = function (text) {
        if (localStorage.getItem('littleGeniusSoundEnabled') === 'false') return;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(text);
            msg.rate = 0.9;
            msg.pitch = 1.2;
            window.speechSynthesis.speak(msg);
        }
    };

    // -------------------------------------------------------------
    // Desktop "Learn" Dropdown Menu
    // -------------------------------------------------------------
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    function closeAllDropdowns() {
        dropdowns.forEach(dd => {
            dd.classList.remove('open');
            const btn = dd.querySelector('.nav-dropdown-toggle');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    }

    dropdowns.forEach(dd => {
        const toggle = dd.querySelector('.nav-dropdown-toggle');
        if (!toggle) return;
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = !dd.classList.contains('open');
            closeAllDropdowns();
            if (willOpen) {
                dd.classList.add('open');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            closeAllDropdowns();
        }
    });

    // -------------------------------------------------------------
    // Mobile Navigation Menu Drawer (Single Source of Truth)
    // -------------------------------------------------------------
    const hamburger = document.getElementById('hamburger');
    const logoHref = document.querySelector('body > header .logo a')?.getAttribute('href') || 'index.html';
    const prefix = logoHref.replace(/index\.html$/, '');

    // Remove any legacy hardcoded mobile-menu or backdrop before injecting
    document.getElementById('mobile-menu')?.remove();
    document.getElementById('mobile-menu-backdrop')?.remove();

    const pathNorm = window.location.pathname.replace(/\\/g, '/');
    const currentFile = pathNorm.split('/').pop() || 'index.html';
    const inBlog = pathNorm.includes('/blog/');
    const inGames = pathNorm.includes('/games/');

    function isItemActive(target) {
        if (inBlog) return target === 'blog/index.html';
        if (inGames) return target === 'games.html';
        return currentFile === target;
    }

    function navLink(href, iconClass, label, matchTarget) {
        const activeClass = isItemActive(matchTarget || href) ? ' class="active"' : '';
        return `<a href="${prefix}${href}"${activeClass}><i class="${iconClass}"></i> ${label}</a>`;
    }

    const backdrop = document.createElement('div');
    backdrop.id = 'mobile-menu-backdrop';
    backdrop.className = 'mobile-menu-backdrop';

    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-menu';
    mobileMenu.className = 'mobile-menu';
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.innerHTML = `
        <div class="menu-header">
            <h3><i class="fa-solid fa-graduation-cap"></i> Menu</h3>
            <button id="close-menu" class="btn-icon" aria-label="Close Menu"><i class="fa-solid fa-times"></i></button>
        </div>
        <div class="mobile-nav-group-title">Explore</div>
        <nav class="mobile-nav-links" aria-label="Mobile Primary">
            ${navLink('index.html', 'fa-solid fa-house', 'Home')}
            ${navLink('games.html', 'fa-solid fa-gamepad', 'Games')}
            ${navLink('ai-course.html', 'fa-solid fa-robot', 'AI Course')}
            ${navLink('blog/index.html', 'fa-solid fa-newspaper', 'Blog')}
            ${navLink('parents.html', 'fa-solid fa-chart-line', 'Parent Dashboard')}
        </nav>
        <div class="mobile-nav-group-title">Learn</div>
        <nav class="mobile-nav-links" aria-label="Mobile Learn">
            ${navLink('abc.html', 'fa-solid fa-font', 'ABC Learning')}
            ${navLink('numbers.html', 'fa-solid fa-hashtag', 'Numbers')}
            ${navLink('colors-shapes.html', 'fa-solid fa-shapes', 'Colors & Shapes')}
            ${navLink('animals.html', 'fa-solid fa-paw', 'Animals')}
            ${navLink('rhymes.html', 'fa-solid fa-music', 'Rhymes & Videos')}
            ${navLink('worksheets.html', 'fa-solid fa-file-pdf', 'Worksheets')}
            ${navLink('periodic-table.html', 'fa-solid fa-flask', 'Periodic Table')}
        </nav>
        <div class="mobile-nav-group-title">Info</div>
        <nav class="mobile-nav-links" aria-label="Mobile Info">
            ${navLink('about.html', 'fa-solid fa-circle-info', 'About')}
            ${navLink('contact.html', 'fa-solid fa-envelope', 'Contact')}
        </nav>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(mobileMenu);

    const closeMenu = document.getElementById('close-menu');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        backdrop.classList.add('active');
        mobileMenu.setAttribute('aria-hidden', 'false');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        backdrop.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', openMobileMenu);
    }
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMobileMenu);
    }
    backdrop.addEventListener('click', closeMobileMenu);
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllDropdowns();
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });

    // -------------------------------------------------------------
    // Progress / Reward Star & Learning Time Tracking
    // -------------------------------------------------------------
    if (localStorage.getItem('littleGeniusStars') === null) {
        localStorage.setItem('littleGeniusStars', '0');
    }
    if (localStorage.getItem('littleGeniusTimeSeconds') === null) {
        localStorage.setItem('littleGeniusTimeSeconds', '0');
    }

    setInterval(() => {
        if (document.visibilityState === 'visible') {
            const secs = parseInt(localStorage.getItem('littleGeniusTimeSeconds'), 10) || 0;
            localStorage.setItem('littleGeniusTimeSeconds', String(secs + 15));
        }
    }, 15000);

    window.addStars = function (amount) {
        let currentStars = parseInt(localStorage.getItem('littleGeniusStars')) || 0;
        currentStars += amount;
        localStorage.setItem('littleGeniusStars', currentStars.toString());
        showStarRewardAnimation(amount);
    };

    function showStarRewardAnimation(amount) {
        const rewardOverlay = document.createElement('div');
        rewardOverlay.style.position = 'fixed';
        rewardOverlay.style.top = '50%';
        rewardOverlay.style.left = '50%';
        rewardOverlay.style.transform = 'translate(-50%, -50%)';
        rewardOverlay.style.zIndex = '9999';
        rewardOverlay.style.color = '#FFD700';
        rewardOverlay.style.fontSize = '4rem';
        rewardOverlay.style.fontWeight = 'bold';
        rewardOverlay.style.textShadow = '2px 2px 5px rgba(0,0,0,0.3)';
        rewardOverlay.style.pointerEvents = 'none';
        rewardOverlay.style.animation = 'bounceIn 1s forwards';

        rewardOverlay.innerHTML = `<i class="fa-solid fa-star"></i> +${amount}`;

        document.body.appendChild(rewardOverlay);

        setTimeout(() => {
            rewardOverlay.style.transition = 'opacity 0.5s';
            rewardOverlay.style.opacity = '0';
            setTimeout(() => rewardOverlay.remove(), 500);
        }, 2000);
    }
});
