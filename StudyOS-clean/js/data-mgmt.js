// ==================== DATA ====================
function exportData(){const data={};Object.keys(K).forEach(k=>{data[k]=get(K[k]);});const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='hcc-backup-'+today()+'.json';a.click();toast('Exported!');}
function importData(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=function(ev){try{const data=JSON.parse(ev.target.result);Object.keys(K).forEach(k=>{if(data[k]!==undefined)set(K[k],data[k]);});toast('Imported!');refreshDashboard();}catch{toast('Error');}};reader.readAsText(file);e.target.value='';}
function resetData(){if(!confirm('Delete ALL data?'))return;if(!confirm('Sure?'))return;Object.keys(K).forEach(k=>localStorage.removeItem(K[k]));toast('Reset!');refreshDashboard();}

