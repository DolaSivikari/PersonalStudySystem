// ==================== DASHBOARD ====================
function refreshDashboard() {
    const s=getSettings(), tasks=arr(K.tasks), time=arr(K.time), disc=get(K.discipline)||{};
    const h=new Date().getHours();
    document.getElementById('greeting').textContent = h<12?'morning':h<17?'afternoon':'evening';
    document.getElementById('userName').textContent = s.name || 'Hebun';
    document.getElementById('heroVision').textContent = s.vision ? '"'+s.vision+'"' : '';
    
    // Calculate streak
    const streak = calcDisciplineStreak();
    document.getElementById('statStreak').textContent = streak;
    
    // Today's discipline score
    const todayDisc = disc[today()] || {};
    const todayScore = DISCIPLINES.reduce((s,d) => s + (todayDisc[d.id] || 0), 0);
    const maxScore = DISCIPLINES.reduce((s,d) => s + d.max, 0);
    document.getElementById('statDiscipline').textContent = Math.round((todayScore/maxScore)*100) + '%';
    
    const ws = new Date(); ws.setDate(ws.getDate()-ws.getDay());
    document.getElementById('statHours').textContent = time.filter(e=>e.date>=fmtDate(ws)).reduce((s,e)=>s+(parseFloat(e.duration)||0),0).toFixed(1);
    document.getElementById('statTasks').textContent = tasks.filter(t=>!t.completed&&t.dueDate&&t.dueDate<=today()).length;
    
    // Dashboard tip
    showTip('dashboard', 'dashboardTip');
    
    // Today's learning
    renderDashLearn();
    
    // Call enhanced dashboard features
    refreshDashboardEnhanced();

    // Blind spot alert
    renderBlindSpot();
}

function renderBlindSpot() {
    const spots = typeof BLIND_SPOTS !== 'undefined' ? BLIND_SPOTS : [];
    if (spots.length === 0) return;

    // Rotate daily based on day-of-year
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - startOfYear) / 86400000);
    const spot = spots[dayOfYear % spots.length];

    const card = document.getElementById('blindSpotCard');
    if (!card) return;
    card.style.borderLeft = '3px solid ' + spot.color;
    card.style.background = spot.color + '11';
    card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
            <div style="font-weight:700;font-size:0.9rem;">${spot.icon} Blind Spot Check: ${esc(spot.strength)}</div>
            <span style="font-size:0.7rem;padding:2px 8px;background:${spot.color}22;color:${spot.color};border-radius:4px;">Daily</span>
        </div>
        <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">${esc(spot.alert)}</div>
        <div style="font-size:0.85rem;color:var(--accent);font-weight:500;">→ ${esc(spot.action)}</div>
    `;
}

function renderDashLearn() {
    const progress = get(K.learnProgress) || {};
    let next = null;
    for (const [pathId, path] of Object.entries(PATHWAYS)) {
        for (const mod of path.modules) {
            if (!progress[mod.id] || progress[mod.id] < mod.hours) {
                next = { pathId, path, mod, done: progress[mod.id] || 0 };
                break;
            }
        }
        if (next) break;
    }
    if (next) {
        const pct = Math.round((next.done / next.mod.hours) * 100);
        document.getElementById('dashLearn').innerHTML = `
            <div class="pathway-card active">
                <div class="pathway-header">
                    <span class="pathway-title">${next.mod.name}</span>
                    <span class="pathway-badge">${next.path.name}</span>
                </div>
                <div class="pathway-desc">${next.mod.topics.slice(0,3).join(', ')}</div>
                <div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:6px;">${next.done}/${next.mod.hours} hours</div>
            </div>
        `;
    } else {
        document.getElementById('dashLearn').innerHTML = '<div class="empty">All pathways complete! 🎉</div>';
    }
}

function renderWisdom() {
    const idx = Math.floor(Math.random() * WISDOM.length);
    const w = WISDOM[idx];
    document.getElementById('dashWisdom').innerHTML = `
        <div class="wisdom-card">
            <div class="wisdom-quote">"${w.quote}"</div>
            <div class="wisdom-source">— ${w.source}</div>
        </div>
    `;
}
function nextWisdom() { renderWisdom(); }

function showTip(page, containerId) {
    const tips = TIPS[page];
    if (!tips || !tips.length) return;
    const tip = tips[Math.floor(Math.random() * tips.length)];
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="tip-banner ${tip.type}">
                <div class="tip-icon">${tip.type==='warning'?'⚠️':tip.type==='success'?'💪':'💡'}</div>
                <div class="tip-text"><strong>${tip.title}</strong>${tip.text}</div>
            </div>
        `;
    }
}


