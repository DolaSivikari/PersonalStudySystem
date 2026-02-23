// ==================== STUDY LAB ====================
const STUDY_TECHNIQUES = {
    recall: {
        name: 'Active Recall',
        icon: '🎯',
        color: 'var(--accent)',
        description: 'Test yourself by pulling information from memory without looking at notes.',
        steps: [
            'Close your notes/textbook',
            'Write down everything you remember about the topic',
            'Check what you missed',
            'Focus review on gaps'
        ],
        tips: [
            'Use flashcards (Anki is great for this)',
            'Practice tests beat re-reading every time',
            'The struggle to remember is what builds memory',
            'Write on a blank page, then compare to notes'
        ]
    },
    spaced: {
        name: 'Spaced Repetition',
        icon: '📅',
        color: 'var(--purple)',
        description: 'Review at increasing intervals to fight the forgetting curve.',
        steps: [
            'First review: Same day',
            'Second review: 1-3 days later',
            'Third review: 1 week later',
            'Fourth review: 2 weeks later',
            'Fifth review: 1 month later'
        ],
        tips: [
            'Use Anki app for automatic scheduling',
            'Some forgetting before review is actually good',
            'Don\'t cram - spread it out',
            'Calendar reminders help maintain schedule'
        ]
    },
    interleave: {
        name: 'Interleaving',
        icon: '🔀',
        color: 'var(--success)',
        description: 'Mix different topics and problem types instead of blocking.',
        steps: [
            'Choose 2-3 related but different topics',
            'Alternate between them during study',
            'Mix problem types (don\'t do all similar ones)',
            'Embrace the difficulty - it\'s working'
        ],
        tips: [
            'Feels harder but produces better results',
            'Builds discrimination between concepts',
            'Creates flexible, transferable knowledge',
            'Example: Mix statics, materials, and codes in one session'
        ]
    },
    feynman: {
        name: 'Feynman Technique',
        icon: '👨‍🏫',
        color: '#58a6ff',
        description: 'Explain concepts simply as if teaching a child.',
        steps: [
            'Choose a concept to learn',
            'Explain it in simple terms (no jargon)',
            'Identify gaps in your explanation',
            'Go back to source material for gaps',
            'Simplify and use analogies'
        ],
        tips: [
            'If you can\'t explain simply, you don\'t understand deeply',
            'Use everyday analogies',
            'Teach an imaginary student or rubber duck',
            'Record yourself explaining - listen for confusion'
        ]
    },
    elaboration: {
        name: 'Elaboration',
        icon: '🔗',
        color: 'var(--warning)',
        description: 'Connect new information to existing knowledge.',
        steps: [
            'Ask "Why does this work?"',
            'Ask "How does this connect to X?"',
            'Create mental models and frameworks',
            'Find real-world applications'
        ],
        tips: [
            'The more connections, the stronger the memory',
            'Use concept maps to visualize links',
            'Relate to your construction experience',
            'Write summaries in your own words'
        ]
    },
    generation: {
        name: 'Generation Effect',
        icon: '✏️',
        color: 'var(--danger)',
        description: 'Attempt problems before seeing solutions.',
        steps: [
            'Look at a new problem',
            'Try to solve it BEFORE reading how',
            'Struggle is okay - even wrong attempts help',
            'Then study the correct method'
        ],
        tips: [
            'Primes your brain to absorb the solution',
            'Even failed attempts improve learning',
            'Skip the "worked examples first" instinct',
            'Productive failure > passive consumption'
        ]
    }
};

let studyTimerInterval = null;
let studyTimerSeconds = 0;
let studyTimerPaused = false;
let currentStudyTechnique = null;

