// ==================== WEEKLY REVIEW ====================
let currentReviewData = null;

function getWeekNumber(d) {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7) + 1;
}

function getCurrentWeekKey() {
    const now = new Date();
    return `${now.getFullYear()}-W${getWeekNumber(now).toString().padStart(2, '0')}`;
}

function renderWeeklyReview() {
    const weekKey = getCurrentWeekKey();
    const reviews = get(K.weeklyReviews) || {};
    const currentReview = reviews[weekKey];
    
    document.getElementById('reviewWeekLabel').textContent = `Week ${getWeekNumber(new Date())} of ${new Date().getFullYear()}`;
    
    // Calculate week stats
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const time = arr(K.time).filter(e => e.date >= fmtDate(weekStart) && e.date <= fmtDate(weekEnd));
    const tasks = arr(K.tasks).filter(t => t.completedAt && t.completedAt >= fmtDate(weekStart));
    const journals = arr(K.journal).filter(j => j.date >= fmtDate(weekStart) && j.date <= fmtDate(weekEnd));
    const disc = get(K.discipline) || {};
    
    const totalHours = time.reduce((s, e) => s + (parseFloat(e.duration) || 0), 0);
    let avgDisc = 0;
    let discDays = 0;
    for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
        const dayDisc = disc[fmtDate(d)];
        if (dayDisc) {
            const dayTotal = Object.values(dayDisc).reduce((s, v) => s + v, 0);
            avgDisc += (dayTotal / 50) * 100;
            discDays++;
        }
    }
    avgDisc = discDays ? Math.round(avgDisc / discDays) : 0;
    
    document.getElementById('reviewHours').textContent = totalHours.toFixed(1) + 'h';
    document.getElementById('reviewTasks').textContent = tasks.length;
    document.getElementById('reviewDiscipline').textContent = avgDisc + '%';
    document.getElementById('reviewJournals').textContent = journals.length;
    
    // Update status
    const statusCard = document.getElementById('reviewStatusCard');
    const statusIcon = document.getElementById('reviewStatusIcon');
    const statusText = document.getElementById('reviewStatusText');
    const statusSub = document.getElementById('reviewStatusSub');
    const startBtn = document.getElementById('startReviewBtn');
    
    if (currentReview && currentReview.completed) {
        statusCard.style.background = 'linear-gradient(135deg, var(--bg-secondary), rgba(34,197,94,0.1))';
        statusCard.style.borderColor = 'var(--success)';
        statusIcon.textContent = '✅';
        statusText.textContent = 'Weekly review completed!';
        statusSub.textContent = `Completed on ${new Date(currentReview.completedAt).toLocaleDateString()}`;
        startBtn.textContent = 'View Review';
        startBtn.onclick = () => viewReview(weekKey);
    } else if (new Date().getDay() === 0) { // Sunday
        statusCard.style.background = 'linear-gradient(135deg, var(--bg-secondary), rgba(249,115,22,0.15))';
        statusCard.style.borderColor = 'var(--accent)';
        statusIcon.textContent = '📋';
        statusText.textContent = 'Time for your weekly review!';
        statusSub.textContent = 'Take 15 minutes to reflect on your week';
        startBtn.textContent = 'Start Review';
        startBtn.onclick = () => startWeeklyReview();
    } else {
        statusCard.style.background = 'var(--bg-secondary)';
        statusCard.style.borderColor = 'var(--border)';
        statusIcon.textContent = '📋';
        statusText.textContent = 'Weekly review not yet done';
        statusSub.textContent = 'Best done on Sunday evening';
        startBtn.textContent = 'Start Early';
        startBtn.onclick = () => startWeeklyReview();
    }
    
    // Render sections (if in-progress)
    if (currentReview && !currentReview.completed) {
        renderReviewSections(currentReview);
    } else {
        document.getElementById('reviewSections').innerHTML = '';
    }
    
    // Past reviews
    const pastKeys = Object.keys(reviews).filter(k => k !== weekKey && reviews[k].completed).sort().reverse().slice(0, 5);
    document.getElementById('pastReviews').innerHTML = pastKeys.length ? pastKeys.map(k => `
        <div class="list-item" onclick="viewReview('${k}')" style="cursor:pointer;">
            <span style="font-weight:500;">${k}</span>
            <span style="font-size:0.8rem;color:var(--text-muted);">${new Date(reviews[k].completedAt).toLocaleDateString()}</span>
        </div>
    `).join('') : '<div class="empty">No past reviews yet</div>';
}

