// ==================== PMP TOOLS ====================
// Features: ITTO Drill, Principles Tracker, Scenario Practice, EVM Calculator, Cross-Reference, Process Map

let pmpToolView = 'itto';
let currentScenario = null;
let scenarioAnswered = false;

function renderPmpTools() {
    const tabs = document.getElementById('pmpToolTabs');
    if (!tabs) return;
    tabs.innerHTML = `
        <button class="filter-btn ${pmpToolView==='itto'?'active':''}" onclick="pmpToolView='itto';renderPmpTools()">📋 ITTO</button>
        <button class="filter-btn ${pmpToolView==='principles'?'active':''}" onclick="pmpToolView='principles';renderPmpTools()">🏛️ Principles</button>
        <button class="filter-btn ${pmpToolView==='scenario'?'active':''}" onclick="pmpToolView='scenario';renderPmpTools()">🎭 Scenarios</button>
        <button class="filter-btn ${pmpToolView==='evm'?'active':''}" onclick="pmpToolView='evm';renderPmpTools()">📊 EVM</button>
        <button class="filter-btn ${pmpToolView==='crossref'?'active':''}" onclick="pmpToolView='crossref';renderPmpTools()">🔗 Cross-Ref</button>
        <button class="filter-btn ${pmpToolView==='processmap'?'active':''}" onclick="pmpToolView='processmap';renderPmpTools()">🗺️ Process Map</button>
        <button class="filter-btn ${pmpToolView==='cebok'?'active':''}" onclick="pmpToolView='cebok';renderPmpTools()">🏗️ CEBOK3</button>
        <button class="filter-btn ${pmpToolView==='estimating'?'active':''}" onclick="pmpToolView='estimating';renderPmpTools()">💰 Estimating</button>
    `;
    const content = document.getElementById('pmpToolContent');
    if (pmpToolView === 'itto') renderIttoTool(content);
    else if (pmpToolView === 'principles') renderPrinciplesTool(content);
    else if (pmpToolView === 'scenario') renderScenarioTool(content);
    else if (pmpToolView === 'evm') renderEvmTool(content);
    else if (pmpToolView === 'crossref') renderCrossRefTool(content);
    else if (pmpToolView === 'processmap') renderProcessMap(content);
    else if (pmpToolView === 'cebok') renderCebokTool(content);
    else if (pmpToolView === 'estimating') renderEstimatingTool(content);
}

// ==================== FEATURE 1: ITTO DRILL & AUTO-GENERATION ====================

function renderIttoTool(el) {
    const ittos = typeof PMP_ITTOS !== 'undefined' ? PMP_ITTOS : {};
    const processCount = Object.keys(ittos).length;
    
    el.innerHTML = `
        <div class="card" style="margin-bottom:16px;background:var(--bg-tertiary);padding:14px;">
            <strong style="color:var(--accent);">📋 ITTO Drill</strong>
            <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">${processCount} processes with ITTOs loaded. Generate flashcards or drill inline.</div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="generateIttoCards()">🎴 Generate All ITTO Flashcards</button>
            <button class="btn btn-secondary" onclick="startIttoDrill()">⚡ Quick ITTO Drill</button>
        </div>
        <div id="ittoDrillArea"></div>
        <div style="margin-top:16px;">
            ${PMP_KNOWLEDGE_AREAS.map(ka => `
                <div class="card" style="margin-bottom:12px;border-left:3px solid ${ka.color};">
                    <div style="font-weight:600;margin-bottom:8px;color:${ka.color};">${ka.name}</div>
                    ${ka.processes.map(p => {
                        const itto = ittos[p.num];
                        return `
                            <div style="margin-bottom:10px;padding:8px;background:var(--bg-primary);border-radius:6px;">
                                <div style="font-weight:500;font-size:0.9rem;margin-bottom:6px;">${p.num} ${p.name}</div>
                                ${itto ? `
                                    <div style="font-size:0.8rem;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
                                        <div><span style="color:var(--success);font-weight:600;">Inputs:</span><br>${itto.inputs.map(i => '<span style="color:var(--text-muted);">• '+i+'</span>').join('<br>')}</div>
                                        <div><span style="color:var(--accent);font-weight:600;">Tools:</span><br>${itto.tools.map(t => '<span style="color:var(--text-muted);">• '+t+'</span>').join('<br>')}</div>
                                        <div><span style="color:var(--purple);font-weight:600;">Outputs:</span><br>${itto.outputs.map(o => '<span style="color:var(--text-muted);">• '+o+'</span>').join('<br>')}</div>
                                    </div>
                                ` : '<div style="font-size:0.8rem;color:var(--text-muted);">ITTO data not loaded for this process</div>'}
                            </div>
                        `;
                    }).join('')}
                </div>
            `).join('')}
        </div>
    `;
}

