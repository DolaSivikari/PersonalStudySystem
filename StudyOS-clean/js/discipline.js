// ==================== DISCIPLINE ====================
function renderDiscipline() {
    const disc = get(K.discipline) || {};
    const todayDisc = disc[today()] || {};
    
    // Update date header
    const dateEl = document.getElementById('disciplineDate');
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    
    // Calculate scores
    const score = DISCIPLINES.reduce((s, d) => s + (todayDisc[d.id] || 0), 0);
    const max = DISCIPLINES.reduce((s, d) => s + d.max, 0);
    const streak = calcDisciplineStreak();
    const weekAvg = calcWeeklyAverage();
    
    // Update stats
    document.getElementById('disciplineStreak').textContent = streak;
    document.getElementById('disciplineAvg').textContent = weekAvg + '%';
    document.getElementById('disciplineTodayScore').textContent = `${score}/${max}`;
    document.getElementById('disciplineProgress').style.width = `${(score / max) * 100}%`;
    
    // Render discipline items with dots
    document.getElementById('disciplineItems').innerHTML = DISCIPLINES.map(d => {
        const itemScore = todayDisc[d.id] || 0;
        return `
            <div class="discipline-item">
                <div class="discipline-info">
                    <div class="discipline-name">${d.name}</div>
                    <div class="discipline-desc">${d.desc}</div>
                </div>
                <div class="discipline-dots">
                    ${[2, 4, 6, 8, 10].map(v => `
                        <div class="discipline-dot ${itemScore >= v ? 'filled' : ''}" 
                             onclick="setDiscipline('${d.id}', ${itemScore >= v ? v - 2 : v})"
                             title="${v}/10">${itemScore >= v ? '✓' : ''}</div>
                    `).join('')}
                </div>
                <div class="discipline-score">${itemScore}</div>
            </div>
        `;
    }).join('');
    
    // Render 7-day heatmap
    renderDisciplineHeatmap();
}

function renderDisciplineHeatmap() {
    const disc = get(K.discipline) || {};
    const max = DISCIPLINES.reduce((s, d) => s + d.max, 0);
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const ds = fmtDate(d);
        const dayScore = disc[ds] ? DISCIPLINES.reduce((s, x) => s + (disc[ds][x.id] || 0), 0) : 0;
        const pct = Math.round((dayScore / max) * 100);
        const level = pct >= 80 ? 'good' : pct >= 50 ? 'mid' : 'low';
        days.push({
            name: d.toLocaleDateString('en-US', { weekday: 'short' }),
            score: pct,
            level: dayScore > 0 ? level : ''
        });
    }
    
    const heatmapEl = document.getElementById('disciplineHeatmap');
    if (heatmapEl) {
        heatmapEl.innerHTML = days.map(d => `
            <div class="heatmap-day ${d.level}">
                <div class="heatmap-day-name">${d.name}</div>
                <div class="heatmap-day-score">${d.score}%</div>
            </div>
        `).join('');
    }
}

function calcWeeklyAverage() {
    const disc = get(K.discipline) || {};
    const max = DISCIPLINES.reduce((s, d) => s + d.max, 0);
    let total = 0, count = 0;
    
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const ds = fmtDate(d);
        if (disc[ds]) {
            const dayScore = DISCIPLINES.reduce((s, x) => s + (disc[ds][x.id] || 0), 0);
            total += dayScore;
            count++;
        }
    }
    return count > 0 ? Math.round((total / (count * max)) * 100) : 0;
}

function setDiscipline(id, val) {
    const disc = get(K.discipline) || {};
    if (!disc[today()]) disc[today()] = {};
    disc[today()][id] = Math.max(0, val);
    set(K.discipline, disc);
    renderDiscipline();
    refreshDashboard();
}

function updateDisciplineScore() {
    const disc = get(K.discipline) || {};
    const todayDisc = disc[today()] || {};
    const score = DISCIPLINES.reduce((s,d) => s + (todayDisc[d.id] || 0), 0);
    const max = DISCIPLINES.reduce((s,d) => s + d.max, 0);
    document.getElementById('disciplineTodayScore').textContent = `${score}/${max}`;
    document.getElementById('disciplineProgress').style.width = `${(score/max)*100}%`;
}

function calcDisciplineStreak() {
    const disc = get(K.discipline) || {};
    let streak = 0;
    let d = new Date();
    const max = DISCIPLINES.reduce((s, x) => s + x.max, 0);
    const threshold = max * 0.5;
    
    while (true) {
        const ds = fmtDate(d);
        const dayScore = disc[ds] ? DISCIPLINES.reduce((s, x) => s + (disc[ds][x.id] || 0), 0) : 0;
        if (dayScore >= threshold) {
            streak++;
            d.setDate(d.getDate() - 1);
        } else if (streak === 0 && ds === today()) {
            d.setDate(d.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

