// ==================== STORAGE & UTILITIES ====================
const K = { 
    settings:'hcc_settings', goals:'hcc_goals', tasks:'hcc_tasks', time:'hcc_time', 
    habits:'hcc_habits', habitLogs:'hcc_habitLogs', journal:'hcc_journal',
    discipline:'hcc_discipline', protocol:'hcc_protocol', learnProgress:'hcc_learn',
    knowledge:'hcc_knowledge', onboarding:'hcc_onboarding', events:'hcc_events',
    flashcards:'hcc_flashcards', cardReviews:'hcc_cardReviews', weeklyReviews:'hcc_weeklyReviews',
    focusSessions:'hcc_focusSessions', contacts:'hcc_contacts', pmpProgress:'hcc_pmpProgress',
    quotes:'hcc_quotes', pomodoroStats:'hcc_pomodoroStats'
};

const get = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const arr = k => get(k) || [];
const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2,9);
const fmtDate = d => d.toISOString().split('T')[0];
const today = () => fmtDate(new Date());
const esc = t => { if(!t)return''; const d=document.createElement('div'); d.textContent=t; return d.innerHTML; };

function toast(m) { document.getElementById('toastMsg').textContent=m; document.getElementById('toast').classList.add('show'); setTimeout(()=>document.getElementById('toast').classList.remove('show'),2000); }
function openModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

