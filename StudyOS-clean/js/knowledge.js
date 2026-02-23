// ==================== KNOWLEDGE VAULT ====================
// Enhanced with Phase 5: Critical Thinking Templates (from Asking the Right Questions)

let editingKnowledgeId = null;
let knowledgeFilter = 'all';
let knowledgeType = 'all'; // 'all', 'note', 'critical'

function renderKnowledge() {
    const notes = arr(K.knowledge);
    
    // Type filter
    const typeEl = document.getElementById('knowledgeTypeFilter');
    if (typeEl) {
        typeEl.innerHTML = `
            <button class="filter-btn ${knowledgeType==='all'?'active':''}" onclick="knowledgeType='all';renderKnowledge()">All</button>
            <button class="filter-btn ${knowledgeType==='note'?'active':''}" onclick="knowledgeType='note';renderKnowledge()">📝 Notes</button>
            <button class="filter-btn ${knowledgeType==='critical'?'active':''}" onclick="knowledgeType='critical';renderKnowledge()">🔍 Critical Analysis</button>
        `;
    }
    
    // Pathway filter
    document.getElementById('knowledgeFilters').innerHTML = `
        <button class="filter-btn ${knowledgeFilter==='all'?'active':''}" onclick="filterKnowledge('all')">All</button>
        <button class="filter-btn ${knowledgeFilter==='pmp'?'active':''}" onclick="filterKnowledge('pmp')">PMP</button>
        <button class="filter-btn ${knowledgeFilter==='mcmaster'?'active':''}" onclick="filterKnowledge('mcmaster')">McMaster</button>
        <button class="filter-btn ${knowledgeFilter==='smr'?'active':''}" onclick="filterKnowledge('smr')">SMR</button>
    `;
    
    let filtered = notes;
    if (knowledgeFilter !== 'all') filtered = filtered.filter(n => n.pathway === knowledgeFilter);
    if (knowledgeType === 'note') filtered = filtered.filter(n => n.entryType !== 'critical');
    if (knowledgeType === 'critical') filtered = filtered.filter(n => n.entryType === 'critical');
    
    const container = document.getElementById('knowledgeContainer');
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty" style="grid-column:1/-1;">No notes yet. Start building your knowledge vault.</div>';
        return;
    }
    container.innerHTML = filtered.sort((a,b) => (b.updated||b.created||'').localeCompare(a.updated||a.created||'')).map(n => `
        <div class="card" style="cursor:pointer;margin-bottom:0;${n.entryType==='critical'?'border-left:3px solid var(--purple);':''}" onclick="editKnowledge('${n.id}')">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                ${n.entryType === 'critical' ? '<span style="font-size:0.7rem;padding:2px 8px;background:var(--purple-light);color:var(--purple);border-radius:4px;font-weight:600;">CT</span>' : ''}
                <span style="font-weight:600;">${esc(n.title)}</span>
            </div>
            <div style="font-size:0.85rem;color:var(--text-secondary);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:10px;">${esc(n.content || n.conclusion || '')}</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
                ${n.pathway ? `<span class="badge badge-${n.pathway}">${n.pathway}</span>` : ''}
                ${(n.tags||[]).slice(0,3).map(t => `<span style="font-size:0.65rem;padding:2px 6px;background:var(--bg-tertiary);border-radius:4px;color:var(--text-muted);">${esc(t)}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function filterKnowledge(f) {
    knowledgeFilter = f;
    renderKnowledge();
}

function openKnowledgeModal(type) {
    editingKnowledgeId = null;
    const entryType = type || 'note';
    document.getElementById('knowledgeTitle').value = '';
    document.getElementById('knowledgePathway').value = '';
    document.getElementById('knowledgeTags').value = '';
    document.getElementById('knowledgeDeleteBtn').style.display = 'none';
    
    const bodyEl = document.getElementById('knowledgeModalBody');
    
    if (entryType === 'critical') {
        // Critical Thinking template
        const questions = typeof CRITICAL_THINKING_QUESTIONS !== 'undefined' ? CRITICAL_THINKING_QUESTIONS : [];
        bodyEl.innerHTML = `
            <input type="hidden" id="knowledgeEntryType" value="critical">
            <div class="form-group"><label class="form-label">Title *</label><input type="text" class="form-input" id="knowledgeTitle" placeholder="e.g., Analysis of PMBOK Chapter 4"></div>
            <div class="form-row">
                <div class="form-group"><label class="form-label">Pathway</label><select class="form-select" id="knowledgePathway"><option value="">— None —</option><option value="pmp">PMP</option><option value="mcmaster">McMaster</option><option value="smr">SMR</option></select></div>
                <div class="form-group"><label class="form-label">Tags (comma separated)</label><input type="text" class="form-input" id="knowledgeTags" placeholder="critical-thinking, chapter-4"></div>
            </div>
            <div style="background:var(--bg-tertiary);padding:12px;border-radius:8px;margin-bottom:14px;font-size:0.8rem;color:var(--text-muted);">
                <strong style="color:var(--purple);">📖 From "Asking the Right Questions":</strong> Use these 10 questions to critically evaluate any claim, argument, or material you're studying.
            </div>
            ${questions.map(q => `
                <div class="form-group">
                    <label class="form-label">${q.label}</label>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${q.hint}</div>
                    <textarea class="form-textarea" id="ct_${q.id}" style="min-height:60px;" placeholder="Your analysis..."></textarea>
                </div>
            `).join('')}
        `;
    } else {
        // Standard note
        bodyEl.innerHTML = `
            <input type="hidden" id="knowledgeEntryType" value="note">
            <div class="form-group"><label class="form-label">Title *</label><input type="text" class="form-input" id="knowledgeTitle"></div>
            <div class="form-row">
                <div class="form-group"><label class="form-label">Pathway</label><select class="form-select" id="knowledgePathway"><option value="">— None —</option><option value="pmp">PMP</option><option value="mcmaster">McMaster</option><option value="smr">SMR</option></select></div>
                <div class="form-group"><label class="form-label">Tags (comma separated)</label><input type="text" class="form-input" id="knowledgeTags" placeholder="risk, evm, pmp"></div>
            </div>
            <div class="form-group"><label class="form-label">Content *</label><textarea class="form-textarea" id="knowledgeContent" style="min-height:150px" placeholder="Your notes, formulas, key concepts..."></textarea></div>
        `;
    }
    openModal('knowledgeModal');
}

function editKnowledge(id) {
    const n = arr(K.knowledge).find(x => x.id === id);
    if (!n) return;
    editingKnowledgeId = id;
    
    if (n.entryType === 'critical') {
        openKnowledgeModal('critical');
        editingKnowledgeId = id; // reset after openKnowledgeModal clears it
        document.getElementById('knowledgeTitle').value = n.title || '';
        document.getElementById('knowledgePathway').value = n.pathway || '';
        document.getElementById('knowledgeTags').value = (n.tags || []).join(', ');
        const questions = typeof CRITICAL_THINKING_QUESTIONS !== 'undefined' ? CRITICAL_THINKING_QUESTIONS : [];
        questions.forEach(q => {
            const el = document.getElementById('ct_' + q.id);
            if (el) el.value = (n.analysis && n.analysis[q.id]) || '';
        });
    } else {
        openKnowledgeModal('note');
        editingKnowledgeId = id;
        document.getElementById('knowledgeTitle').value = n.title || '';
        document.getElementById('knowledgePathway').value = n.pathway || '';
        document.getElementById('knowledgeTags').value = (n.tags || []).join(', ');
        const contentEl = document.getElementById('knowledgeContent');
        if (contentEl) contentEl.value = n.content || '';
    }
    document.getElementById('knowledgeDeleteBtn').style.display = 'block';
}

function saveKnowledge() {
    const title = document.getElementById('knowledgeTitle').value.trim();
    if (!title) { toast('Title required'); return; }
    
    const entryTypeEl = document.getElementById('knowledgeEntryType');
    const entryType = entryTypeEl ? entryTypeEl.value : 'note';
    const tagsStr = document.getElementById('knowledgeTags').value.trim();
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];
    const pathway = document.getElementById('knowledgePathway').value || null;
    
    const notes = arr(K.knowledge);
    
    if (entryType === 'critical') {
        const questions = typeof CRITICAL_THINKING_QUESTIONS !== 'undefined' ? CRITICAL_THINKING_QUESTIONS : [];
        const analysis = {};
        let hasContent = false;
        questions.forEach(q => {
            const el = document.getElementById('ct_' + q.id);
            if (el && el.value.trim()) {
                analysis[q.id] = el.value.trim();
                hasContent = true;
            }
        });
        if (!hasContent) { toast('Fill in at least one analysis field'); return; }
        
        const entry = { title, tags, pathway, entryType: 'critical', analysis, conclusion: analysis.conclusion || '', updated: today() };
        
        if (editingKnowledgeId) {
            const n = notes.find(x => x.id === editingKnowledgeId);
            if (n) Object.assign(n, entry);
        } else {
            notes.push({ id: uid(), ...entry, created: today() });
        }
    } else {
        const content = (document.getElementById('knowledgeContent') || {}).value || '';
        if (!content.trim()) { toast('Content required'); return; }
        
        const entry = { title, content: content.trim(), tags, pathway, entryType: 'note', updated: today() };
        
        if (editingKnowledgeId) {
            const n = notes.find(x => x.id === editingKnowledgeId);
            if (n) Object.assign(n, entry);
        } else {
            notes.push({ id: uid(), ...entry, created: today() });
        }
    }
    
    set(K.knowledge, notes);
    closeModal('knowledgeModal');
    renderKnowledge();
    toast('Saved!');
}

function deleteKnowledge() {
    if (!editingKnowledgeId || !confirm('Delete note?')) return;
    set(K.knowledge, arr(K.knowledge).filter(n => n.id !== editingKnowledgeId));
    closeModal('knowledgeModal');
    renderKnowledge();
    toast('Deleted');
}
