// ==================== PROTOCOL ====================
function renderProtocol() {
    const h = new Date().getHours();
    const m = new Date().getMinutes();
    const isEvening = h >= 18;
    const proto = get(K.protocol) || {};
    const todayProto = proto[today()] || {};
    
    // Update time display
    const timeEl = document.getElementById('protocolTime');
    if (timeEl) timeEl.textContent = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
    
    // Update title
    const titleEl = document.getElementById('protocolTitle');
    if (titleEl) titleEl.innerHTML = isEvening ? '<span>🌙</span> Evening Debrief' : '<span>🌅</span> Morning Protocol';
    
    const steps = isEvening ? [
        { id: 'review', title: 'Review the day', desc: 'What got done? What didn\'t?', icon: '📋' },
        { id: 'wins', title: 'Capture wins', desc: 'What went well? What did you learn?', icon: '🏆' },
        { id: 'tomorrow', title: 'Plan tomorrow', desc: 'What\'s the #1 priority for tomorrow?', icon: '📅' },
        { id: 'gratitude', title: 'Gratitude', desc: 'Name one thing you\'re grateful for today', icon: '🙏' }
    ] : [
        { id: 'wake', title: 'Wake with purpose', desc: 'No phone for first 30 minutes', icon: '⏰' },
        { id: 'hydrate', title: 'Hydrate + Move', desc: 'Water, stretch, or short walk', icon: '💧' },
        { id: 'intention', title: 'Set intention', desc: 'What\'s the ONE thing for today?', icon: '🎯' },
        { id: 'plan', title: 'Review plan', desc: 'Check tasks, calendar, learning goals', icon: '📋' },
        { id: 'start', title: 'Start hardest task', desc: 'Begin before checking email/messages', icon: '🚀' }
    ];
    
    // Calculate progress
    const completed = steps.filter(s => todayProto[s.id]).length;
    const progressPct = Math.round((completed / steps.length) * 100);
    
    const progressEl = document.getElementById('protocolProgress');
    const progressBar = document.getElementById('protocolProgressBar');
    if (progressEl) progressEl.textContent = `${completed}/${steps.length}`;
    if (progressBar) progressBar.style.width = `${progressPct}%`;
    
    // Render steps
    document.getElementById('protocolSteps').innerHTML = steps.map((s, i) => `
        <div class="protocol-step-card ${todayProto[s.id] ? 'done' : ''}" onclick="toggleProtocolStep('${s.id}')">
            <div class="protocol-step-num">${todayProto[s.id] ? '✓' : i + 1}</div>
            <div class="protocol-step-content">
                <div class="protocol-step-title">${s.icon} ${s.title}</div>
                <div class="protocol-step-desc">${s.desc}</div>
            </div>
        </div>
    `).join('');
    
    // Energy selector
    const energySel = document.getElementById('energySelector');
    if (energySel) {
        const currentEnergy = todayProto.energy || 7;
        energySel.innerHTML = [1,2,3,4,5,6,7,8,9,10].map(n => {
            const level = n <= 3 ? 'low' : n <= 6 ? 'mid' : 'high';
            const selected = n === parseInt(currentEnergy) ? 'selected' : '';
            return `<button type="button" class="energy-btn ${level} ${selected}" onclick="setProtocolEnergy(${n})">${n}</button>`;
        }).join('');
    }
    
    document.getElementById('protocolIntention').value = todayProto.intention || '';
}

function toggleProtocolStep(stepId) {
    const proto = get(K.protocol) || {};
    if (!proto[today()]) proto[today()] = {};
    proto[today()][stepId] = !proto[today()][stepId];
    set(K.protocol, proto);
    renderProtocol();
}

function setProtocolEnergy(val) {
    const proto = get(K.protocol) || {};
    if (!proto[today()]) proto[today()] = {};
    proto[today()].energy = val;
    document.getElementById('protocolEnergy').value = val;
    set(K.protocol, proto);
    renderProtocol();
}

function completeProtocol() {
    const proto = get(K.protocol) || {};
    const h = new Date().getHours();
    const isEvening = h >= 18;
    
    proto[today()] = {
        ...(proto[today()] || {}),
        intention: document.getElementById('protocolIntention').value.trim(),
        energy: document.getElementById('protocolEnergy').value,
        [isEvening ? 'evening' : 'morning']: true,
        wake: true, hydrate: true, intention: true, plan: true, start: true,
        review: isEvening, wins: isEvening, tomorrow: isEvening, gratitude: isEvening
    };
    set(K.protocol, proto);
    toast('Protocol complete! 🌟');
    renderProtocol();
    refreshDashboard();
}