function renderStudyLab() {
    // Render technique usage stats
    const time = arr(K.time).filter(e => e.technique);
    const techniqueStats = {};
    time.forEach(e => {
        techniqueStats[e.technique] = (techniqueStats[e.technique] || 0) + (parseFloat(e.duration) || 0);
    });
    
    const statsEl = document.getElementById('techniqueUsageStats');
    if (statsEl) {
        if (Object.keys(techniqueStats).length === 0) {
            statsEl.innerHTML = '<div class="empty">Start a study session to track technique usage</div>';
        } else {
            statsEl.innerHTML = Object.entries(techniqueStats)
                .sort((a, b) => b[1] - a[1])
                .map(([tech, hours]) => {
                    const t = STUDY_TECHNIQUES[tech];
                    return `
                        <div class="category-bar">
                            <span class="category-label">${t?.icon || '📚'} ${t?.name || tech}</span>
                            <div class="category-progress"><div class="category-fill" style="width:${Math.min(hours * 10, 100)}%;background:${t?.color || 'var(--accent)'};"></div></div>
                            <span class="category-value">${hours.toFixed(1)}h</span>
                        </div>
                    `;
                }).join('');
        }
    }
}

function openTechniqueModal(techId) {
    const tech = STUDY_TECHNIQUES[techId];
    if (!tech) return;
    
    const content = `
        <div style="text-align:center;margin-bottom:20px;">
            <span style="font-size:3rem;">${tech.icon}</span>
            <h3 style="margin:10px 0 5px;color:${tech.color};">${tech.name}</h3>
            <p style="color:var(--text-secondary);">${tech.description}</p>
        </div>
        
        <div style="margin-bottom:20px;">
            <div style="font-weight:600;margin-bottom:10px;">📋 How to Apply</div>
            ${tech.steps.map((s, i) => `<div style="display:flex;gap:10px;padding:8px 0;"><span style="color:${tech.color};font-weight:600;">${i+1}.</span><span>${s}</span></div>`).join('')}
        </div>
        
        <div style="margin-bottom:20px;">
            <div style="font-weight:600;margin-bottom:10px;">💡 Pro Tips</div>
            ${tech.tips.map(t => `<div style="display:flex;gap:10px;padding:6px 0;"><span style="color:var(--text-muted);">•</span><span style="font-size:0.9rem;color:var(--text-secondary);">${t}</span></div>`).join('')}
        </div>
        
        <div style="display:flex;gap:10px;justify-content:center;">
            <button class="btn btn-primary" onclick="startStudySession('${techId}', 25);closeModal('techniqueModal');" style="background:${tech.color};border-color:${tech.color};">
                ${tech.icon} Start 25-min Session
            </button>
        </div>
    `;
    
    // Create dynamic modal
    let modal = document.getElementById('techniqueModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'techniqueModal';
        modal.className = 'modal';
        modal.onclick = (e) => { if (e.target === modal) closeModal('techniqueModal'); };
        modal.innerHTML = `
            <div class="modal-content" style="max-width:500px;">
                <div class="modal-header"><h3>Technique</h3><button class="modal-close" onclick="closeModal('techniqueModal')">×</button></div>
                <div class="modal-body" id="techniqueModalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('techniqueModalBody').innerHTML = content;
    openModal('techniqueModal');
}

function startStudySession(technique, minutes) {
    currentStudyTechnique = technique;
    studyTimerSeconds = minutes * 60;
    studyTimerPaused = false;
    
    const tech = STUDY_TECHNIQUES[technique] || { icon: '📚', name: technique };
    document.getElementById('studyTimerLabel').textContent = `${tech.icon} ${tech.name}`;
    updateTimerDisplay();
    
    document.getElementById('studyTimer').classList.add('active');
    
    if (studyTimerInterval) clearInterval(studyTimerInterval);
    studyTimerInterval = setInterval(() => {
        if (!studyTimerPaused) {
            studyTimerSeconds--;
            updateTimerDisplay();
            
            if (studyTimerSeconds <= 0) {
                completeStudySession();
            }
        }
    }, 1000);
    
    toast(`${tech.icon} ${minutes}-minute ${tech.name} session started!`);
}

function updateTimerDisplay() {
    const mins = Math.floor(studyTimerSeconds / 60);
    const secs = studyTimerSeconds % 60;
    document.getElementById('studyTimerDisplay').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function pauseStudyTimer() {
    studyTimerPaused = !studyTimerPaused;
    toast(studyTimerPaused ? '⏸️ Timer paused' : '▶️ Timer resumed');
}

function stopStudyTimer() {
    if (!confirm('Stop this study session?')) return;
    
    clearInterval(studyTimerInterval);
    studyTimerInterval = null;
    document.getElementById('studyTimer').classList.remove('active');
    toast('Study session stopped');
}

function completeStudySession() {
    clearInterval(studyTimerInterval);
    studyTimerInterval = null;
    document.getElementById('studyTimer').classList.remove('active');
    
    // Log the time entry
    const tech = STUDY_TECHNIQUES[currentStudyTechnique] || { name: 'Study' };
    const entries = arr(K.time);
    const durationHours = Math.round((studyTimerSeconds === 0 ? 25 : (25 * 60 - studyTimerSeconds) / 60) / 60 * 100) / 100;
    
    entries.push({
        id: uid(),
        title: `${tech.name} Session`,
        duration: Math.max(0.25, durationHours),
        date: today(),
        category: 'study',
        technique: currentStudyTechnique
    });
    set(K.time, entries);
    
    toast('🎉 Study session complete! Great work!');
    
    // Play completion sound if available
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
    } catch(e) {}
    
    refreshTracker();
    renderStudyLab();
    
    // Phase 4: Show elaboration prompt
    showElaborationPrompt(currentStudyTechnique);
}

// ==================== PHASE 4: ELABORATION PROMPTS ====================

function showElaborationPrompt(technique) {
    const settings = getSettings();
    const prompts = ELABORATION_PROMPTS || [];
    if (prompts.length === 0) return;
    
    // Pick 3 random prompts
    const shuffled = prompts.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    const techName = STUDY_TECHNIQUES[technique] ? STUDY_TECHNIQUES[technique].name : 'Study';
    
    // Create elaboration modal dynamically
    let modal = document.getElementById('elaborationModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'elaborationModal';
        modal.className = 'modal';
        modal.onclick = (e) => { if (e.target === modal) closeElaborationModal(); };
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width:550px;">
            <div class="modal-header">
                <h3>🧠 Elaboration Check</h3>
                <button class="modal-close" onclick="closeElaborationModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:16px;">
                    <strong>Make It Stick:</strong> Connecting new material to what you already know builds stronger, more durable memories. Take 2 minutes to reflect.
                </div>
                <div style="background:var(--bg-tertiary);border-radius:8px;padding:14px;margin-bottom:14px;">
                    <div style="font-weight:600;margin-bottom:8px;color:var(--accent);">After your ${esc(techName)} session:</div>
                    ${selected.map((p, i) => `<div style="margin-bottom:8px;color:var(--text-secondary);font-size:0.9rem;">${i+1}. ${p}</div>`).join('')}
                </div>
                <textarea id="elaborationResponse" class="form-textarea" style="min-height:120px;" placeholder="Write your reflection here..."></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeElaborationModal()">Skip</button>
                <button class="btn btn-primary" onclick="saveElaboration('${technique}')">💾 Save to Journal</button>
            </div>
        </div>
    `;
    modal.classList.add('show');
}

function saveElaboration(technique) {
    const response = document.getElementById('elaborationResponse').value.trim();
    if (!response) { toast('Write a reflection first'); return; }
    
    const techName = STUDY_TECHNIQUES[technique] ? STUDY_TECHNIQUES[technique].name : 'Study';
    const entries = arr(K.journal);
    entries.push({
        id: uid(),
        title: `Elaboration: ${techName} Session`,
        content: response,
        date: today(),
        mood: '🧠',
        type: 'elaboration',
        tags: ['elaboration', technique || 'study'],
        created: new Date().toISOString()
    });
    set(K.journal, entries);
    
    closeElaborationModal();
    toast('💡 Elaboration saved to journal!');
}

function closeElaborationModal() {
    const modal = document.getElementById('elaborationModal');
    if (modal) modal.classList.remove('show');
}