function startWeeklyReview() {
    const weekKey = getCurrentWeekKey();
    const reviews = get(K.weeklyReviews) || {};
    
    if (!reviews[weekKey]) {
        reviews[weekKey] = {
            startedAt: new Date().toISOString(),
            completed: false,
            sections: {}
        };
        set(K.weeklyReviews, reviews);
    }
    
    renderReviewSections(reviews[weekKey]);
}

function renderReviewSections(review) {
    const sections = [
        { id: 'wins', icon: '🏆', title: 'Wins', question: 'What went well this week? Where did your Analytical or Restorative strengths create value?' },
        { id: 'challenges', icon: '💪', title: 'Challenges', question: 'What was difficult? Did you over-deliberate or avoid action on anything? (Watch Deliberative blind spot)' },
        { id: 'learning', icon: '📖', title: 'Learning (Learner)', question: 'What did you learn this week? New concepts, skills, or insights? Feed your Learner.' },
        { id: 'communication', icon: '💬', title: 'Communication Growth', question: 'How did you practice communication this week? Any presentations, tough conversations, or professional writing? (Your #1 growth area)' },
        { id: 'command', icon: '⚡', title: 'Command & Leadership', question: 'Where did you take charge, speak up, or influence a decision? Where could you have but didn\'t?' },
        { id: 'reflection_action', icon: '🎯', title: 'Reflection → Action', question: 'Did you convert your thinking into decisive action? Or did analysis paralysis hold you back? (Persistent 26% — push this.)' },
        { id: 'priorities', icon: '📋', title: 'Next Week Priorities', question: 'Top 3 priorities for next week. Include at least one communication challenge.' },
        { id: 'gratitude', icon: '🙏', title: 'Gratitude', question: 'What are you grateful for this week?' }
    ];
    
    document.getElementById('reviewSections').innerHTML = `
        ${sections.map(s => `
            <div class="review-section">
                <div class="review-section-title">${s.icon} ${s.title}</div>
                <div class="review-prompt">
                    <div class="review-prompt-question">${s.question}</div>
                </div>
                <textarea class="review-textarea" id="review_${s.id}" placeholder="Your thoughts..." oninput="autoSaveReview('${s.id}', this.value)">${review.sections?.[s.id] || ''}</textarea>
            </div>
        `).join('')}
        <div style="margin-top:20px;display:flex;gap:12px;justify-content:center;">
            <button class="btn btn-primary" onclick="completeWeeklyReview()">✅ Complete Review</button>
        </div>
    `;
}

function autoSaveReview(sectionId, value) {
    const weekKey = getCurrentWeekKey();
    const reviews = get(K.weeklyReviews) || {};
    if (!reviews[weekKey]) reviews[weekKey] = { sections: {} };
    if (!reviews[weekKey].sections) reviews[weekKey].sections = {};
    reviews[weekKey].sections[sectionId] = value;
    set(K.weeklyReviews, reviews);
}

function completeWeeklyReview() {
    const weekKey = getCurrentWeekKey();
    const reviews = get(K.weeklyReviews) || {};
    if (!reviews[weekKey]) return;
    
    reviews[weekKey].completed = true;
    reviews[weekKey].completedAt = new Date().toISOString();
    set(K.weeklyReviews, reviews);
    
    toast('🎉 Weekly review completed!');
    renderWeeklyReview();
}

function viewReview(weekKey) {
    const reviews = get(K.weeklyReviews) || {};
    const review = reviews[weekKey];
    if (!review) return;
    
    const sections = [
        { id: 'wins', icon: '🏆', title: 'Wins' },
        { id: 'challenges', icon: '💪', title: 'Challenges' },
        { id: 'lessons', icon: '💡', title: 'Lessons' },
        { id: 'improvements', icon: '🔧', title: 'Improvements' },
        { id: 'priorities', icon: '🎯', title: 'Next Week' },
        { id: 'gratitude', icon: '🙏', title: 'Gratitude' }
    ];
    
    document.getElementById('reviewDetailTitle').textContent = `Review: ${weekKey}`;
    document.getElementById('reviewDetailContent').innerHTML = sections.map(s => `
        <div style="margin-bottom:16px;">
            <div style="font-weight:600;margin-bottom:8px;">${s.icon} ${s.title}</div>
            <div style="background:var(--bg-tertiary);padding:12px;border-radius:8px;color:var(--text-secondary);white-space:pre-wrap;">${esc(review.sections?.[s.id] || '(No entry)')}</div>
        </div>
    `).join('');
    
    openModal('reviewDetailModal');
}

