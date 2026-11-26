# Changelog

## [2.0.0-phase1] - 2026-11-26 (Branch: `feat/v2-phase1-foundation`)

### Added
- `css/design-system.css` with 2.0 color palette (`#7C3AED`, `#38BDF8`, `#FBBF24`, `#34D399`, `#FB7185`, `#F8FAFC`, `#1E293B`), reusable cards/badges/buttons/progress/quiz/FAQ components, skip link, `:focus-visible`, high-contrast mode, dark mode, reduced-motion, and RTL support.
- `js/lesson-quiz.js` for lesson completion tracking (`littleGeniusCompletedLessons`) and practice quizzes with explanations and star rewards.
- `data/catalog.json`, `js/search.js`, and `search.html` for private client-side search across all learning resources.
- `learning/` directory (`index.html`, `ages-2-3.html`, `ages-3-5.html`, `ages-5-7.html`, `ages-8-12.html`).
- `subjects/` directory (`index.html` + `english.html`, `math.html`, `science.html`, `geography.html`, `general-knowledge.html`, `art.html`, `coding.html`, `ai.html`, `urdu.html`, `logic.html`).
- Trust & governance pages: `children-privacy.html`, `editorial-policy.html`, `accessibility.html`, `copyright-policy.html`, and `404.html`.
- `vercel.json` enforcing security response headers and Content Security Policy.
- Documentation suite: `README.md`, `AUDIT.md`, `IMPLEMENTATION_PLAN.md`, `FEATURE_STATUS.md`, `SECURITY.md`, `PRIVACY_DATA_MAP.md`, `TEST_REPORT.md`, `.env.example`.

### Changed
- Redesigned `index.html` for Little Genius Kids 2.0 with *Today's Learning Adventure*, age/subject grids, featured games, FAQ, and zero fabricated testimonials.
- Updated `about.html` to remove fabricated counters and unverified claims.
- Upgraded `js/main.js` and `css/style.css` with multi-dropdown 2.0 navigation, high-contrast toggle, EN/UR nav preference toggle, and expanded mobile drawer.
- Removed auto-loaded third-party Cookiebot & Google Analytics (`G-0MB4S6Q15T`) scripts across all 74 HTML files for child-privacy protection.
- Updated `sitemap.xml` to include all new crawlable age, subject, and trust pages.
