// ==================== LEARN ====================
function renderLearn() {
    const progress = get(K.learnProgress) || {};
    
    document.getElementById('learnFilters').innerHTML = Object.entries(PATHWAYS).map(([id, p]) => 
        `<button class="filter-btn" onclick="showPathway('${id}')">${p.name}</button>`
    ).join('');
    
    // Show all pathways overview
    document.getElementById('learnPathways').innerHTML = Object.entries(PATHWAYS).map(([id, p]) => {
        const totalHours = p.modules.reduce((s,m) => s + m.hours, 0);
        const doneHours = p.modules.reduce((s,m) => s + Math.min(progress[m.id]||0, m.hours), 0);
        const pct = Math.round((doneHours/totalHours)*100);
        return `
            <div class="pathway-card" onclick="showPathway('${id}')" style="cursor:pointer;">
                <div class="pathway-header">
                    <span class="pathway-title">${p.name}</span>
                    <span style="color:var(--accent);font-weight:600;">${pct}%</span>
                </div>
                <div class="pathway-desc">${p.desc}</div>
                <div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:6px;">${doneHours}/${totalHours} hours</div>
            </div>
        `;
    }).join('');
    
    renderTodayLearning();
    showTip('learn', 'learnTip');
}

function showPathway(id) {
    const p = PATHWAYS[id];
    const progress = get(K.learnProgress) || {};
    const cards = arr(K.flashcards);
    const unreviewedInPath = cards.filter(c => c.category === id && (!c.reviews || c.reviews === 0)).length;
    
    document.getElementById('learnPathways').innerHTML = `
        <div style="margin-bottom:16px;display:flex;align-items:center;gap:12px;">
            <button class="btn btn-secondary btn-sm" onclick="renderLearn()">← Back</button>
            <span style="font-weight:600;">${p.name}</span>
            ${unreviewedInPath > 0 ? `<button class="btn btn-sm" style="background:var(--purple);color:white;border-color:var(--purple);" onclick="startPreTest('${id}')">🧪 Pre-Test (${unreviewedInPath} cards)</button>` : ''}
        </div>
        <div style="background:var(--bg-tertiary);padding:10px 14px;border-radius:8px;margin-bottom:16px;font-size:0.8rem;color:var(--text-muted);">
            <strong style="color:var(--purple);">💡 Make It Stick:</strong> Pre-testing yourself on material you haven't studied yet primes your brain for deeper encoding when you do study it. Failed retrieval attempts enhance later learning.
        </div>
        ${p.modules.map(m => {
            const done = progress[m.id] || 0;
            const pct = Math.round((done/m.hours)*100);
            const isComplete = done >= m.hours;
            return `
                <div class="pathway-card ${isComplete?'':'active'}">
                    <div class="pathway-header">
                        <span class="pathway-title">${isComplete?'✓ ':''}${m.name}</span>
                        <span style="color:${isComplete?'var(--success)':'var(--accent)'};font-weight:600;">${pct}%</span>
                    </div>
                    <div class="pathway-desc">${m.topics.join(' • ')}</div>
                    <div class="progress"><div class="progress-fill" style="width:${pct}%;${isComplete?'background:var(--success);':''}"></div></div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
                        <span style="font-size:0.75rem;color:var(--text-muted);">${done}/${m.hours} hours</span>
                        <button class="btn btn-sm ${isComplete?'btn-secondary':'btn-primary'}" onclick="logLearning('${m.id}',${m.hours})">+ Log Time</button>
                    </div>
                </div>
            `;
        }).join('')}
    `;
}

function logLearning(moduleId, maxHours) {
    const hours = prompt('Hours studied:', '1');
    if (!hours || isNaN(parseFloat(hours))) return;
    
    const progress = get(K.learnProgress) || {};
    progress[moduleId] = Math.min((progress[moduleId] || 0) + parseFloat(hours), maxHours);
    set(K.learnProgress, progress);
    
    // Also log to time tracker
    const entries = arr(K.time);
    const modInfo = Object.values(PATHWAYS).flatMap(p=>p.modules).find(m=>m.id===moduleId);
    entries.push({
        id: uid(),
        title: modInfo ? modInfo.name : 'Study session',
        duration: parseFloat(hours),
        date: today(),
        category: 'study',
        domain: moduleId.startsWith('p')?'pmp':moduleId.startsWith('m')?'math':moduleId.startsWith('s')?'smr':'management'
    });
    set(K.time, entries);
    
    toast('Logged!');
    renderLearn();
    refreshDashboard();
}

