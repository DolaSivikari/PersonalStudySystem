// ==================== TASKS ====================
let editingTaskId = null;
let taskFilter = 'all';

function renderTasks() {
    const tasks = arr(K.tasks);
    const td = today();
    
    // Stats
    const dueToday = tasks.filter(t => t.due === td && !t.completed).length;
    const overdue = tasks.filter(t => t.due && t.due < td && !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    
    document.getElementById('tasksDueToday').textContent = dueToday;
    document.getElementById('tasksOverdue').textContent = overdue;
    document.getElementById('tasksCompleted').textContent = completed;
    document.getElementById('tasksTotal').textContent = total;
    
    // Filters
    document.getElementById('taskFilters').innerHTML = `
        <button class="filter-btn ${taskFilter==='all'?'active':''}" onclick="setTaskFilter('all')">📋 All</button>
        <button class="filter-btn ${taskFilter==='today'?'active':''}" onclick="setTaskFilter('today')">📅 Today</button>
        <button class="filter-btn ${taskFilter==='overdue'?'active':''}" onclick="setTaskFilter('overdue')">🔴 Overdue</button>
        <button class="filter-btn ${taskFilter==='done'?'active':''}" onclick="setTaskFilter('done')">✅ Done</button>
    `;
    
    renderTasksList(taskFilter);
}

function setTaskFilter(f) {
    taskFilter = f;
    renderTasks();
}

function renderTasksList(f) {
    let tasks = arr(K.tasks);
    const td = today();
    
    if (f === 'today') tasks = tasks.filter(t => t.due === td && !t.completed);
    else if (f === 'overdue') tasks = tasks.filter(t => t.due && t.due < td && !t.completed);
    else if (f === 'done') tasks = tasks.filter(t => t.completed);
    else tasks = tasks.filter(t => !t.completed);
    
    // Sort by priority then due date
    const priorityOrder = { high: 0, med: 1, low: 2 };
    tasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) return priorityOrder[a.priority] - priorityOrder[b.priority];
        return (a.due || '9999').localeCompare(b.due || '9999');
    });
    
    if (!tasks.length) {
        document.getElementById('tasksContainer').innerHTML = `<div class="empty" style="padding:40px;">No tasks in this view</div>`;
        return;
    }
    
    document.getElementById('tasksContainer').innerHTML = tasks.map(t => {
        const isOverdue = t.due && t.due < td && !t.completed;
        const dueText = t.due ? (t.due === td ? 'Today' : new Date(t.due + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) : '';
        
        return `
            <div class="task-item" onclick="editTask('${t.id}')">
                <div class="task-check ${t.completed ? 'done' : ''}" onclick="event.stopPropagation();toggleTask('${t.id}')">${t.completed ? '✓' : ''}</div>
                <div class="task-info">
                    <div class="task-title ${t.completed ? 'done' : ''}">${esc(t.title)}</div>
                    ${dueText ? `<div class="task-due ${isOverdue ? 'overdue' : ''}">${isOverdue ? '⚠️ ' : ''}${dueText}</div>` : ''}
                </div>
                <span class="task-priority ${t.priority}">${t.priority}</span>
            </div>
        `;
    }).join('');
}

function quickAddTask() {
    const input = document.getElementById('quickTaskInput');
    const title = input.value.trim();
    if (!title) return;
    
    const tasks = arr(K.tasks);
    tasks.push({ id: uid(), title, priority: 'med', completed: false });
    set(K.tasks, tasks);
    input.value = '';
    renderTasks();
    refreshDashboard();
    toast('Task added!');
}

function filterTasks(f, el) { setTaskFilter(f); }
function openTaskModal(){editingTaskId=null;document.getElementById('taskTitle').value='';document.getElementById('taskDue').value='';document.getElementById('taskPriority').value='med';document.getElementById('taskDeleteBtn').style.display='none';openModal('taskModal');}
function editTask(id){const t=arr(K.tasks).find(x=>x.id===id);if(!t)return;editingTaskId=id;document.getElementById('taskTitle').value=t.title;document.getElementById('taskDue').value=t.due||'';document.getElementById('taskPriority').value=t.priority;document.getElementById('taskDeleteBtn').style.display='block';openModal('taskModal');}
function saveTask(){const title=document.getElementById('taskTitle').value.trim();if(!title){toast('Enter task');return;}const tasks=arr(K.tasks);const data={title,due:document.getElementById('taskDue').value||null,priority:document.getElementById('taskPriority').value,completed:false};if(editingTaskId){const i=tasks.findIndex(t=>t.id===editingTaskId);if(i!==-1){data.completed=tasks[i].completed;tasks[i]={...tasks[i],...data};}}else{tasks.push({id:uid(),...data});}set(K.tasks,tasks);closeModal('taskModal');renderTasks();refreshDashboard();toast('Saved!');}
function deleteTask(){if(!editingTaskId||!confirm('Delete?'))return;set(K.tasks,arr(K.tasks).filter(t=>t.id!==editingTaskId));closeModal('taskModal');renderTasks();refreshDashboard();toast('Deleted');}
function toggleTask(id){const tasks=arr(K.tasks);const t=tasks.find(x=>x.id===id);if(t){t.completed=!t.completed;set(K.tasks,tasks);renderTasks();refreshDashboard();}}

