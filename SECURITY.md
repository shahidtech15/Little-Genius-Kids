# Security Architecture & Child Safety Controls

## 1. HTTP Security Headers (`vercel.json`)

Configured globally for `/(.*)` routes:
- `X-Content-Type-Options: nosniff` — Prevents MIME-type sniffing.
- `X-Frame-Options: SAMEORIGIN` — Protects against clickjacking.
- `Referrer-Policy: strict-origin-when-cross-origin` — Limits cross-origin referrer leakage.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` — Disables camera, microphone, and geolocation APIs across all pages.
- `Content-Security-Policy` — Restricts scripts, styles, fonts, frames, and form actions (`object-src 'none'`, `base-uri 'self'`, `form-action 'self'`).

## 2. Child Safety & Privacy Guarantees

- **No Child Accounts or PII:** Children do not submit names, emails, birth dates, locations, or photos.
- **No Public Profiles or Chat:** Zero child-to-child messaging, public profiles, or user-generated public feeds.
- **No Plaintext Server Passwords or Client Secrets:** The static site stores no secret keys or backend credentials in frontend code. `login.html` saves only an optional local display profile in browser `localStorage`.
- **Safe Output Escaping:** Dynamic search results (`js/search.js`), quiz rendering (`js/lesson-quiz.js`), and form confirmations (`contact.html`, `index.html`) escape HTML special characters before rendering.

## 3. Ongoing Hardening Roadmap

- Migrate remaining inline `<script>` / `<style>` handlers in legacy games into external JS/CSS modules so `'unsafe-inline'` can be removed from `Content-Security-Policy` in later phases.
- Self-host Google Fonts and Font Awesome icons to eliminate external CDN dependencies.
