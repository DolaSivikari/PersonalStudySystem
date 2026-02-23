// ==================== NAVIGATION ====================
function go(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    document.getElementById(page).classList.add('active');
    // Highlight the correct sidebar nav link
    const navLink = document.querySelector('.nav-link[onclick="go(\'' + page + '\')"]');
    if(navLink) navLink.classList.add('active');
    // Auto-close sidebar on mobile when a nav link is clicked
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.classList.remove('show');
    }
    
    if(page==='dashboard') refreshDashboard();
    else if(page==='protocol') renderProtocol();
    else if(page==='discipline') renderDiscipline();
    else if(page==='learn') renderLearn();
    else if(page==='studylab') renderStudyLab();
    else if(page==='pmptools') renderPmpTools();
    else if(page==='flashcards') renderFlashcards();
    else if(page==='knowledge') renderKnowledge();
    else if(page==='goals') renderGoals();
    else if(page==='tasks') renderTasks();
    else if(page==='calendar') renderCalendar();
    else if(page==='tracker') refreshTracker();
    else if(page==='habits') renderHabits();
    else if(page==='contacts') renderContacts();
    else if(page==='journal') renderJournal();
    else if(page==='review') renderWeeklyReview();
    else if(page==='insights') showInsight('overview');
    else if(page==='settings') loadSettings();
    window.scrollTo(0, 0);
}

