// ==================== INSIGHTS ====================
// Enhanced with Phase 7: Calibration Insight + Learning Quality Insight

function showInsight(v){
    document.getElementById('insightTabs').innerHTML='<button class="filter-btn '+(v==='overview'?'active':'')+'" onclick="showInsight(\'overview\')">Overview</button><button class="filter-btn '+(v==='calibration'?'active':'')+'" onclick="showInsight(\'calibration\')">🎯 Calibration</button><button class="filter-btn '+(v==='quality'?'active':'')+'" onclick="showInsight(\'quality\')">📊 Quality</button><button class="filter-btn '+(v==='study'?'active':'')+'" onclick="showInsight(\'study\')">Study</button><button class="filter-btn '+(v==='discipline'?'active':'')+'" onclick="showInsight(\'discipline\')">Discipline</button><button class="filter-btn '+(v==='energy'?'active':'')+'" onclick="showInsight(\'energy\')">Energy</button><button class="filter-btn '+(v==='pomodoro'?'active':'')+'" onclick="showInsight(\'pomodoro\')">Pomodoro</button>';
    const time=arr(K.time),goals=arr(K.goals),disc=get(K.discipline)||{},protocol=get(K.protocol)||{};
    const content=document.getElementById('insightsContent');
    
    if(v==='calibration'){
        renderCalibrationInsight(content);
    }else if(v==='quality'){
        renderQualityInsight(content, time);
    }else if(v==='overview'){
        const totalH=time.reduce((s,e)=>s+(parseFloat(e.duration)||0),0);
        const ws=new Date();ws.setDate(ws.getDate()-ws.getDay());
        const weekH=time.filter(e=>e.date>=fmtDate(ws)).reduce((s,e)=>s+(parseFloat(e.duration)||0),0);
        const cards = arr(K.flashcards);
        const contacts = arr(K.contacts);
        content.innerHTML=`
            <div class="grid grid-3" style="margin-bottom:16px;">
                <div class="stat"><div class="stat-value">${totalH.toFixed(0)}h</div><div class="stat-label">Total Hours</div></div>
                <div class="stat"><div class="stat-value">${weekH.toFixed(1)}h</div><div class="stat-label">This Week</div></div>
                <div class="stat"><div class="stat-value">${calcDisciplineStreak()}</div><div class="stat-label">Day Streak</div></div>
            </div>
            <div class="grid grid-4" style="margin-bottom:16px;">
                <div class="stat"><div class="stat-value">${goals.length}</div><div class="stat-label">Goals</div></div>
                <div class="stat"><div class="stat-value">${goals.filter(g=>g.completed).length}</div><div class="stat-label">Completed</div></div>
                <div class="stat"><div class="stat-value">${cards.length}</div><div class="stat-label">Flashcards</div></div>
                <div class="stat"><div class="stat-value">${contacts.length}</div><div class="stat-label">Contacts</div></div>
            </div>
        `;
    }else if(v==='study'){
        const studyH=time.filter(e=>e.category==='study').reduce((s,e)=>s+(parseFloat(e.duration)||0),0);
        const byDomain={};time.filter(e=>e.domain).forEach(e=>{byDomain[e.domain]=(byDomain[e.domain]||0)+(parseFloat(e.duration)||0);});
        content.innerHTML='<div class="stat" style="margin-bottom:16px;"><div class="stat-value">'+studyH.toFixed(1)+'h</div><div class="stat-label">Total Study</div></div>'+Object.entries(byDomain).sort((a,b)=>b[1]-a[1]).map(([d,h])=>'<div class="list-item"><div class="list-item-content"><div class="list-item-title">'+d+'</div></div><span style="color:var(--accent);font-weight:600;">'+h.toFixed(1)+'h</span></div>').join('');
    }else if(v==='discipline'){
        const last7=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);last7.push(fmtDate(d));}
        const scores=last7.map(ds=>{const day=disc[ds]||{};return {date:ds,score:DISCIPLINES.reduce((s,x)=>s+(day[x.id]||0),0)};});
        const avg=scores.reduce((s,x)=>s+x.score,0)/7;
        content.innerHTML=`
            <div class="stat" style="margin-bottom:16px;"><div class="stat-value">${avg.toFixed(0)}/50</div><div class="stat-label">7-Day Average</div></div>
            ${scores.map(s=>`
                <div class="list-item">
                    <span style="min-width:80px;font-size:0.8rem;">${new Date(s.date+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span>
                    <div style="flex:1;"><div class="progress" style="height:8px;"><div class="progress-fill" style="width:${(s.score/50)*100}%"></div></div></div>
                    <span style="min-width:40px;text-align:right;font-weight:600;color:var(--accent);">${s.score}</span>
                </div>
            `).join('')}
        `;
    }else if(v==='energy'){
        // Energy / Mood Correlation Analysis
        const last14=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);last14.push(fmtDate(d));}
        const energyData = last14.map(ds => {
            const proto = protocol[ds];
            const dayDisc = disc[ds] || {};
            const dayHours = time.filter(t => t.date === ds).reduce((s, t) => s + (parseFloat(t.duration) || 0), 0);
            const discScore = DISCIPLINES.reduce((s, x) => s + (dayDisc[x.id] || 0), 0);
            return {
                date: ds,
                energy: proto?.energy || null,
                hours: dayHours,
                discipline: discScore
            };
        }).filter(d => d.energy !== null);
        
        // Calculate correlations
        const avgEnergy = energyData.length ? (energyData.reduce((s, d) => s + d.energy, 0) / energyData.length).toFixed(1) : '-';
        const highEnergyDays = energyData.filter(d => d.energy >= 7);
        const lowEnergyDays = energyData.filter(d => d.energy <= 4);
        const avgHighHours = highEnergyDays.length ? (highEnergyDays.reduce((s, d) => s + d.hours, 0) / highEnergyDays.length).toFixed(1) : '-';
        const avgLowHours = lowEnergyDays.length ? (lowEnergyDays.reduce((s, d) => s + d.hours, 0) / lowEnergyDays.length).toFixed(1) : '-';
        
        content.innerHTML = `
            <div class="grid grid-3" style="margin-bottom:16px;">
                <div class="stat"><div class="stat-value">${avgEnergy}</div><div class="stat-label">Avg Energy (14d)</div></div>
                <div class="stat"><div class="stat-value">${avgHighHours}h</div><div class="stat-label">High Energy Avg</div></div>
                <div class="stat"><div class="stat-value">${avgLowHours}h</div><div class="stat-label">Low Energy Avg</div></div>
            </div>
            <div style="margin-bottom:16px;">
                <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Energy vs Productivity (14 Days)</div>
                ${energyData.map(d => `
                    <div class="list-item" style="padding:8px 0;">
                        <span style="min-width:60px;font-size:0.75rem;">${new Date(d.date+'T12:00').toLocaleDateString('en-US',{weekday:'short'})}</span>
                        <span style="min-width:70px;font-weight:600;color:${d.energy >= 7 ? 'var(--success)' : d.energy <= 4 ? 'var(--danger)' : 'var(--warning)'};">⚡ ${d.energy}/10</span>
                        <div style="flex:1;display:flex;gap:8px;align-items:center;">
                            <div class="progress" style="flex:1;height:6px;"><div class="progress-fill" style="width:${Math.min(d.hours * 10, 100)}%;background:var(--accent);"></div></div>
                            <span style="font-size:0.75rem;color:var(--text-muted);min-width:35px;">${d.hours.toFixed(1)}h</span>
                        </div>
                        <span style="min-width:50px;text-align:right;font-size:0.8rem;color:${d.discipline >= 35 ? 'var(--success)' : 'var(--text-muted)'}">${d.discipline}/50</span>
                    </div>
                `).join('')}
            </div>
            <div class="card" style="background:var(--bg-tertiary);padding:14px;">
                <div style="font-weight:600;margin-bottom:8px;">💡 Insight</div>
                <div style="font-size:0.9rem;color:var(--text-secondary);">
                    ${avgHighHours !== '-' && avgLowHours !== '-' && parseFloat(avgHighHours) > parseFloat(avgLowHours) 
                        ? `You're ${((parseFloat(avgHighHours) / parseFloat(avgLowHours) - 1) * 100).toFixed(0)}% more productive on high-energy days. Protect your sleep and energy!` 
                        : 'Log more protocol data to see energy-productivity correlations.'}
                </div>
            </div>
        `;
    }else if(v==='pomodoro'){
        const stats = get(K.pomodoroStats) || {};
        const last7=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);last7.push(fmtDate(d));}
        const weekTotal = last7.reduce((s, d) => s + (stats[d] || 0), 0);
        const todayCount = stats[today()] || 0;
        
        content.innerHTML = `
            <div class="grid grid-3" style="margin-bottom:16px;">
                <div class="stat"><div class="stat-value">${todayCount}</div><div class="stat-label">Today</div></div>
                <div class="stat"><div class="stat-value">${weekTotal}</div><div class="stat-label">This Week</div></div>
                <div class="stat"><div class="stat-value">${(weekTotal * 25 / 60).toFixed(1)}h</div><div class="stat-label">Focus Time</div></div>
            </div>
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Last 7 Days</div>
            ${last7.map(d => `
                <div class="list-item">
                    <span style="min-width:80px;font-size:0.8rem;">${new Date(d+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span>
                    <div style="flex:1;display:flex;gap:4px;">
                        ${Array(stats[d] || 0).fill(0).map(() => '<div style="width:12px;height:12px;background:var(--accent);border-radius:3px;"></div>').join('')}
                        ${!stats[d] ? '<span style="color:var(--text-muted);font-size:0.8rem;">-</span>' : ''}
                    </div>
                    <span style="min-width:60px;text-align:right;font-weight:600;color:var(--accent);">${stats[d] || 0} 🍅</span>
                </div>
            `).join('')}
        `;
    }
}


// ==================== PHASE 7: CALIBRATION INSIGHT ====================

function renderCalibrationInsight(container) {
    const detailKey = K.cardReviews + '_detail';
    const reviews = get(detailKey) || [];
    const withConfidence = reviews.filter(r => r.confidence && r.confidence > 0);
    
    if (withConfidence.length < 5) {
        container.innerHTML = `
            <div class="card" style="text-align:center;padding:40px;">
                <div style="font-size:2rem;margin-bottom:12px;">🎯</div>
                <div style="font-weight:600;margin-bottom:8px;">Calibration Tracking</div>
                <div style="color:var(--text-muted);font-size:0.9rem;max-width:400px;margin:0 auto;">
                    Rate your confidence before each flashcard review. After 5+ rated reviews, you'll see how well your confidence predicts your actual accuracy.
                    <br><br><strong>From "Make It Stick":</strong> Illusions of knowing are the biggest threat to real learning. This tracks the gap between what you think you know and what you actually know.
                </div>
            </div>
        `;
        return;
    }
    
    // Calculate per-confidence-level accuracy
    const bins = {};
    withConfidence.forEach(r => {
        const c = r.confidence;
        if (!bins[c]) bins[c] = { correct: 0, total: 0 };
        bins[c].total++;
        if (r.outcome !== 'hard') bins[c].correct++;
    });
    
    // Per-category analysis
    const catBins = {};
    withConfidence.forEach(r => {
        const cat = r.category || 'general';
        if (!catBins[cat]) catBins[cat] = { confident: 0, correct: 0, total: 0 };
        catBins[cat].total++;
        catBins[cat].confident += r.confidence;
        if (r.outcome !== 'hard') catBins[cat].correct++;
    });
    
    const calibScore = typeof getCalibrationScore === 'function' ? getCalibrationScore() : null;
    
    container.innerHTML = `
        <div class="grid grid-3" style="margin-bottom:16px;">
            <div class="stat">
                <div class="stat-value" style="color:${calibScore >= 80 ? 'var(--success)' : calibScore >= 60 ? 'var(--warning)' : 'var(--danger)'};">${calibScore !== null ? calibScore.toFixed(0) + '%' : '—'}</div>
                <div class="stat-label">Calibration Score</div>
            </div>
            <div class="stat"><div class="stat-value">${withConfidence.length}</div><div class="stat-label">Rated Reviews</div></div>
            <div class="stat"><div class="stat-value">${(withConfidence.filter(r => r.outcome !== 'hard').length / withConfidence.length * 100).toFixed(0)}%</div><div class="stat-label">Overall Accuracy</div></div>
        </div>
        
        <div class="card" style="margin-bottom:16px;">
            <div class="card-header"><span class="card-title">Confidence vs Accuracy</span></div>
            ${[1,2,3,4,5].map(level => {
                const b = bins[level] || { correct: 0, total: 0 };
                const accuracy = b.total > 0 ? (b.correct / b.total * 100) : 0;
                const expected = level * 20;
                const gap = accuracy - expected;
                return `
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
                        <span style="min-width:80px;font-size:0.85rem;">Conf ${level}/5</span>
                        <div style="flex:1;position:relative;">
                            <div class="progress" style="height:20px;">
                                <div class="progress-fill" style="width:${accuracy}%;background:${gap >= -10 ? 'var(--success)' : 'var(--danger)'};"></div>
                            </div>
                            <div style="position:absolute;left:${expected}%;top:0;height:20px;width:2px;background:var(--accent);"></div>
                        </div>
                        <span style="min-width:60px;text-align:right;font-size:0.8rem;">
                            ${b.total > 0 ? accuracy.toFixed(0) + '%' : '—'}
                            <span style="font-size:0.7rem;color:var(--text-muted);">(${b.total})</span>
                        </span>
                    </div>
                `;
            }).join('')}
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:8px;">Orange line = expected accuracy. Green = calibrated. Red = overconfident.</div>
        </div>
        
        <div class="card">
            <div class="card-header"><span class="card-title">By Category — Where Are You Overconfident?</span></div>
            ${Object.entries(catBins).sort((a,b) => b[1].total - a[1].total).map(([cat, data]) => {
                const avgConf = (data.confident / data.total).toFixed(1);
                const accuracy = (data.correct / data.total * 100).toFixed(0);
                const overconfident = (avgConf / 5 * 100) > parseFloat(accuracy) + 10;
                return `
                    <div class="list-item" style="padding:8px 0;">
                        <span style="min-width:80px;font-weight:500;">${cat.toUpperCase()}</span>
                        <span style="min-width:60px;font-size:0.85rem;">Conf: ${avgConf}</span>
                        <span style="min-width:70px;font-size:0.85rem;color:${overconfident ? 'var(--danger)' : 'var(--success)'};">Acc: ${accuracy}%</span>
                        <span style="font-size:0.75rem;color:var(--text-muted);">(${data.total} reviews)</span>
                        ${overconfident ? '<span style="color:var(--danger);font-size:0.75rem;">⚠️ Overconfident</span>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ==================== PHASE 7: LEARNING QUALITY INSIGHT ====================

function renderQualityInsight(container, time) {
    // Categorize study time by quality
    const activeRetrieval = time.filter(t => t.technique && ['recall','spaced','interleave','generation'].includes(t.technique));
    const passiveStudy = time.filter(t => t.category === 'study' && !t.technique);
    
    const activeHours = activeRetrieval.reduce((s, t) => s + (parseFloat(t.duration) || 0), 0);
    const passiveHours = passiveStudy.reduce((s, t) => s + (parseFloat(t.duration) || 0), 0);
    const totalStudy = activeHours + passiveHours;
    const qualityRatio = totalStudy > 0 ? (activeHours / totalStudy * 100) : 0;
    
    // Quality-weighted hours (active counts 2x)
    const qualityWeighted = activeHours * 2 + passiveHours;
    
    // By technique
    const byTechnique = {};
    time.filter(t => t.technique).forEach(t => {
        const tech = t.technique;
        byTechnique[tech] = (byTechnique[tech] || 0) + (parseFloat(t.duration) || 0);
    });
    
    // Elaboration entries count
    const journal = arr(K.journal);
    const elaborations = journal.filter(j => j.type === 'elaboration').length;
    
    // Pre-tested cards
    const cards = arr(K.flashcards);
    const preTested = cards.filter(c => c.preTested).length;
    
    container.innerHTML = `
        <div class="card" style="background:var(--bg-tertiary);padding:14px;margin-bottom:16px;font-size:0.85rem;color:var(--text-muted);">
            <strong style="color:var(--accent);">📖 From "Make It Stick":</strong> Not all study hours are equal. Active retrieval, interleaving, and spaced practice produce 2-3x better retention than re-reading or passive review.
        </div>
        
        <div class="grid grid-4" style="margin-bottom:16px;">
            <div class="stat">
                <div class="stat-value" style="color:${qualityRatio >= 60 ? 'var(--success)' : qualityRatio >= 30 ? 'var(--warning)' : 'var(--danger)'};">${qualityRatio.toFixed(0)}%</div>
                <div class="stat-label">Quality Ratio</div>
            </div>
            <div class="stat"><div class="stat-value">${activeHours.toFixed(1)}h</div><div class="stat-label">Active Study</div></div>
            <div class="stat"><div class="stat-value">${passiveHours.toFixed(1)}h</div><div class="stat-label">Passive Study</div></div>
            <div class="stat"><div class="stat-value">${qualityWeighted.toFixed(1)}h</div><div class="stat-label">Quality-Weighted</div></div>
        </div>
        
        <div class="grid grid-3" style="margin-bottom:16px;">
            <div class="stat"><div class="stat-value">${elaborations}</div><div class="stat-label">Elaborations</div></div>
            <div class="stat"><div class="stat-value">${preTested}</div><div class="stat-label">Pre-Tested Cards</div></div>
            <div class="stat"><div class="stat-value">${arr(K.knowledge).filter(n => n.entryType === 'critical').length}</div><div class="stat-label">Critical Analyses</div></div>
        </div>
        
        <div class="card" style="margin-bottom:16px;">
            <div class="card-header"><span class="card-title">Hours by Study Technique</span></div>
            ${Object.entries(byTechnique).sort((a,b) => b[1] - a[1]).map(([tech, hours]) => {
                const techData = typeof STUDY_TECHNIQUES !== 'undefined' ? STUDY_TECHNIQUES[tech] : null;
                const name = techData ? techData.name : tech;
                const icon = techData ? techData.icon : '📖';
                return `
                    <div class="list-item" style="padding:8px 0;">
                        <span style="min-width:30px;">${icon}</span>
                        <span style="flex:1;font-weight:500;">${name}</span>
                        <span style="color:var(--accent);font-weight:600;">${hours.toFixed(1)}h</span>
                    </div>
                `;
            }).join('') || '<div class="empty">No technique-tagged study sessions yet. Use the Study Lab!</div>'}
        </div>
        
        <div class="card" style="background:var(--bg-tertiary);padding:14px;">
            <div style="font-weight:600;margin-bottom:8px;">💡 Recommendation</div>
            <div style="font-size:0.9rem;color:var(--text-secondary);">
                ${qualityRatio < 30 ? 'Most of your study time is passive. Switch to Active Recall and Interleaving in the Study Lab to dramatically improve retention.' :
                  qualityRatio < 60 ? 'Good mix of techniques. Try to increase your active study ratio above 60% for optimal learning.' :
                  'Excellent! Your study approach aligns with the science. Keep using varied, effortful retrieval practice.'}
                ${elaborations < 5 ? ' Try writing more elaboration reflections after study sessions.' : ''}
                ${preTested === 0 ? ' Use the Pre-Test feature on learning pathways to prime your brain before studying new material.' : ''}
            </div>
        </div>
    `;
}