// ==================== QUOTES & MOTIVATION ====================
function getMotivationalQuotes() {
    return [
        { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
        { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
        { text: "Excellence is not a destination but a continuous journey.", author: "Brian Tracy" },
        { text: "Small disciplines repeated with consistency lead to great achievements.", author: "John Maxwell" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
        { text: "The future belongs to those who prepare for it today.", author: "Malcolm X" },
        { text: "Strive for progress, not perfection.", author: "Unknown" },
        { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
        { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
        { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
        { text: "The difference between try and triumph is just a little umph!", author: "Marvin Phillips" },
        { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
        { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
        { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" }
    ];
}

function getDailyQuote() {
    const quotes = getMotivationalQuotes();
    // Use day of year to get consistent daily quote
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return quotes[dayOfYear % quotes.length];
}

// ==================== ENHANCED DASHBOARD ====================
function refreshDashboardEnhanced() {
    // SRS due count
    const cards = arr(K.flashcards);
    const todayStr = today();
    const dueCards = cards.filter(c => !c.nextReview || c.nextReview <= todayStr).length;
    
    const srsEl = document.getElementById('dashSRSDue');
    if (srsEl) srsEl.textContent = dueCards;
    
    const statSRS = document.getElementById('statSRS');
    if (statSRS) statSRS.textContent = `${dueCards} cards due`;
    
    // Weekly review status
    const weekKey = getCurrentWeekKey();
    const reviews = get(K.weeklyReviews) || {};
    const reviewStatus = document.getElementById('dashReviewStatus');
    if (reviewStatus) {
        reviewStatus.textContent = reviews[weekKey]?.completed ? '✓ Done' : 'Pending';
        reviewStatus.style.color = reviews[weekKey]?.completed ? 'var(--success)' : 'var(--warning)';
    }
    
    // Follow-ups
    const contacts = arr(K.contacts);
    const followups = contacts.filter(c => c.followupDate && c.followupDate <= todayStr).length;
    const followupEl = document.getElementById('dashFollowups');
    if (followupEl) followupEl.textContent = followups;
    
    // Today's focus from protocol
    const protocol = get(K.protocol) || {};
    const todayProtocol = protocol[todayStr];
    const focusTask = document.getElementById('todayFocusTask');
    const focusMeta = document.getElementById('todayFocusMeta');
    if (focusTask && todayProtocol?.intention) {
        focusTask.textContent = todayProtocol.intention;
        focusMeta.textContent = `Energy: ${todayProtocol.energy || '?'}/10 • Protocol: ${todayProtocol.completed ? '✓' : 'Pending'}`;
    }
    
    // Calendar preview
    const events = arr(K.events);
    const tasks = arr(K.tasks).filter(t => t.dueDate && !t.completed);
    const upcoming = [...events, ...tasks.map(t => ({ ...t, date: t.dueDate, type: 'task' }))]
        .filter(e => e.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3);
    
    const calPreview = document.getElementById('dashCalendarPreview');
    if (calPreview) {
        calPreview.innerHTML = upcoming.length ? upcoming.map(e => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);">
                <div style="width:45px;text-align:center;">
                    <div style="font-size:1.1rem;font-weight:700;color:var(--accent);">${new Date(e.date + 'T00:00').getDate()}</div>
                    <div style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;">${new Date(e.date + 'T00:00').toLocaleDateString('en', {month:'short'})}</div>
                </div>
                <div style="flex:1;">
                    <div style="font-weight:500;">${esc(e.title)}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${e.time || 'All day'} ${e.type ? `• ${e.type}` : ''}</div>
                </div>
            </div>
        `).join('') : '<div class="empty">No upcoming events</div>';
    }
    
    // Daily quote
    const quote = getDailyQuote();
    const quoteText = document.getElementById('dailyQuoteText');
    const quoteAuthor = document.getElementById('dailyQuoteAuthor');
    if (quoteText) quoteText.textContent = `"${quote.text}"`;
    if (quoteAuthor) quoteAuthor.textContent = `— ${quote.author}`;
    
    // Sparklines
    renderSparklines();
}

function renderSparklines() {
    const disc = get(K.discipline) || {};
    const time = arr(K.time);
    
    // Get last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(fmtDate(d));
    }
    
    // Discipline sparkline
    const discData = days.map(d => {
        const dayDisc = disc[d];
        if (!dayDisc) return 0;
        return Object.values(dayDisc).reduce((s, v) => s + v, 0);
    });
    
    const discSparkline = document.getElementById('disciplineSparkline');
    if (discSparkline) {
        const max = Math.max(...discData, 1);
        discSparkline.innerHTML = discData.map(v => `<div class="sparkline-bar" style="height:${(v/max)*100}%;background:${v > 30 ? 'var(--success)' : 'var(--accent)'};"></div>`).join('');
    }
    
    // Hours sparkline
    const hoursData = days.map(d => time.filter(t => t.date === d).reduce((s, t) => s + (parseFloat(t.duration) || 0), 0));
    
    const hoursSparkline = document.getElementById('hoursSparkline');
    if (hoursSparkline) {
        const max = Math.max(...hoursData, 1);
        hoursSparkline.innerHTML = hoursData.map(v => `<div class="sparkline-bar" style="height:${(v/max)*100}%;"></div>`).join('');
    }
}

