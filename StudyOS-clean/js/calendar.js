// ==================== CALENDAR ====================
let currentCalendarDate = new Date();
let selectedCalendarDate = null;
let editingEventId = null;

function renderCalendar() {
    const events = arr(K.events);
    const tasks = arr(K.tasks);
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // Update header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('calendarMonthYear').textContent = `${monthNames[month]} ${year}`;
    
    // Calculate stats
    const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-31`;
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const allItems = [...events, ...tasks.filter(t => t.due)];
    const thisMonthEvents = allItems.filter(e => (e.date || e.due) >= monthStart && (e.date || e.due) <= monthEnd).length;
    const thisWeekEvents = allItems.filter(e => {
        const d = e.date || e.due;
        return d >= fmtDate(weekStart) && d <= fmtDate(weekEnd);
    }).length;
    const todayEvents = allItems.filter(e => (e.date || e.due) === today()).length;
    
    document.getElementById('calEventsThisMonth').textContent = thisMonthEvents;
    document.getElementById('calEventsThisWeek').textContent = thisWeekEvents;
    document.getElementById('calEventsToday').textContent = todayEvents;
    
    // Build calendar grid
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = '<div class="calendar-grid">';
    
    // Header row
    dayNames.forEach(d => html += `<div class="calendar-header">${d}</div>`);
    
    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevDays = prevMonth.getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const day = prevDays - i;
        const dateStr = fmtDate(new Date(year, month - 1, day));
        html += `<div class="calendar-day other-month" onclick="selectCalendarDate('${dateStr}')"><div class="calendar-day-num">${day}</div></div>`;
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === today();
        const dayEvents = events.filter(e => e.date === dateStr);
        const dayTasks = tasks.filter(t => t.due === dateStr && !t.completed);
        const hasEvents = dayEvents.length > 0 || dayTasks.length > 0;
        
        html += `<div class="calendar-day ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}" onclick="selectCalendarDate('${dateStr}')">
            <div class="calendar-day-num">${day}</div>
            <div class="calendar-day-events">
                ${dayEvents.slice(0, 2).map(e => `<div class="calendar-event-dot ${e.type}">${esc(e.title.substring(0, 10))}</div>`).join('')}
                ${dayTasks.slice(0, 2 - dayEvents.length).map(t => `<div class="calendar-event-dot task">${esc(t.title.substring(0, 10))}</div>`).join('')}
            </div>
        </div>`;
    }
    
    // Next month days
    const totalCells = startDayOfWeek + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remainingCells; i++) {
        const dateStr = fmtDate(new Date(year, month + 1, i));
        html += `<div class="calendar-day other-month" onclick="selectCalendarDate('${dateStr}')"><div class="calendar-day-num">${i}</div></div>`;
    }
    
    html += '</div>';
    document.getElementById('calendarGrid').innerHTML = html;
    
    // Render upcoming events
    renderUpcomingEvents();
}

function renderUpcomingEvents() {
    const events = arr(K.events);
    const tasks = arr(K.tasks).filter(t => t.due && !t.completed);
    const td = today();
    
    // Combine and sort
    const allItems = [
        ...events.map(e => ({ ...e, itemType: 'event' })),
        ...tasks.map(t => ({ ...t, date: t.due, itemType: 'task', type: 'task' }))
    ].filter(e => e.date >= td)
     .sort((a, b) => a.date.localeCompare(b.date))
     .slice(0, 10);
    
    if (!allItems.length) {
        document.getElementById('upcomingEvents').innerHTML = '<div class="empty">No upcoming events</div>';
        return;
    }
    
    document.getElementById('upcomingEvents').innerHTML = allItems.map(e => {
        const dateObj = new Date(e.date + 'T12:00:00');
        const day = dateObj.getDate();
        const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' });
        const timeStr = e.time || '';
        
        return `
            <div class="event-item ${e.type || 'event'}" onclick="${e.itemType === 'event' ? `editEvent('${e.id}')` : `editTask('${e.id}')`}">
                <div class="event-date">
                    <div class="event-date-day">${day}</div>
                    <div class="event-date-month">${monthShort}</div>
                </div>
                <div class="event-info">
                    <div class="event-title">${esc(e.title)}</div>
                    <div class="event-meta">${timeStr ? timeStr + ' • ' : ''}${e.notes || e.type || ''}</div>
                </div>
                <span class="event-type ${e.type || 'event'}">${e.type || 'event'}</span>
            </div>
        `;
    }).join('');
}

function changeMonth(delta) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderCalendar();
}

function goToToday() {
    currentCalendarDate = new Date();
    renderCalendar();
}

function selectCalendarDate(dateStr) {
    selectedCalendarDate = dateStr;
    document.getElementById('eventDate').value = dateStr;
    openEventModal();
}

function openEventModal() {
    editingEventId = null;
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDate').value = selectedCalendarDate || today();
    document.getElementById('eventTime').value = '';
    document.getElementById('eventType').value = 'event';
    document.getElementById('eventDuration').value = '';
    document.getElementById('eventNotes').value = '';
    document.getElementById('eventRepeat').value = '';
    document.getElementById('eventDeleteBtn').style.display = 'none';
    openModal('eventModal');
}

function editEvent(id) {
    const e = arr(K.events).find(x => x.id === id);
    if (!e) return;
    
    editingEventId = id;
    document.getElementById('eventTitle').value = e.title || '';
    document.getElementById('eventDate').value = e.date || '';
    document.getElementById('eventTime').value = e.time || '';
    document.getElementById('eventType').value = e.type || 'event';
    document.getElementById('eventDuration').value = e.duration || '';
    document.getElementById('eventNotes').value = e.notes || '';
    document.getElementById('eventRepeat').value = e.repeat || '';
    document.getElementById('eventDeleteBtn').style.display = 'block';
    openModal('eventModal');
}

function saveEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    if (!title || !date) {
        toast('Title and date required');
        return;
    }
    
    const events = arr(K.events);
    const data = {
        title,
        date,
        time: document.getElementById('eventTime').value || null,
        type: document.getElementById('eventType').value,
        duration: document.getElementById('eventDuration').value || null,
        notes: document.getElementById('eventNotes').value.trim() || null,
        repeat: document.getElementById('eventRepeat').value || null
    };
    
    if (editingEventId) {
        const i = events.findIndex(e => e.id === editingEventId);
        if (i !== -1) events[i] = { ...events[i], ...data };
    } else {
        events.push({ id: uid(), ...data });
    }
    
    set(K.events, events);
    closeModal('eventModal');
    renderCalendar();
    toast('Event saved! 📅');
}

function deleteEvent() {
    if (!editingEventId || !confirm('Delete this event?')) return;
    set(K.events, arr(K.events).filter(e => e.id !== editingEventId));
    closeModal('eventModal');
    renderCalendar();
    toast('Event deleted');
}

