// ==================== MODERN JOURNAL ====================
let editingJournalId = null;
let journalFilter = 'all';
let currentJournalTags = [];

const TYPE_ICONS = {
    reflection: '💭', gratitude: '🙏', learning: '📚', win: '🏆',
    idea: '💡', goal: '🎯', incident: '⚠️', mood: '😊'
};

const MOODS = ['😊', '😌', '🔥', '💪', '🤔', '😐', '😔', '😤', '😴', '🎉', '❤️', '🙏'];

function renderJournal() {
    const entries = arr(K.journal);
    
    // Render filters
    document.getElementById('journalFilters').innerHTML = `
        <button class="filter-btn ${journalFilter==='all'?'active':''}" onclick="setJournalFilter('all')">All</button>
        <button class="filter-btn ${journalFilter==='reflection'?'active':''}" onclick="setJournalFilter('reflection')">💭</button>
        <button class="filter-btn ${journalFilter==='learning'?'active':''}" onclick="setJournalFilter('learning')">📚</button>
        <button class="filter-btn ${journalFilter==='win'?'active':''}" onclick="setJournalFilter('win')">🏆</button>
        <button class="filter-btn ${journalFilter==='gratitude'?'active':''}" onclick="setJournalFilter('gratitude')">🙏</button>
        <button class="filter-btn ${journalFilter==='idea'?'active':''}" onclick="setJournalFilter('idea')">💡</button>
    `;
    
    // Render stats
    const thisWeek = new Date(); thisWeek.setDate(thisWeek.getDate() - 7);
    const weekStr = fmtDate(thisWeek);
    const weekEntries = entries.filter(e => e.date >= weekStr).length;
    const streak = calcJournalStreak();
    
    document.getElementById('journalStats').innerHTML = `
        <div class="journal-stat"><div class="journal-stat-value">${entries.length}</div><div class="journal-stat-label">Total Entries</div></div>
        <div class="journal-stat"><div class="journal-stat-value">${weekEntries}</div><div class="journal-stat-label">This Week</div></div>
        <div class="journal-stat"><div class="journal-stat-value">${streak}🔥</div><div class="journal-stat-label">Day Streak</div></div>
    `;
    
    // Render mood selector in modal
    document.getElementById('moodSelector').innerHTML = MOODS.map(m => 
        `<button type="button" class="mood-btn" data-mood="${m}" onclick="selectMood('${m}')">${m}</button>`
    ).join('');
    
    renderJournalEntries();
}