function renderTodayLearning() {
    const time = arr(K.time).filter(e => e.date === today() && e.category === 'study');
    const totalToday = time.reduce((s,e) => s + (parseFloat(e.duration)||0), 0);
    
    document.getElementById('todayLearning').innerHTML = `
        <div class="stat" style="margin-bottom:12px;">
            <div class="stat-value">${totalToday.toFixed(1)}h</div>
            <div class="stat-label">Studied Today</div>
        </div>
        ${time.length ? time.map(e => `
            <div class="list-item">
                <span style="color:var(--accent);font-weight:600;min-width:40px;">${e.duration}h</span>
                <div class="list-item-content">
                    <div class="list-item-title">${esc(e.title)}</div>
                </div>
            </div>
        `).join('') : '<div class="empty">No study sessions today</div>'}
    `;
    
    // Render study technique preview on Learn page
    const previewEl = document.getElementById('studyTechniquePreview');
    if (previewEl) {
        previewEl.innerHTML = `
            <div class="technique-mini" onclick="go('studylab')"><span class="technique-mini-icon">🎯</span> Active Recall</div>
            <div class="technique-mini" onclick="go('studylab')"><span class="technique-mini-icon">📅</span> Spaced Repetition</div>
            <div class="technique-mini" onclick="go('studylab')"><span class="technique-mini-icon">🔀</span> Interleaving</div>
            <div class="technique-mini" onclick="go('studylab')"><span class="technique-mini-icon">👨‍🏫</span> Feynman</div>
        `;
    }
    
    // Render PMP 49 processes tracker
    renderPMPProcesses();
}

function renderPMPProcesses() {
    const pmpProgress = get(K.pmpProgress) || {};
    const totalProcesses = PMP_KNOWLEDGE_AREAS.reduce((s, ka) => s + ka.processes.length, 0);
    const completedProcesses = Object.values(pmpProgress).filter(v => v).length;
    
    const pctEl = document.getElementById('pmpProcessPct');
    const countEl = document.getElementById('pmpProcessCount');
    const gridEl = document.getElementById('pmpProcessGrid');
    
    if (pctEl) pctEl.textContent = Math.round((completedProcesses / totalProcesses) * 100) + '%';
    if (countEl) countEl.textContent = `${completedProcesses}/${totalProcesses} mastered`;
    
    if (gridEl) {
        gridEl.innerHTML = PMP_KNOWLEDGE_AREAS.map(ka => {
            const kaDone = ka.processes.filter(p => pmpProgress[p.num]).length;
            const kaPct = Math.round((kaDone / ka.processes.length) * 100);
            return `
                <div class="pmp-area">
                    <div class="pmp-area-header">
                        <span class="pmp-area-name" style="color:${ka.color};">${ka.name}</span>
                        <span class="pmp-area-pct" style="color:${ka.color};">${kaPct}%</span>
                    </div>
                    <div class="pmp-processes">
                        ${ka.processes.map(p => `
                            <div class="pmp-process ${pmpProgress[p.num] ? 'done' : ''}" 
                                 onclick="togglePMPProcess('${p.num}')" 
                                 title="${p.name}"
                                 style="${pmpProgress[p.num] ? 'background:' + ka.color : ''}">
                                ${p.num.split('.')[1]}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
}

function togglePMPProcess(processNum) {
    const pmpProgress = get(K.pmpProgress) || {};
    pmpProgress[processNum] = !pmpProgress[processNum];
    set(K.pmpProgress, pmpProgress);
    renderPMPProcesses();
    
    // Find process name
    let processName = processNum;
    for (const ka of PMP_KNOWLEDGE_AREAS) {
        const p = ka.processes.find(p => p.num === processNum);
        if (p) { processName = p.name; break; }
    }
    
    toast(pmpProgress[processNum] ? `✓ ${processName} mastered!` : `${processName} unmarked`);
}