function generateIttoCards() {
    const ittos = typeof PMP_ITTOS !== 'undefined' ? PMP_ITTOS : {};
    const cards = arr(K.flashcards);
    let created = 0;
    
    for (const ka of PMP_KNOWLEDGE_AREAS) {
        for (const p of ka.processes) {
            const itto = ittos[p.num];
            if (!itto) continue;
            
            // Check if cards already exist for this process
            const existsI = cards.some(c => c.question && c.question.includes(p.num) && c.question.includes('Inputs'));
            if (!existsI) {
                cards.push({ id: uid(), question: `${p.num} ${p.name} — What are the key INPUTS?`, answer: itto.inputs.join(', '), category: 'pmp', tags: ['itto','inputs',ka.id], createdAt: new Date().toISOString(), reviews: 0, nextReview: today(), interval: 0, easeFactor: 2.5 });
                created++;
            }
            const existsT = cards.some(c => c.question && c.question.includes(p.num) && c.question.includes('Tools'));
            if (!existsT) {
                cards.push({ id: uid(), question: `${p.num} ${p.name} — What are the key TOOLS & TECHNIQUES?`, answer: itto.tools.join(', '), category: 'pmp', tags: ['itto','tools',ka.id], createdAt: new Date().toISOString(), reviews: 0, nextReview: today(), interval: 0, easeFactor: 2.5 });
                created++;
            }
            const existsO = cards.some(c => c.question && c.question.includes(p.num) && c.question.includes('Outputs'));
            if (!existsO) {
                cards.push({ id: uid(), question: `${p.num} ${p.name} — What are the key OUTPUTS?`, answer: itto.outputs.join(', '), category: 'pmp', tags: ['itto','outputs',ka.id], createdAt: new Date().toISOString(), reviews: 0, nextReview: today(), interval: 0, easeFactor: 2.5 });
                created++;
            }
        }
    }
    
    set(K.flashcards, cards);
    toast(`🎴 Generated ${created} ITTO flashcards! (${cards.length} total cards)`);
}

function startIttoDrill() {
    const ittos = typeof PMP_ITTOS !== 'undefined' ? PMP_ITTOS : {};
    const keys = Object.keys(ittos);
    if (keys.length === 0) { toast('No ITTO data available'); return; }
    
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const itto = ittos[randomKey];
    const process = PMP_KNOWLEDGE_AREAS.flatMap(ka => ka.processes).find(p => p.num === randomKey);
    const types = ['inputs','tools','outputs'];
    const type = types[Math.floor(Math.random() * 3)];
    
    const area = document.getElementById('ittoDrillArea');
    area.innerHTML = `
        <div class="card" style="border-left:3px solid var(--accent);padding:20px;">
            <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">Quick Drill</div>
            <div style="font-size:1.1rem;font-weight:600;margin-bottom:16px;">${randomKey} ${process ? process.name : ''} — Name the ${type.toUpperCase()}</div>
            <div id="ittoDrillAnswer" style="display:none;background:var(--bg-tertiary);padding:14px;border-radius:8px;margin-bottom:12px;">
                ${itto[type].map(item => '<div style="margin-bottom:4px;">✓ ' + item + '</div>').join('')}
            </div>
            <div style="display:flex;gap:8px;">
                <button class="btn btn-primary" onclick="document.getElementById('ittoDrillAnswer').style.display='block';this.style.display='none'">Reveal Answer</button>
                <button class="btn btn-secondary" onclick="startIttoDrill()">Next Question</button>
            </div>
        </div>
    `;
}

// ==================== FEATURE 2: 12 PRINCIPLES TRACKER ====================

function renderPrinciplesTool(el) {
    const principles = typeof PMP_PRINCIPLES !== 'undefined' ? PMP_PRINCIPLES : [];
    const tracker = get('hcc_principlesTracker') || {};
    const weekKey = getWeekKey();
    const weekData = tracker[weekKey] || {};
    
    const rated = Object.keys(weekData).length;
    const avgScore = rated > 0 ? (Object.values(weekData).reduce((s,v) => s+v, 0) / rated).toFixed(1) : '—';
    
    el.innerHTML = `
        <div class="card" style="margin-bottom:16px;background:var(--bg-tertiary);padding:14px;">
            <strong style="color:var(--purple);">🏛️ Weekly Principles Self-Assessment</strong>
            <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">PMBOK 7th Edition's 12 Principles. Rate yourself 1-5 on how well you practiced each principle this week.</div>
        </div>
        <div class="grid grid-3" style="margin-bottom:16px;">
            <div class="stat"><div class="stat-value">${rated}/12</div><div class="stat-label">Rated This Week</div></div>
            <div class="stat"><div class="stat-value">${avgScore}</div><div class="stat-label">Avg Score</div></div>
            <div class="stat"><div class="stat-value">${Object.keys(tracker).length}</div><div class="stat-label">Weeks Tracked</div></div>
        </div>
        ${principles.map(p => {
            const score = weekData[p.id] || 0;
            return `
                <div class="card" style="margin-bottom:10px;padding:14px;${score > 0 ? 'border-left:3px solid var(--success);' : ''}">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                        <div>
                            <span style="font-size:1.2rem;margin-right:6px;">${p.icon}</span>
                            <strong>${p.num}. ${p.name}</strong>
                        </div>
                        <span style="font-size:0.75rem;padding:2px 8px;background:var(--bg-tertiary);border-radius:4px;color:var(--text-muted);">${p.domain}</span>
                    </div>
                    <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:10px;">${p.desc}</div>
                    <div style="display:flex;gap:6px;align-items:center;">
                        <span style="font-size:0.8rem;color:var(--text-muted);min-width:60px;">Rating:</span>
                        ${[1,2,3,4,5].map(n => `<button class="btn btn-sm" style="min-width:36px;${score===n?'background:var(--accent);color:white;border-color:var(--accent);':'background:var(--bg-tertiary);border:1px solid var(--border);'}" onclick="ratePrinciple('${p.id}',${n})">${n}</button>`).join('')}
                        ${score > 0 ? `<span style="font-size:0.8rem;color:var(--success);margin-left:8px;">✓</span>` : ''}
                    </div>
                </div>
            `;
        }).join('')}
    `;
}

