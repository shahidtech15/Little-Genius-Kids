# Privacy & Data Map — Little Genius Kids 2.0

## 1. Local Browser Storage (`localStorage`)

All learning progress and preferences stay strictly on the user's device:

| Key | Purpose | Contains PII? | User Control |
|---|---|---|---|
| `theme` | Light / Dark theme preference | No | Header Theme toggle |
| `littleGeniusContrast` | Normal / High-Contrast mode | No | Header Contrast toggle |
| `littleGeniusLang` | Selected nav language (`en` / `ur`) | No | Header Language button |
| `littleGeniusStars` | Locally earned activity stars | No | Parent Dashboard → Reset Progress |
| `littleGeniusTimeSeconds` | Active visible session time | No | Parent Dashboard → Reset Progress |
| `littleGeniusCompletedLessons` | Completed lesson & quiz IDs | No | Browser site data clear |
| `littleGeniusSoundEnabled` | Speech synthesis on/off toggle | No | Parent Dashboard → App Settings |
| `littleGeniusDailyLimit` | Daily screen-time guidance | No | Parent Dashboard → App Settings |
| `littleGeniusParentProfile` | Optional local parent display name/email | Local only | Never transmitted off-device |
| `littleGeniusNewsletterEmail` | Locally saved email preference | Local only | Never transmitted off-device |
| `hubHighScore`, `paddleBounceHS`, `sequenceRecallBest` | Local game high scores | No | Browser site data clear |

## 2. Third-Party Services & Network Requests

| Service | Status in Phase 1 | Purpose / Privacy Notes |
|---|---|---|
| Google Analytics (`G-0MB4S6Q15T`) | **Removed** | Disabled across all 74 HTML pages pending COPPA/GDPR-K review |
| Cookiebot (`uc.js`) | **Removed** | Removed alongside third-party analytics trackers |
| Google Fonts (`fonts.googleapis.com`) | Active (CSS) | Serves `Fredoka`, `Nunito`, `Outfit`, `Noto Nastaliq Urdu`; candidate for self-hosting |
| Font Awesome (`cdnjs.cloudflare.com`) | Active (CSS) | Icon font stylesheet; candidate for self-hosting |
| YouTube Embeds (`rhymes.html`) | Active on `rhymes.html` only | External video iframes; parent-supervised page |