function calcJournalStreak() {
    const entries = arr(K.journal);
    const dates = [...new Set(entries.map(e => e.date))].sort().reverse();
    let streak = 0;
    let checkDate = new Date();
    
    for (let i = 0; i < 365; i++) {
        const dateStr = fmtDate(checkDate);
        if (dates.includes(dateStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else if (i === 0) {
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

function setJournalFilter(f) {
    journalFilter = f;
    document.querySelectorAll('#journalFilters .filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderJournalEntries();
}

function renderJournalEntries() {
    let entries = arr(K.journal);
    const search = (document.getElementById('journalSearch')?.value || '').toLowerCase();
    
    // Filter by type
    if (journalFilter !== 'all') {
        entries = entries.filter(e => e.type === journalFilter);
    }
    
    // Filter by search
    if (search) {
        entries = entries.filter(e => 
            (e.title || '').toLowerCase().includes(search) ||
            (e.content || '').toLowerCase().includes(search) ||
            (e.tags || []).some(t => t.toLowerCase().includes(search))
        );
    }
    
    // Sort by date desc
    entries.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    
    const container = document.getElementById('journalContainer');
    
    if (entries.length === 0) {
        container.innerHTML = `
            <div class="empty" style="padding:60px 20px;">
                <div style="font-size:3.5rem;margin-bottom:16px;">📝</div>
                <div style="font-size:1.15rem;margin-bottom:8px;font-weight:500;">No entries yet</div>
                <div style="color:var(--text-muted);margin-bottom:24px;">Start capturing your thoughts and reflections</div>
                <button class="btn btn-primary" onclick="openJournalModal()" style="padding:12px 24px;">✍️ Write First Entry</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `<div class="journal-grid">${entries.map(e => {
        const icon = e.icon || TYPE_ICONS[e.type] || '📝';
        const dateObj = new Date(e.date + 'T12:00:00');
        const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const plainContent = (e.content || '').replace(/<[^>]*>/g, '').substring(0, 200);
        
        return `
            <div class="journal-card" onclick="editJournal('${e.id}')">
                <div class="journal-card-header">
                    <div class="journal-card-icon">${icon}</div>
                    <div class="journal-card-meta">
                        <div class="journal-card-title">${esc(e.title || 'Untitled')}</div>
                        <div class="journal-card-date">
                            <span>${dateStr}</span>
                            ${e.mood ? `<span class="journal-mood">${e.mood}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="journal-card-content">${esc(plainContent)}</div>
                <div class="journal-card-footer">
                    ${e.pathway ? `<span class="journal-tag pathway">${e.pathway.toUpperCase()}</span>` : ''}
                    ${(e.tags || []).slice(0, 4).map(t => `<span class="journal-tag">#${esc(t)}</span>`).join('')}
                </div>
            </div>
        `;
    }).join('')}</div>`;
}

function openJournalModal() {
    editingJournalId = null;
    currentJournalTags = [];
    
    document.getElementById('journalDate').value = today();
    document.getElementById('journalType').value = 'reflection';
    document.getElementById('journalTitle').value = '';
    document.getElementById('journalContent').innerHTML = '';
    document.getElementById('journalMood').value = '';
    document.getElementById('journalPathway').value = '';
    document.getElementById('journalIconBtn').textContent = '📝';
    document.getElementById('journalDeleteBtn').style.display = 'none';
    
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
    renderJournalTags();
    updateWordCount();
    
    openModal('journalModal');
    setTimeout(() => document.getElementById('journalTitle').focus(), 100);
}

function editJournal(id) {
    const e = arr(K.journal).find(x => x.id === id);
    if (!e) return;
    
    editingJournalId = id;
    currentJournalTags = e.tags || [];
    
    document.getElementById('journalDate').value = e.date || '';
    document.getElementById('journalType').value = e.type || 'reflection';
    document.getElementById('journalTitle').value = e.title || '';
    document.getElementById('journalContent').innerHTML = e.content || '';
    document.getElementById('journalMood').value = e.mood || '';
    document.getElementById('journalPathway').value = e.pathway || '';
    document.getElementById('journalIconBtn').textContent = e.icon || TYPE_ICONS[e.type] || '📝';
    document.getElementById('journalDeleteBtn').style.display = 'block';
    
    document.querySelectorAll('.mood-btn').forEach(b => {
        b.classList.toggle('selected', b.dataset.mood === e.mood);
    });
    
    renderJournalTags();
    updateWordCount();
    openModal('journalModal');
}

function saveJournal() {
    const content = document.getElementById('journalContent').innerHTML.trim();
    if (!content || content === '<br>') {
        toast('Write something first');
        return;
    }

    const entries = arr(K.journal);
    const data = {
        date: document.getElementById('journalDate').value || today(),
        type: document.getElementById('journalType').value,
        title: document.getElementById('journalTitle').value.trim() || 'Untitled',
        content: content,
        mood: document.getElementById('journalMood').value,
        icon: document.getElementById('journalIconBtn').textContent,
        tags: currentJournalTags,
        pathway: document.getElementById('journalPathway').value,
        updatedAt: new Date().toISOString()
    };

    if (editingJournalId) {
        const i = entries.findIndex(e => e.id === editingJournalId);
        if (i !== -1) entries[i] = { ...entries[i], ...data };
        set(K.journal, entries);
        closeModal('journalModal');
        renderJournal();
        toast('Entry saved! ✨');
    } else {
        entries.push({ id: uid(), createdAt: new Date().toISOString(), ...data });
        set(K.journal, entries);
        renderJournal();
        toast('Entry saved! ✨');
        // Show Reflection → Action bridge
        document.querySelector('#journalModal .modal-content').innerHTML = `
            <div style="text-align:center;padding:20px;">
                <div style="font-size:2rem;margin-bottom:12px;">✅</div>
                <div style="font-weight:700;font-size:1.1rem;margin-bottom:8px;">Entry Saved!</div>
                <div style="color:var(--text-muted);font-size:0.9rem;margin-bottom:20px;">
                    🧠 <strong>Reflection → Action:</strong> What's one concrete action from this reflection?
                </div>
                <input type="text" class="form-input" id="reflectionAction" placeholder="e.g., Email Lucas about Aecon opportunity" style="margin-bottom:12px;font-size:0.95rem;">
                <div style="display:flex;gap:8px;justify-content:center;">
                    <button class="btn btn-primary" onclick="createActionFromReflection()">✅ Create Task</button>
                    <button class="btn btn-secondary" onclick="closeModal('journalModal');renderJournal();">Skip</button>
                </div>
            </div>
        `;
    }
}

function createActionFromReflection() {
    const action = document.getElementById('reflectionAction').value.trim();
    if (!action) { toast('Enter an action first'); return; }

    const tasks = arr(K.tasks);
    tasks.push({
        id: uid(),
        title: action,
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        tags: ['reflection-action'],
        createdAt: new Date().toISOString(),
        notes: 'Created from journal reflection'
    });
    set(K.tasks, tasks);

    closeModal('journalModal');
    renderJournal();
    toast('🎯 Action created as task!');
}

function deleteJournal() {
    if (!editingJournalId || !confirm('Delete this entry?')) return;
    set(K.journal, arr(K.journal).filter(e => e.id !== editingJournalId));
    closeModal('journalModal');
    renderJournal();
    toast('Deleted');
}

// Mood selection
function selectMood(mood) {
    document.getElementById('journalMood').value = mood;
    document.querySelectorAll('.mood-btn').forEach(b => {
        b.classList.toggle('selected', b.dataset.mood === mood);
    });
}

// Rich text formatting
function formatText(cmd, val = null) {
    document.execCommand(cmd, false, val);
    document.getElementById('journalContent').focus();
}

function formatBlock(tag) {
    document.execCommand('formatBlock', false, tag);
    document.getElementById('journalContent').focus();
}

function insertCheckbox() {
    const html = '<div class="editor-checkbox"><input type="checkbox" onclick="this.parentElement.classList.toggle(\'done\',this.checked)"><span contenteditable="true">Todo item</span></div>';
    document.execCommand('insertHTML', false, html);
}

function insertDivider() {
    document.execCommand('insertHTML', false, '<hr style="border:none;border-top:1px solid var(--border);margin:16px 0;">');
}

function insertCallout() {
    const html = '<div class="callout-block" contenteditable="true">💡 Write your callout here...</div>';
    document.execCommand('insertHTML', false, html);
}

function highlightText() {
    document.execCommand('hiliteColor', false, 'rgba(249, 115, 22, 0.3)');
}

function showEmojiPicker() {
    const emojis = '😀 😊 🎉 🔥 💪 ⭐ ❤️ 👍 🙏 ✨ 🚀 💡 📝 ✅ ⚠️ 🎯 📚 🏆';
    const picked = prompt('Pick an emoji or paste your own:', emojis);
    if (picked) {
        const emoji = picked.trim().split(' ')[0];
        document.execCommand('insertText', false, emoji);
    }
}

function pickJournalIcon() {
    const icons = '📝 💭 🙏 📚 🏆 💡 🎯 ⚠️ 😊 🔥 💪 🎉 ⭐ ❤️ 🚀 🌅 🌙 ☀️ 🌈 🎨 📖 ✍️ 🧠 💼';
    const picked = prompt('Choose an icon:', icons);
    if (picked) {
        document.getElementById('journalIconBtn').textContent = picked.trim().split(' ')[0];
    }
}

function updateIconFromType() {
    const type = document.getElementById('journalType').value;
    if (TYPE_ICONS[type]) {
        document.getElementById('journalIconBtn').textContent = TYPE_ICONS[type];
    }
}

// Tags
function renderJournalTags() {
    document.getElementById('journalTagsContainer').innerHTML = currentJournalTags.map(t => `
        <span class="tag-chip">#${esc(t)}<span class="tag-chip-remove" onclick="removeJournalTag('${esc(t)}')">&times;</span></span>
    `).join('');
}

function handleTagInput(e) {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const input = document.getElementById('journalTagInput');
        const tag = input.value.trim().replace(/[,#]/g, '').toLowerCase();
        if (tag && !currentJournalTags.includes(tag)) {
            currentJournalTags.push(tag);
            renderJournalTags();
        }
        input.value = '';
    }
}

function removeJournalTag(tag) {
    currentJournalTags = currentJournalTags.filter(t => t !== tag);
    renderJournalTags();
}

// Word count
function updateWordCount() {
    const content = document.getElementById('journalContent');
    const text = content.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('journalWordCount').textContent = `${words} word${words !== 1 ? 's' : ''}`;
}

// Handle paste to strip formatting optionally
function handlePaste(e) {
    // Allow rich paste by default, user can Ctrl+Shift+V for plain
}

// Auto-save word count on input
document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('journalContent');
    if (content) {
        content.addEventListener('input', updateWordCount);
    }
});