function ratePrinciple(principleId, score) {
    const tracker = get('hcc_principlesTracker') || {};
    const weekKey = getWeekKey();
    if (!tracker[weekKey]) tracker[weekKey] = {};
    tracker[weekKey][principleId] = score;
    set('hcc_principlesTracker', tracker);
    renderPmpTools();
}

function getWeekKey() {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return fmtDate(monday);
}

// ==================== FEATURE 3: SCENARIO PRACTICE ====================

function renderScenarioTool(el) {
    const scenarios = typeof PMP_SCENARIOS !== 'undefined' ? PMP_SCENARIOS : [];
    const history = get('hcc_scenarioHistory') || [];
    const correct = history.filter(h => h.correct).length;
    const total = history.length;
    
    el.innerHTML = `
        <div class="card" style="margin-bottom:16px;background:var(--bg-tertiary);padding:14px;">
            <strong style="color:var(--accent);">🎭 PMP Situational Questions</strong>
            <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">Practice the exam format: read the scenario, pick the BEST answer, learn the principle behind it.</div>
        </div>
        <div class="grid grid-3" style="margin-bottom:16px;">
            <div class="stat"><div class="stat-value">${total}</div><div class="stat-label">Attempted</div></div>
            <div class="stat"><div class="stat-value">${total > 0 ? Math.round(correct/total*100) : 0}%</div><div class="stat-label">Accuracy</div></div>
            <div class="stat"><div class="stat-value">${scenarios.length}</div><div class="stat-label">Available</div></div>
        </div>
        <button class="btn btn-primary" onclick="loadScenario()" style="margin-bottom:16px;">🎲 Next Scenario</button>
        <div id="scenarioArea"></div>
    `;
    
    if (currentScenario !== null) showScenario();
}

function loadScenario() {
    const scenarios = typeof PMP_SCENARIOS !== 'undefined' ? PMP_SCENARIOS : [];
    currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    scenarioAnswered = false;
    showScenario();
}

function showScenario() {
    if (!currentScenario) return;
    const s = currentScenario;
    const principles = typeof PMP_PRINCIPLES !== 'undefined' ? PMP_PRINCIPLES : [];
    const principle = principles.find(p => p.id === s.principle);
    
    document.getElementById('scenarioArea').innerHTML = `
        <div class="card" style="padding:20px;border-left:3px solid var(--accent);">
            <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:12px;">Situational Question</div>
            <div style="font-size:1rem;font-weight:500;margin-bottom:20px;line-height:1.6;">${s.q}</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
                ${s.choices.map((c, i) => `
                    <button class="btn ${scenarioAnswered ? (i === s.answer ? 'btn-primary' : 'btn-secondary') : 'btn-secondary'}" 
                            style="text-align:left;padding:12px 16px;${scenarioAnswered && i === s.answer ? 'border-color:var(--success);background:rgba(34,197,94,0.15);color:var(--success);' : ''}${scenarioAnswered && i !== s.answer ? 'opacity:0.6;' : ''}"
                            onclick="answerScenario(${i})" ${scenarioAnswered ? 'disabled' : ''}>
                        <strong>${String.fromCharCode(65+i)}.</strong> ${c}
                    </button>
                `).join('')}
            </div>
            ${scenarioAnswered ? `
                <div style="margin-top:16px;padding:14px;background:var(--bg-tertiary);border-radius:8px;">
                    <div style="font-weight:600;margin-bottom:8px;color:var(--accent);">💡 Explanation</div>
                    <div style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:8px;">${s.explain}</div>
                    <div style="display:flex;gap:12px;font-size:0.8rem;">
                        ${principle ? `<span style="color:var(--purple);">${principle.icon} Principle: ${principle.name}</span>` : ''}
                        <span style="color:var(--text-muted);">Process: ${s.process}</span>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="loadScenario()" style="margin-top:12px;">Next Scenario →</button>
            ` : ''}
        </div>
    `;
}

function answerScenario(choice) {
    if (scenarioAnswered || !currentScenario) return;
    scenarioAnswered = true;
    
    const history = get('hcc_scenarioHistory') || [];
    history.push({ date: today(), correct: choice === currentScenario.answer, principle: currentScenario.principle, process: currentScenario.process });
    if (history.length > 200) history.splice(0, history.length - 200);
    set('hcc_scenarioHistory', history);
    
    showScenario();
    if (choice === currentScenario.answer) toast('✅ Correct!');
    else toast('❌ Incorrect — review the explanation');
}

