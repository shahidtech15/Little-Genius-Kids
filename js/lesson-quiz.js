/**
 * Reusable Lesson Completion & Practice Quiz Engine
 * Powers age-based dashboards and subject-based learning modules.
 */
(function () {
    const STORAGE_KEY = 'littleGeniusCompletedLessons';

    function getCompleted() {
        try {
            const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            return Array.isArray(raw) ? raw : [];
        } catch (e) {
            return [];
        }
    }

    function saveCompleted(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function updateProgressBar() {
        const bar = document.getElementById('lesson-progress-bar');
        const label = document.getElementById('lesson-progress-label');
        const buttons = Array.from(document.querySelectorAll('.lg-complete-btn[data-lesson-id]'));
        if (!buttons.length) return;

        const completed = new Set(getCompleted());
        let doneCount = 0;

        buttons.forEach(btn => {
            const id = btn.dataset.lessonId;
            if (completed.has(id)) {
                doneCount++;
                btn.classList.add('is-done');
                btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Completed';
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('is-done');
                btn.innerHTML = '<i class="fa-regular fa-circle-check"></i> Mark Lesson Complete';
                btn.setAttribute('aria-pressed', 'false');
            }
        });

        const pct = Math.round((doneCount / buttons.length) * 100);
        if (bar) bar.style.width = `${pct}%`;
        if (label) label.textContent = `${doneCount} of ${buttons.length} lessons completed (${pct}%)`;
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.lg-complete-btn[data-lesson-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.lessonId;
                const list = getCompleted();
                if (!list.includes(id)) {
                    list.push(id);
                    saveCompleted(list);
                    if (window.addStars) window.addStars(2);
                } else {
                    saveCompleted(list.filter(x => x !== id));
                }
                updateProgressBar();
            });
        });

        updateProgressBar();

        // Initialize any [data-lg-quiz] containers
        document.querySelectorAll('[data-lg-quiz]').forEach(container => {
            let questions;
            try {
                questions = JSON.parse(container.getAttribute('data-lg-quiz'));
            } catch (e) {
                return;
            }
            if (!Array.isArray(questions) || !questions.length) return;

            const quizId = container.getAttribute('data-quiz-id') || 'quiz';
            let idx = 0;
            let score = 0;
            let answered = false;

            function renderQuestion() {
                answered = false;
                const item = questions[idx];
                container.innerHTML = `
                    <div class="lg-quiz-status">
                        <span><i class="fa-solid fa-circle-question"></i> Question ${idx + 1} of ${questions.length}</span>
                        <span>Score: ${score} / ${questions.length}</span>
                    </div>
                    <div class="lg-quiz-question">${escapeHtml(item.q)}</div>
                    <div class="lg-quiz-options">
                        ${item.options.map((opt, i) => `
                            <button type="button" class="lg-quiz-option" data-opt-index="${i}">
                                <span class="lg-badge">${String.fromCharCode(65 + i)}</span>
                                <span>${escapeHtml(opt)}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div class="lg-quiz-feedback" role="status" aria-live="polite"></div>
                    <div style="margin-top:1.25rem; display:flex; justify-content:flex-end; gap:0.75rem;">
                        <button type="button" class="lg-btn lg-btn-primary lg-quiz-next" style="display:none;">
                            ${idx + 1 < questions.length ? 'Next Question <i class="fa-solid fa-arrow-right"></i>' : 'See Results <i class="fa-solid fa-flag-checkered"></i>'}
                        </button>
                    </div>
                `;

                const optionBtns = container.querySelectorAll('.lg-quiz-option');
                const feedbackEl = container.querySelector('.lg-quiz-feedback');
                const nextBtn = container.querySelector('.lg-quiz-next');

                optionBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (answered) return;
                        answered = true;
                        const chosen = parseInt(btn.dataset.optIndex, 10);
                        const correctIdx = item.answerIndex;

                        optionBtns.forEach(b => { b.disabled = true; });

                        if (chosen === correctIdx) {
                            score++;
                            btn.classList.add('is-correct');
                            feedbackEl.className = 'lg-quiz-feedback show is-correct';
                            feedbackEl.innerHTML = `<i class="fa-solid fa-check"></i> Correct! ${escapeHtml(item.explanation || '')}`;
                            if (window.playSound) window.playSound('Correct!');
                        } else {
                            btn.classList.add('is-wrong');
                            if (optionBtns[correctIdx]) optionBtns[correctIdx].classList.add('is-correct');
                            feedbackEl.className = 'lg-quiz-feedback show is-wrong';
                            feedbackEl.innerHTML = `<i class="fa-solid fa-xmark"></i> Not quite. Answer: <strong>${escapeHtml(item.options[correctIdx])}</strong>. ${escapeHtml(item.explanation || '')}`;
                        }
                        nextBtn.style.display = 'inline-flex';
                    });
                });

                nextBtn.addEventListener('click', () => {
                    idx++;
                    if (idx < questions.length) {
                        renderQuestion();
                    } else {
                        renderSummary();
                    }
                });
            }

            function renderSummary() {
                const completed = getCompleted();
                let starMsg = '';
                if (!completed.includes(quizId)) {
                    completed.push(quizId);
                    saveCompleted(completed);
                    if (window.addStars) window.addStars(3);
                    starMsg = ' (+3 Stars earned!)';
                }
                container.innerHTML = `
                    <div style="text-align:center; padding:1rem 0;">
                        <p class="lg-badge lg-badge-green" style="margin-bottom:0.75rem;"><i class="fa-solid fa-award"></i> Practice Complete</p>
                        <h3 style="font-size:1.75rem; margin-bottom:0.5rem;">You scored ${score} out of ${questions.length}${starMsg}</h3>
                        <p style="color:var(--lg-muted); margin-bottom:1.5rem;">Review any lesson above or try the quiz again to reinforce what you learned.</p>
                        <button type="button" class="lg-btn lg-btn-primary lg-quiz-retry"><i class="fa-solid fa-rotate-right"></i> Try Again</button>
                    </div>
                `;
                container.querySelector('.lg-quiz-retry').addEventListener('click', () => {
                    idx = 0;
                    score = 0;
                    renderQuestion();
                });
            }

            renderQuestion();
        });
    });
})();
