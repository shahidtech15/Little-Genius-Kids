# Little Genius Kids 2.0

**Learn. Play. Explore. Grow.**  
A free, ad-free, privacy-first digital learning academy for children aged 2–12, parents, and teachers.

---

## Key Features (Phase 1 Completed)

- **Reusable 2.0 Design System (`css/design-system.css`, `css/style.css`):** Consistent color tokens, accessible focus rings, 44×44px touch targets, skip navigation, High-Contrast toggle, Dark Mode toggle, `prefers-reduced-motion` support, and RTL support for Urdu.
- **Redesigned Homepage (`index.html`):** Hero, Learning by Age (4 levels), Learning by Subject (10 subjects), Featured Games, interactive *Today's Learning Adventure* daily planner, interactive Animal Matching mini-demo, FAQ accordion, adult newsletter signup, and 2.0 footer.
- **Age-Based Learning Dashboards (`learning/`):** Guided dashboards for Toddlers (`2–3`), Preschool (`3–5`), Early Primary (`5–7`), and Young Explorers (`8–12`) with local progress tracking and interactive quizzes (`js/lesson-quiz.js`).
- **Subject-Based Modules (`subjects/`):** 10 structured subject modules (English & Phonics, Math, Science, Geography, General Knowledge, Art, Coding, AI, bilingual RTL Urdu, and Logical Thinking).
- **Private Local Search (`search.html`, `js/search.js`, `data/catalog.json`):** Searches all games, subjects, age levels, worksheets, and blog articles in-browser without external tracking.
- **Interactive Games & Printables:** 22 browser games + Periodic Table + Space Rocket modal (`games.html`), A–Z tracing (`abc.html`), 1–100 counting (`numbers.html`), and modal printable worksheets (`worksheets.html`).
- **Trust, Legal & Security (`vercel.json`):** Added HTTP security headers, `404.html`, `children-privacy.html`, `editorial-policy.html`, `accessibility.html`, and `copyright-policy.html`; removed auto-loading third-party Cookiebot/GA trackers from child-facing pages.

---

## Local Development

No build step is required. Open with any static HTTP server from the repository root:

```bash
npx serve .
```

Then visit `http://localhost:3000`.

---

## Project Documentation

- `AUDIT.md` — Initial repository & site audit
- `IMPLEMENTATION_PLAN.md` — 7-phase roadmap & technical architecture
- `FEATURE_STATUS.md` — Phase-by-phase implementation status
- `CHANGELOG.md` — Detailed change log
- `SECURITY.md` — Security headers, CSP & child-safety controls
- `PRIVACY_DATA_MAP.md` — Local storage & third-party service inventory
- `TEST_REPORT.md` — Automated verification results
- `.env.example` — Template for optional future environment variables