// ==================== FEATURE 4: EVM CALCULATOR ====================

function renderEvmTool(el) {
    const formulas = typeof EVM_FORMULAS !== 'undefined' ? EVM_FORMULAS : [];
    
    el.innerHTML = `
        <div class="card" style="margin-bottom:16px;background:var(--bg-tertiary);padding:14px;">
            <strong style="color:var(--success);">📊 Earned Value Management Calculator</strong>
            <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">Enter your project values and get all EVM metrics instantly. Practice for guaranteed exam questions.</div>
        </div>
        <div class="card" style="margin-bottom:16px;padding:20px;">
            <div class="grid grid-4" style="margin-bottom:16px;gap:12px;">
                <div class="form-group"><label class="form-label">BAC ($)</label><input type="number" class="form-input" id="evmBAC" placeholder="100000" oninput="calcEvm()"></div>
                <div class="form-group"><label class="form-label">PV ($)</label><input type="number" class="form-input" id="evmPV" placeholder="50000" oninput="calcEvm()"></div>
                <div class="form-group"><label class="form-label">EV ($)</label><input type="number" class="form-input" id="evmEV" placeholder="45000" oninput="calcEvm()"></div>
                <div class="form-group"><label class="form-label">AC ($)</label><input type="number" class="form-input" id="evmAC" placeholder="55000" oninput="calcEvm()"></div>
            </div>
            <div id="evmResults" style="display:none;"></div>
        </div>
        <div class="card" style="padding:14px;">
            <div style="font-weight:600;margin-bottom:12px;">📖 EVM Formula Reference</div>
            ${formulas.map(f => `
                <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border);">
                    <span style="min-width:50px;font-weight:700;color:var(--accent);">${f.abbr}</span>
                    <span style="min-width:180px;font-weight:500;">${f.name}</span>
                    <code style="min-width:180px;color:var(--purple);background:var(--bg-tertiary);padding:2px 8px;border-radius:4px;">${f.formula}</code>
                    <span style="font-size:0.8rem;color:var(--text-muted);">${f.interp}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function calcEvm() {
    const bac = parseFloat(document.getElementById('evmBAC').value) || 0;
    const pv = parseFloat(document.getElementById('evmPV').value) || 0;
    const ev = parseFloat(document.getElementById('evmEV').value) || 0;
    const ac = parseFloat(document.getElementById('evmAC').value) || 0;
    
    if (!bac || !pv || !ev || !ac) { document.getElementById('evmResults').style.display = 'none'; return; }
    
    const cv = ev - ac;
    const sv = ev - pv;
    const cpi = ev / ac;
    const spi = ev / pv;
    const eac1 = ac + (bac - ev);
    const eac2 = bac / cpi;
    const eac3 = ac + (bac - ev) / (cpi * spi);
    const etc1 = eac1 - ac;
    const etc2 = eac2 - ac;
    const vac = bac - eac2;
    const tcpi = (bac - ev) / (bac - ac);
    const pctComplete = (ev / bac * 100);
    
    const fmt = (n) => n >= 1000 ? '$' + (n/1000).toFixed(1) + 'K' : '$' + n.toFixed(0);
    const fmtI = (n) => n.toFixed(2);
    const statusColor = (val, goodWhen) => goodWhen === 'positive' ? (val >= 0 ? 'var(--success)' : 'var(--danger)') : (val >= 1 ? 'var(--success)' : 'var(--danger)');
    
    document.getElementById('evmResults').style.display = 'block';
    document.getElementById('evmResults').innerHTML = `
        <div style="font-weight:600;margin-bottom:12px;">📈 Results</div>
        <div class="grid grid-4" style="gap:10px;margin-bottom:16px;">
            <div class="stat" style="border-left:3px solid ${statusColor(cv,'positive')};"><div class="stat-value" style="color:${statusColor(cv,'positive')};">${fmt(cv)}</div><div class="stat-label">CV (Cost Var)</div></div>
            <div class="stat" style="border-left:3px solid ${statusColor(sv,'positive')};"><div class="stat-value" style="color:${statusColor(sv,'positive')};">${fmt(sv)}</div><div class="stat-label">SV (Sched Var)</div></div>
            <div class="stat" style="border-left:3px solid ${statusColor(cpi,'index')};"><div class="stat-value" style="color:${statusColor(cpi,'index')};">${fmtI(cpi)}</div><div class="stat-label">CPI</div></div>
            <div class="stat" style="border-left:3px solid ${statusColor(spi,'index')};"><div class="stat-value" style="color:${statusColor(spi,'index')};">${fmtI(spi)}</div><div class="stat-label">SPI</div></div>
        </div>
        <div class="grid grid-4" style="gap:10px;margin-bottom:16px;">
            <div class="stat"><div class="stat-value">${fmt(eac1)}</div><div class="stat-label">EAC (atypical)</div></div>
            <div class="stat"><div class="stat-value">${fmt(eac2)}</div><div class="stat-label">EAC (typical)</div></div>
            <div class="stat"><div class="stat-value">${fmt(eac3)}</div><div class="stat-label">EAC (CPI×SPI)</div></div>
            <div class="stat"><div class="stat-value">${fmtI(tcpi)}</div><div class="stat-label">TCPI</div></div>
        </div>
        <div class="card" style="background:${cv >= 0 && sv >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};padding:14px;">
            <div style="font-weight:600;margin-bottom:4px;">${cv >= 0 && sv >= 0 ? '✅ Project Healthy' : cv < 0 && sv < 0 ? '🔴 Project in Trouble' : '⚠️ Mixed Performance'}</div>
            <div style="font-size:0.85rem;color:var(--text-secondary);">
                ${pctComplete.toFixed(0)}% complete. 
                ${cv < 0 ? 'Over budget by ' + fmt(Math.abs(cv)) + '. ' : 'Under budget by ' + fmt(cv) + '. '}
                ${sv < 0 ? 'Behind schedule. ' : 'Ahead of schedule. '}
                At current rate, project will cost ${fmt(eac2)} (BAC: ${fmt(bac)}).
            </div>
        </div>
    `;
}

