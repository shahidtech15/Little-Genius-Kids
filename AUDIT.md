# Little Genius Kids — Initial Technical & Educational Audit

**Audit Date:** November 26, 2026  
**Repository:** `Little-Genius-Kids` (`main` branch baseline prior to `feat/v2-phase1-foundation`)  
**Live Baseline URL:** `https://little-genius-kids.vercel.app/`

---

## 1. Existing Technology Stack & Architecture

- **Frontend Stack:** Static HTML5, CSS3, and Vanilla JavaScript (ES6+), served directly without a bundler or Node build step.
- **Hosting & Deployment:** Vercel Static (`Other` preset, output directory `.`), connected to GitHub repository `shahidtech15/Little-Genius-Kids`.
- **Fonts & Icons:** Google Fonts (`Fredoka One`, `Nunito`, `Outfit`) and Font Awesome `6.4.0` via CDN.
- **Client-Side Persistence:** `localStorage` for theme preference (`theme`), sound toggle (`littleGeniusSoundEnabled`), stars (`littleGeniusStars`), active learning time (`littleGeniusTimeSeconds`), daily screen-time limit (`littleGeniusDailyLimit`), local parent profile (`littleGeniusParentProfile`), high scores (`hubHighScore`, `paddleBounceHS`, `sequenceRecallBest`), and newsletter email (`littleGeniusNewsletterEmail`).

---

## 2. Inventory of Existing Assets & Features

| Area | Count / Files | Status |
|---|---|---|
| Root Pages | 17 HTML files (`index.html`, `abc.html`, `numbers.html`, `colors-shapes.html`, `animals.html`, `rhymes.html`, `worksheets.html`, `periodic-table.html`, `games.html`, `ai-course.html`, `parents.html`, `login.html`, `about.html`, `contact.html`, `privacy-policy.html`, `terms-and-conditions.html`, `disclaimer.html`) | Working |
| Educational Games | 22 HTML game pages under `games/` + modular JS engines (`flying-bird.js`, `fruit-catcher.js`, `hungry-snake.js`, `math-adventure.js`, `memory-card.js`, `paddle-bounce.js`, `reaction-ninja.js`, `space-explorer.js`, `speed-racer.js`, `star-catcher.js`, `digital-coloring.js`) + Space Rocket modal in `games.html` | Working |
| Blog Resource Center | `blog/index.html` + 13 article HTML files (12 indexed on `blog/index.html`; `how-to-teach-abc-to-kids.html` overlaps `teach-abc.html`) | Working |
| Stylesheets | `css/style.css`, `css/abc.css`, `css/numbers.css`, `css/visuals.css`, `css/games.css` | Working |
| Shared Data | `data/generated_mcqs.json`, `data/grammar_questions.json` (present in repo, currently unused by live HTML) | Authored / Unused |
| Media & SEO | `images/favicon.svg`, `images/hero_child_tablet.jpg` (~82 KB), `images/hero-kids-learning.png`, `logo.png`, `robots.txt`, `sitemap.xml` (52 URLs) | Working |

---

## 3. Audit Findings Requiring Upgrade in Little Genius Kids 2.0

### A. Content Integrity & Trustworthiness
1. **Fabricated Testimonials & Unverified Metrics:**
   - `index.html` includes unverified parent testimonial cards (`Sarah M.`, `David L.`, `Emily R.`) with 5-star icons and `ui-avatars.com` avatars.
   - `about.html` displays hardcoded unverified stat counters (`10+ Expert Articles`, `50+ Fun Activities`, `100+ Free Resources`) and broad claims (`Every article is written by qualified educators`).
2. **Missing Mandatory Trust & Governance Pages:**
   - Missing dedicated **Children's Privacy Policy** (`children-privacy.html`), **Editorial Policy** (`editorial-policy.html`), **Accessibility Statement** (`accessibility.html`), and **Copyright Policy** (`copyright-policy.html`).

### B. Privacy, Tracking & Security
1. **Auto-Loaded Third-Party Tracking on Child-Facing Pages:**
   - All 53 HTML pages currently load Cookiebot (`uc.js`) and Google Analytics (`G-0MB4S6Q15T`) automatically inside `<head>`. On a child-directed platform (ages 2–12), third-party analytics and consent banners should remain disabled by default until legal/COPPA/GDPR-K requirements are formally configured and approved for adult-only sections.
2. **Missing HTTP Security Headers & Custom 404:**
   - No `vercel.json` exists to enforce `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, or `Content-Security-Policy`.
   - No custom `404.html` page exists to guide children and parents safely back to learning content on mistyped URLs.

### C. Information Architecture & Curriculum Gaps
1. **No Age-Based Learning Dashboards:**
   - Content is not organized into age-appropriate pathways (`Ages 2–3`, `Ages 3–5`, `Ages 5–7`, `Ages 8–12`).
2. **No Subject-Based Learning Modules:**
   - Missing structured subject pages (English & Phonics, Mathematics, Science, Geography, General Knowledge, Art & Creativity, Coding, Artificial Intelligence, Urdu, Logical Thinking) with learning objectives, explanations, examples, practice quizzes, and answer explanations.
3. **No Internal Site Search:**
   - Users cannot search across games, subjects, age levels, worksheets, or blog articles.
4. **No Today's Learning Adventure / Daily Planner:**
   - Parents cannot generate or check off a balanced daily activity plan tailored to their child's age group.

### D. Design System & Accessibility (WCAG 2.2 AA Readiness)
1. **Missing Skip Navigation & Focus Indicators:**
   - Pages lack a `<a class="skip-link" href="#main-content">Skip to main content</a>` link and standardized `:focus-visible` outlines.
2. **Missing Reduced-Motion & High-Contrast Controls:**
   - Animations (`bounce-pulse`, `float`, hover transforms) do not respect `@media (prefers-reduced-motion: reduce)` and there is no optional High-Contrast toggle for visually impaired learners.
3. **Design Token Alignment:**
   - Current palette uses legacy sunset coral (`#FF6B6B`) and sky blue (`#4DABF7`) rather than a unified, documented 2.0 component system (`#7C3AED` Primary Purple, `#38BDF8` Sky Blue, `#FBBF24` Accent Yellow, `#34D399` Success Green, `#FB7185` Creative Pink, `#F8FAFC` Background, `#1E293B` Primary Text).

### E. Performance & External Dependencies
- External Google Fonts (`fonts.googleapis.com`), Font Awesome (`cdnjs.cloudflare.com`), `ui-avatars.com`, and YouTube `<iframe>` embeds on `rhymes.html` represent third-party network dependencies. Long-term phases should self-host fonts/icons and move `rhymes.html` embeds to privacy-enhanced/parent-gated workflows.

---

## 4. Preservation Mandate

All existing working URLs (`/abc.html`, `/numbers.html`, `/animals.html`, `/colors-shapes.html`, `/rhymes.html`, `/worksheets.html`, `/periodic-table.html`, `/games.html`, `/games/*.html`, `/ai-course.html`, `/parents.html`, `/login.html`, `/blog/*.html`, `/about.html`, `/contact.html`, `/privacy-policy.html`, `/terms-and-conditions.html`, `/disclaimer.html`) must remain intact and functional throughout the 2.0 upgrade.
