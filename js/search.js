/**
 * Little Genius Kids 2.0 — Client-Side Search Engine
 * Searches data/catalog.json locally without sending child search queries to external servers.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('site-search-form');
    const queryInput = document.getElementById('search-query');
    const typeSelect = document.getElementById('search-type');
    const ageSelect = document.getElementById('search-age');
    const subjectSelect = document.getElementById('search-subject');
    const resultsEl = document.getElementById('search-results');
    const statusEl = document.getElementById('search-status');

    if (!resultsEl || !statusEl) return;

    let catalog = [];
    try {
        const res = await fetch('data/catalog.json');
        catalog = await res.json();
    } catch (e) {
        statusEl.textContent = 'Unable to load the search catalog right now.';
        resultsEl.innerHTML = '<div class="lg-empty-state">Please browse <a href="learning/index.html">Learning by Age</a>, <a href="subjects/index.html">Subjects</a>, or <a href="games.html">Games</a>.</div>';
        return;
    }

    // Populate unique subjects
    const subjects = [...new Set(catalog.map(item => item.subject))].sort();
    subjects.forEach(sub => {
        const opt = document.createElement('option');
        opt.value = sub;
        opt.textContent = sub;
        subjectSelect.appendChild(opt);
    });

    // Read ?q= from URL if present
    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) queryInput.value = params.get('q');
    if (params.get('type')) typeSelect.value = params.get('type');
    if (params.get('age')) ageSelect.value = params.get('age');
    if (params.get('subject')) subjectSelect.value = params.get('subject');

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function highlightText(text, terms) {
        let out = escapeHtml(text);
        terms.filter(t => t.length >= 2).forEach(t => {
            const re = new RegExp(`(${escapeRegex(t)})`, 'gi');
            out = out.replace(re, '<mark style="background:#FEF3C7;color:#1E293B;padding:0 2px;border-radius:4px;">$1</mark>');
        });
        return out;
    }

    // Fuzzy token score: exact substring + simple 1-edit / prefix tolerance
    function scoreItem(item, terms) {
        if (!terms.length) return 1;
        const hayTitle = item.title.toLowerCase();
        const hayAll = `${item.title} ${item.description} ${item.subject} ${(item.keywords || []).join(' ')}`.toLowerCase();
        let score = 0;
        for (const t of terms) {
            if (hayTitle.includes(t)) score += 5;
            else if (hayAll.includes(t)) score += 2;
            else if (t.length >= 4 && hayAll.includes(t.slice(0, t.length - 1))) score += 1;
        }
        return score;
    }

    function typeLabel(type) {
        const map = {
            game: 'Game',
            subject: 'Subject',
            'age-guide': 'Age Dashboard',
            worksheet: 'Worksheet',
            article: 'Article',
            activity: 'Activity'
        };
        return map[type] || 'Resource';
    }

    function runSearch() {
        const q = queryInput.value.trim().toLowerCase();
        const terms = q.split(/\s+/).filter(Boolean);
        const typeFilter = typeSelect.value;
        const ageFilter = ageSelect.value;
        const subjectFilter = subjectSelect.value;

        const filtered = catalog
            .map(item => ({ item, score: scoreItem(item, terms) }))
            .filter(({ item, score }) => {
                if (terms.length && score === 0) return false;
                if (typeFilter !== 'all' && item.resourceType !== typeFilter) return false;
                if (ageFilter !== 'all' && !(item.ageGroups || []).includes(ageFilter)) return false;
                if (subjectFilter !== 'all' && item.subject !== subjectFilter) return false;
                return true;
            })
            .sort((a, b) => b.score - a.score);

        statusEl.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'result' : 'results'}${q ? ` for "${queryInput.value.trim()}"` : ''}`;

        if (!filtered.length) {
            resultsEl.innerHTML = `
                <div class="lg-empty-state" style="grid-column: 1 / -1;">
                    <h3>No matching resources found</h3>
                    <p style="margin: 0.75rem 0 1.25rem;">Try a shorter word like <em>alphabet</em>, <em>math</em>, <em>science</em>, <em>urdu</em>, or <em>puzzle</em> — or clear your filters.</p>
                    <div style="display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap;">
                        <button type="button" id="reset-search-btn" class="lg-btn lg-btn-primary">Reset Search</button>
                        <a href="games.html" class="lg-btn lg-btn-outline">Browse All Games</a>
                    </div>
                </div>
            `;
            document.getElementById('reset-search-btn')?.addEventListener('click', () => {
                queryInput.value = '';
                typeSelect.value = 'all';
                ageSelect.value = 'all';
                subjectSelect.value = 'all';
                runSearch();
            });
            return;
        }

        resultsEl.innerHTML = filtered.map(({ item }) => `
            <article class="lg-card">
                <div class="lg-card-meta">
                    <span class="lg-badge">${escapeHtml(typeLabel(item.resourceType))}</span>
                    <span class="lg-badge lg-badge-sky">${escapeHtml(item.subject)}</span>
                    <span class="lg-badge lg-badge-yellow">Ages ${escapeHtml((item.ageGroups || []).join(', '))}</span>
                </div>
                <h3>${highlightText(item.title, terms)}</h3>
                <p>${highlightText(item.description, terms)}</p>
                <div class="lg-card-actions">
                    <a href="${escapeHtml(item.url)}" class="lg-btn lg-btn-primary">Open Resource <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </article>
        `).join('');
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            runSearch();
        });
    }
    [queryInput, typeSelect, ageSelect, subjectSelect].forEach(el => {
        el.addEventListener('input', runSearch);
        el.addEventListener('change', runSearch);
    });

    runSearch();
});