// ==================== FEATURE 5: 6TH ↔ 7TH CROSS-REFERENCE ====================

function renderCrossRefTool(el) {
    const crossRef = typeof PMP_CROSS_REF !== 'undefined' ? PMP_CROSS_REF : {};
    const principles = typeof PMP_PRINCIPLES !== 'undefined' ? PMP_PRINCIPLES : [];
    const domains = typeof PMP_DOMAINS !== 'undefined' ? PMP_DOMAINS : [];
    
    el.innerHTML = `
        <div class="card" style="margin-bottom:16px;background:var(--bg-tertiary);padding:14px;">
            <strong style="color:var(--purple);">🔗 PMBOK 6th ↔ 7th Edition Cross-Reference</strong>
            <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">See how each 6th edition Knowledge Area maps to 7th edition Performance Domains and Principles.</div>
        </div>
        ${PMP_KNOWLEDGE_AREAS.map(ka => {
            const ref = crossRef[ka.id] || {};
            const domain = domains.find(d => d.id === ref.domain);
            const princs = (ref.principles || []).map(pid => principles.find(p => p.id === pid)).filter(Boolean);
            return `
                <div class="card" style="margin-bottom:12px;border-left:3px solid ${ka.color};">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <strong style="color:${ka.color};">${ka.name} Management</strong>
                        <span style="font-size:0.75rem;color:var(--text-muted);">${ka.processes.length} processes</span>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                        <div>
                            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:6px;">7th Ed Domain</div>
                            ${domain ? `<div style="display:flex;align-items:center;gap:6px;"><span>${domain.icon}</span><strong>${domain.name}</strong></div>` : '—'}
                        </div>
                        <div>
                            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:6px;">Key Principles</div>
                            ${princs.map(p => `<div style="font-size:0.85rem;display:flex;align-items:center;gap:4px;margin-bottom:2px;">${p.icon} ${p.name.split(' ').slice(0,4).join(' ')}...</div>`).join('') || '—'}
                        </div>
                    </div>
                    <div style="margin-top:8px;font-size:0.8rem;color:var(--text-muted);">
                        Processes: ${(ref.pg6 || []).join(', ')}
                    </div>
                </div>
            `;
        }).join('')}
    `;
}

// ==================== FEATURE 6: PROCESS GROUP FLOW MAP ====================

function renderProcessMap(el) {
    const processGroups = [
        { name: 'Initiating', color: '#8b5cf6', processes: ['4.1 Develop Project Charter', '13.1 Identify Stakeholders'] },
        { name: 'Planning', color: '#3b82f6', processes: ['4.2 Develop PM Plan','5.1 Plan Scope Mgmt','5.2 Collect Requirements','5.3 Define Scope','5.4 Create WBS','6.1 Plan Schedule Mgmt','6.2 Define Activities','6.3 Sequence Activities','6.4 Estimate Durations','6.5 Develop Schedule','7.1 Plan Cost Mgmt','7.2 Estimate Costs','7.3 Determine Budget','8.1 Plan Quality Mgmt','9.1 Plan Resource Mgmt','9.2 Estimate Resources','10.1 Plan Comms Mgmt','11.1 Plan Risk Mgmt','11.2 Identify Risks','11.3 Qual Risk Analysis','11.4 Quant Risk Analysis','11.5 Plan Risk Responses','12.1 Plan Procurement Mgmt','13.2 Plan Stakeholder Engagement'] },
        { name: 'Executing', color: '#10b981', processes: ['4.3 Direct & Manage Work','4.4 Manage Knowledge','8.2 Manage Quality','9.3 Acquire Resources','9.4 Develop Team','9.5 Manage Team','10.2 Manage Comms','11.6 Implement Risk Responses','12.2 Conduct Procurements','13.3 Manage Stakeholder Engagement'] },
        { name: 'Monitoring & Controlling', color: '#f97316', processes: ['4.5 Monitor & Control Work','4.6 Integrated Change Control','5.5 Validate Scope','5.6 Control Scope','6.6 Control Schedule','7.4 Control Costs','8.3 Control Quality','9.6 Control Resources','10.3 Monitor Comms','11.7 Monitor Risks','12.3 Control Procurements','13.4 Monitor Stakeholder Engagement'] },
        { name: 'Closing', color: '#ef4444', processes: ['4.7 Close Project or Phase'] }
    ];
    
    el.innerHTML = `
        <div class="card" style="margin-bottom:16px;background:var(--bg-tertiary);padding:14px;">
            <strong style="color:var(--accent);">🗺️ 49 Processes by Process Group</strong>
            <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">Visual map of all processes organized by the 5 Process Groups. The flow: Initiating → Planning → Executing → M&C → Closing.</div>
        </div>
        <div style="display:flex;gap:4px;margin-bottom:20px;align-items:center;">
            ${processGroups.map(pg => `
                <div style="flex:1;text-align:center;padding:8px;background:${pg.color};color:white;border-radius:6px;font-size:0.8rem;font-weight:600;">${pg.name}<br><span style="font-size:0.7rem;font-weight:normal;">${pg.processes.length}</span></div>
            `).join('<span style="color:var(--text-muted);">→</span>')}
        </div>
        ${processGroups.map(pg => `
            <div class="card" style="margin-bottom:12px;border-left:4px solid ${pg.color};">
                <div style="font-weight:700;margin-bottom:10px;color:${pg.color};">${pg.name} (${pg.processes.length} processes)</div>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:6px;">
                    ${pg.processes.map(p => `<div style="font-size:0.85rem;padding:6px 10px;background:var(--bg-tertiary);border-radius:4px;">${p}</div>`).join('')}
                </div>
            </div>
        `).join('')}
    `;
}

