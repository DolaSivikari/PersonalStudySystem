// ==================== HABITS ====================
let editingHabitId = null;

function renderHabits() {
    const habits = arr(K.habits);
    const logs = arr(K.habitLogs);
    
    // Stats
    const todayDone = habits.filter(h => logs.some(l => l.habitId === h.id && l.date === today())).length;
    let longestStreak = 0;
    habits.forEach(h => {
        let streak = 0;
        let d = new Date();
        while (logs.some(l => l.habitId === h.id && l.date === fmtDate(d))) {
            streak++;
            d.setDate(d.getDate() - 1);
        }
        if (streak > longestStreak) longestStreak = streak;
    });
    
    document.getElementById('habitsActive').textContent = habits.length;
    document.getElementById('habitsTodayDone').textContent = todayDone;
    document.getElementById('habitsLongestStreak').textContent = longestStreak + '🔥';
    
    // Generate last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({ date: fmtDate(d), day: d.toLocaleDateString('en-US', { weekday: 'short' }), num: d.getDate() });
    }
    
    if (!habits.length) {
        document.getElementById('habitsContainer').innerHTML = `
            <div class="empty" style="padding:60px 20px;">
                <div style="font-size:3rem;margin-bottom:16px;">✨</div>
                <div style="font-size:1.1rem;margin-bottom:8px;">No habits yet</div>
                <div style="color:var(--text-muted);margin-bottom:20px;">Start with just ONE habit</div>
                <button class="btn btn-primary" onclick="openHabitModal()">➕ Create Habit</button>
            </div>
        `;
        return;
    }
    
    document.getElementById('habitsContainer').innerHTML = habits.map(h => {
        // Calculate streak
        let streak = 0;
        let d = new Date();
        while (logs.some(l => l.habitId === h.id && l.date === fmtDate(d))) {
            streak++;
            d.setDate(d.getDate() - 1);
        }
        
        return `
            <div class="habit-card">
                <div class="habit-header">
                    <span class="habit-name" onclick="editHabit('${h.id}')">${esc(h.name)}</span>
                    <span class="habit-streak">${streak > 0 ? streak + '🔥' : ''}</span>
                </div>
                <div class="habit-grid">
                    ${days.map(day => {
                        const done = logs.some(l => l.habitId === h.id && l.date === day.date);
                        const isToday = day.date === today();
                        return `
                            <div class="habit-day ${done ? 'done' : ''} ${isToday ? 'today' : ''}" 
                                 onclick="toggleHabitDay('${h.id}','${day.date}')"
                                 title="${day.day}">
                                ${done ? '✓' : day.num}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function toggleHabitDay(hid, dt) {
    const logs = arr(K.habitLogs);
    const i = logs.findIndex(l => l.habitId === hid && l.date === dt);
    if (i !== -1) logs.splice(i, 1);
    else logs.push({ id: uid(), habitId: hid, date: dt });
    set(K.habitLogs, logs);
    renderHabits();
    refreshDashboard();
}

function openHabitModal(){editingHabitId=null;document.getElementById('habitName').value='';document.getElementById('habitDeleteBtn').style.display='none';openModal('habitModal');}
function editHabit(id){const h=arr(K.habits).find(x=>x.id===id);if(!h)return;editingHabitId=id;document.getElementById('habitName').value=h.name;document.getElementById('habitDeleteBtn').style.display='block';openModal('habitModal');}
function saveHabit(){const name=document.getElementById('habitName').value.trim();if(!name){toast('Enter name');return;}const habits=arr(K.habits);if(editingHabitId){const i=habits.findIndex(h=>h.id===editingHabitId);if(i!==-1)habits[i].name=name;}else{habits.push({id:uid(),name});}set(K.habits,habits);closeModal('habitModal');renderHabits();toast('Saved!');}
function deleteHabit(){if(!editingHabitId||!confirm('Delete?'))return;set(K.habits,arr(K.habits).filter(h=>h.id!==editingHabitId));set(K.habitLogs,arr(K.habitLogs).filter(l=>l.habitId!==editingHabitId));closeModal('habitModal');renderHabits();toast('Deleted');}

