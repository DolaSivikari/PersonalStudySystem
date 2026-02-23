// ==================== FOCUS MODE ====================
let focusInterval = null;
let focusSeconds = 0;
let focusPaused = false;
let focusTask = '';

function startFocusMode(task, minutes = 25) {
    focusTask = task || document.getElementById('todayFocusTask')?.textContent || 'Deep Work';
    focusSeconds = minutes * 60;
    focusPaused = false;
    
    document.getElementById('focusTask').textContent = focusTask;
    updateFocusDisplay();
    document.getElementById('focusOverlay').classList.add('active');
    
    // Random quote
    const quotes = getMotivationalQuotes();
    document.getElementById('focusQuote').textContent = `"${quotes[Math.floor(Math.random() * quotes.length)].text}" — ${quotes[Math.floor(Math.random() * quotes.length)].author}`;
    
    if (focusInterval) clearInterval(focusInterval);
    focusInterval = setInterval(() => {
        if (!focusPaused) {
            focusSeconds--;
            updateFocusDisplay();
            if (focusSeconds <= 0) completeFocusSession();
        }
    }, 1000);
}

function updateFocusDisplay() {
    const mins = Math.floor(focusSeconds / 60);
    const secs = focusSeconds % 60;
    document.getElementById('focusTime').textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function pauseFocusMode() {
    focusPaused = !focusPaused;
}

function exitFocusMode() {
    if (!confirm('Exit focus mode?')) return;
    clearInterval(focusInterval);
    focusInterval = null;
    document.getElementById('focusOverlay').classList.remove('active');
}

function completeFocusSession() {
    clearInterval(focusInterval);
    focusInterval = null;
    document.getElementById('focusOverlay').classList.remove('active');
    
    // Log pomodoro
    const stats = get(K.pomodoroStats) || {};
    stats[today()] = (stats[today()] || 0) + 1;
    set(K.pomodoroStats, stats);
    
    // Log time
    const time = arr(K.time);
    time.push({
        id: uid(),
        title: focusTask,
        duration: 0.42, // 25 min
        date: today(),
        category: 'study',
        type: 'focus'
    });
    set(K.time, time);
    
    toast('🎉 Focus session complete!');
}