// ==================== FEATURE 7: CEBOK3 COMPETENCY TRACKER ====================

function renderCebokTool(el) {
    const outcomes = typeof CEBOK3_OUTCOMES !== 'undefined' ? CEBOK3_OUTCOMES : {};
    const blooms = typeof BLOOMS_LEVELS !== 'undefined' ? BLOOMS_LEVELS : [];
    const tracker = get('hcc_cebokTracker') || {};
    
    // Count stats
    let totalOutcomes = 0, rated = 0, atTarget = 0;
    Object.values(outcomes).forEach(cat => {
        cat.outcomes.forEach(o => {
            totalOutcomes++;
            if (tracker[o.id]) { rated++; if (tracker[o.id] >= o.bloomTarget) atTarget++; }
        });
    });
    
    el.innerHTML = `
        <div class="card" style="margin-bottom:16px;background:var(--bg-tertiary);padding:14px;">
            <strong style="color:var(--accent);">🏗️ CEBOK3 Competency Self-Assessment</strong>
            <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">
                Civil Engineering Body of Knowledge (3rd Ed) — 21 outcomes across 4 categories. 
                Rate your current Bloom's Taxonomy level for each outcome. Target = professional entry level.
            </div>
        </div>
        
        <div class="grid grid-4" style="margin-bottom:16px;">
            <div class="stat"><div class="stat-value">${rated}/${totalOutcomes}</div><div class="stat-label">Assessed</div></div>
            <div class="stat"><div class="stat-value" style="color:${atTarget >= totalOutcomes/2 ? 'var(--success)' : 'var(--warning)'};">${atTarget}</div><div class="stat-label">At Target</div></div>
            <div class="stat"><div class="stat-value">${totalOutcomes - atTarget}</div><div class="stat-label">Gaps</div></div>
            <div class="stat"><div class="stat-value">${rated > 0 ? (Object.values(tracker).reduce((s,v) => s+v, 0) / rated).toFixed(1) : '—'}</div><div class="stat-label">Avg Level</div></div>
        </div>
        
        <!-- Bloom's Legend -->
        <div class="card" style="margin-bottom:16px;padding:12px;">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Bloom's Taxonomy Levels</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;">
                ${blooms.map(b => `<span style="font-size:0.75rem;padding:4px 10px;background:${b.color}22;color:${b.color};border:1px solid ${b.color}44;border-radius:4px;font-weight:600;">${b.level}. ${b.name}</span>`).join('')}
            </div>
        </div>
        
        ${Object.entries(outcomes).map(([catId, cat]) => `
            <div class="card" style="margin-bottom:16px;">
                <div style="font-weight:700;margin-bottom:12px;font-size:1.1rem;">${cat.icon} ${cat.name} Outcomes</div>
                ${cat.outcomes.map(o => {
                    const current = tracker[o.id] || 0;
                    const target = o.bloomTarget;
                    const bloom = blooms.find(b => b.level === current) || {};
                    const targetBloom = blooms.find(b => b.level === target) || {};
                    const atGoal = current >= target;
                    return `
                        <div style="padding:12px;margin-bottom:8px;background:var(--bg-primary);border-radius:8px;border-left:3px solid ${atGoal ? 'var(--success)' : current > 0 ? 'var(--warning)' : 'var(--border)'};">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                <strong style="font-size:0.95rem;">${o.name}</strong>
                                <div style="display:flex;align-items:center;gap:8px;">
                                    <span style="font-size:0.7rem;padding:2px 6px;background:${targetBloom.color || '#666'}22;color:${targetBloom.color || '#666'};border-radius:3px;">Target: L${target} ${targetBloom.name || ''}</span>
                                    ${atGoal ? '<span style="color:var(--success);font-size:0.8rem;">✓ Met</span>' : ''}
                                </div>
                            </div>
                            <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">${o.desc}</div>
                            <div style="display:flex;gap:4px;align-items:center;">
                                <span style="font-size:0.75rem;color:var(--text-muted);min-width:50px;">Level:</span>
                                ${blooms.map(b => `<button class="btn btn-sm" style="min-width:32px;font-size:0.75rem;padding:4px 6px;${current===b.level ? 'background:'+b.color+';color:white;border-color:'+b.color+';' : 'background:var(--bg-tertiary);border:1px solid var(--border);'}" onclick="rateCebok('${o.id}',${b.level})" title="${b.name}: ${b.desc}">${b.level}</button>`).join('')}
                                ${current > 0 ? `<span style="font-size:0.75rem;color:${bloom.color || '#666'};margin-left:8px;">${bloom.name}</span>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `).join('')}
        
        <div class="card" style="background:var(--bg-tertiary);padding:14px;">
            <div style="font-weight:600;margin-bottom:8px;">💡 How to Use This</div>
            <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">
                Rate yourself honestly on each outcome. Gaps between your current level and the target show where to focus your McMaster studies and self-development. 
                The CEBOK3 recommends achieving targets through: undergraduate education, postgraduate education, mentored experience, and self-development. 
                Your StudyOS time tracking, flashcards, and elaboration work all count as self-development toward these outcomes.
            </div>
        </div>
    `;
}

function rateCebok(outcomeId, level) {
    const tracker = get('hcc_cebokTracker') || {};
    tracker[outcomeId] = level;
    set('hcc_cebokTracker', tracker);
    renderPmpTools();
}

// ==================== FEATURE 8: CONSTRUCTION ESTIMATING REFERENCE ====================

function renderEstimatingTool(el) {
    const process = typeof ESTIMATING_PROCESS !== 'undefined' ? ESTIMATING_PROCESS : [];
    const formulas = typeof ESTIMATING_FORMULAS !== 'undefined' ? ESTIMATING_FORMULAS : [];
    
    el.innerHTML = `
        <div class="card" style="margin-bottom:16px;background:var(--bg-tertiary);padding:14px;">
            <strong style="color:var(--success);">💰 Construction Estimating Reference</strong>
            <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">
                From "Fundamentals of Construction Estimating" — the 10-step bid process and key formulas. Essential for construction PM roles.
            </div>
        </div>
        
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="generateEstimatingCards()">🎴 Generate Estimating Flashcards</button>
        </div>
        
        <!-- 10-Step Bid Process -->
        <div class="card" style="margin-bottom:16px;">
            <div style="font-weight:700;margin-bottom:14px;">📋 The 10-Step Bid Estimating Process</div>
            ${process.map(s => `
                <div style="display:flex;gap:12px;padding:12px;margin-bottom:6px;background:var(--bg-primary);border-radius:8px;border-left:3px solid var(--accent);">
                    <div style="min-width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:var(--accent);color:white;border-radius:50%;font-weight:700;font-size:0.9rem;">${s.step}</div>
                    <div>
                        <div style="font-weight:600;margin-bottom:2px;">${s.icon} ${s.name}</div>
                        <div style="font-size:0.85rem;color:var(--text-muted);">${s.desc}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- Key Formulas -->
        <div class="card" style="margin-bottom:16px;">
            <div style="font-weight:700;margin-bottom:14px;">📊 Key Estimating Formulas</div>
            ${formulas.map(f => `
                <div style="padding:12px;margin-bottom:8px;background:var(--bg-primary);border-radius:8px;">
                    <div style="font-weight:600;color:var(--accent);margin-bottom:4px;">${f.name}</div>
                    <code style="display:block;padding:6px 10px;background:var(--bg-tertiary);border-radius:4px;color:var(--purple);margin-bottom:4px;font-size:0.85rem;">${f.formula}</code>
                    <div style="font-size:0.8rem;color:var(--text-muted);">Example: ${f.example}</div>
                </div>
            `).join('')}
        </div>
        
        <!-- Quick Estimate Calculator -->
        <div class="card" style="padding:20px;">
            <div style="font-weight:700;margin-bottom:14px;">🧮 Quick Unit Cost Calculator</div>
            <div class="grid grid-3" style="gap:12px;margin-bottom:16px;">
                <div class="form-group"><label class="form-label">Quantity</label><input type="number" class="form-input" id="estQty" placeholder="100" oninput="calcEstimate()"></div>
                <div class="form-group"><label class="form-label">Unit (m², m³, ea)</label><input type="text" class="form-input" id="estUnit" placeholder="m²" oninput="calcEstimate()"></div>
                <div class="form-group"><label class="form-label">Waste %</label><input type="number" class="form-input" id="estWaste" placeholder="5" value="5" oninput="calcEstimate()"></div>
            </div>
            <div class="grid grid-3" style="gap:12px;margin-bottom:16px;">
                <div class="form-group"><label class="form-label">Labor $/unit</label><input type="number" class="form-input" id="estLabor" placeholder="25" oninput="calcEstimate()"></div>
                <div class="form-group"><label class="form-label">Material $/unit</label><input type="number" class="form-input" id="estMaterial" placeholder="40" oninput="calcEstimate()"></div>
                <div class="form-group"><label class="form-label">Equipment $/unit</label><input type="number" class="form-input" id="estEquip" placeholder="10" oninput="calcEstimate()"></div>
            </div>
            <div class="grid grid-2" style="gap:12px;margin-bottom:16px;">
                <div class="form-group"><label class="form-label">OH %</label><input type="number" class="form-input" id="estOH" placeholder="10" value="10" oninput="calcEstimate()"></div>
                <div class="form-group"><label class="form-label">Profit %</label><input type="number" class="form-input" id="estProfit" placeholder="8" value="8" oninput="calcEstimate()"></div>
            </div>
            <div id="estResults" style="display:none;"></div>
        </div>
    `;
}

function calcEstimate() {
    const qty = parseFloat(document.getElementById('estQty').value) || 0;
    const waste = parseFloat(document.getElementById('estWaste').value) || 0;
    const labor = parseFloat(document.getElementById('estLabor').value) || 0;
    const material = parseFloat(document.getElementById('estMaterial').value) || 0;
    const equip = parseFloat(document.getElementById('estEquip').value) || 0;
    const oh = parseFloat(document.getElementById('estOH').value) || 0;
    const profit = parseFloat(document.getElementById('estProfit').value) || 0;
    const unit = document.getElementById('estUnit').value || 'unit';
    
    if (!qty) { document.getElementById('estResults').style.display = 'none'; return; }
    
    const orderQty = qty * (1 + waste / 100);
    const unitCost = labor + material + equip;
    const directCost = orderQty * unitCost;
    const ohAmount = directCost * (oh / 100);
    const profitAmount = (directCost + ohAmount) * (profit / 100);
    const bidPrice = directCost + ohAmount + profitAmount;
    
    const fmt = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    
    document.getElementById('estResults').style.display = 'block';
    document.getElementById('estResults').innerHTML = `
        <div style="background:var(--bg-tertiary);padding:14px;border-radius:8px;">
            <div class="grid grid-4" style="gap:10px;margin-bottom:12px;">
                <div class="stat"><div class="stat-value" style="font-size:1.2rem;">${orderQty.toFixed(0)}</div><div class="stat-label">Order Qty (${unit})</div></div>
                <div class="stat"><div class="stat-value" style="font-size:1.2rem;">${fmt(unitCost)}</div><div class="stat-label">Unit Cost</div></div>
                <div class="stat"><div class="stat-value" style="font-size:1.2rem;">${fmt(directCost)}</div><div class="stat-label">Direct Cost</div></div>
                <div class="stat"><div class="stat-value" style="font-size:1.2rem;color:var(--accent);">${fmt(bidPrice)}</div><div class="stat-label">Bid Price</div></div>
            </div>
            <div style="font-size:0.85rem;color:var(--text-muted);">
                Direct: ${fmt(directCost)} + OH: ${fmt(ohAmount)} + Profit: ${fmt(profitAmount)} = <strong style="color:var(--accent);">${fmt(bidPrice)}</strong>
                &nbsp;|&nbsp; Cost per ${unit}: ${fmt(bidPrice / qty)}
            </div>
        </div>
    `;
}

function generateEstimatingCards() {
    const cards = arr(K.flashcards);
    const formulas = typeof ESTIMATING_FORMULAS !== 'undefined' ? ESTIMATING_FORMULAS : [];
    const process = typeof ESTIMATING_PROCESS !== 'undefined' ? ESTIMATING_PROCESS : [];
    let created = 0;
    
    // Formula cards
    formulas.forEach(f => {
        const exists = cards.some(c => c.question && c.question.includes(f.name) && c.tags && c.tags.includes('estimating'));
        if (!exists) {
            cards.push({ id: uid(), question: `Construction Estimating: What is the formula for ${f.name}?`, answer: `${f.formula}\n\nExample: ${f.example}`, category: 'construction', tags: ['estimating', 'formula'], createdAt: new Date().toISOString(), reviews: 0, nextReview: today(), interval: 0, easeFactor: 2.5 });
            created++;
        }
    });
    
    // Process step cards
    process.forEach(s => {
        const exists = cards.some(c => c.question && c.question.includes('Step ' + s.step) && c.tags && c.tags.includes('estimating'));
        if (!exists) {
            cards.push({ id: uid(), question: `Bid Estimating Process: What happens in Step ${s.step}?`, answer: `${s.name}: ${s.desc}`, category: 'construction', tags: ['estimating', 'bid-process'], createdAt: new Date().toISOString(), reviews: 0, nextReview: today(), interval: 0, easeFactor: 2.5 });
            created++;
        }
    });
    
    set(K.flashcards, cards);
    toast(`🎴 Generated ${created} estimating flashcards! (${cards.length} total)`);
}
