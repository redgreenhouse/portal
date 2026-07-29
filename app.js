

const masterData = [
  {category:'Identidad', field:'Nombre de la unidad de producción', detail:'Nombre oficial usado en encabezados, portadas y registros.', source:'M2–M7', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Identidad', field:'Folio SENASICA', detail:'Identificador repetido en portadas, procedimientos, análisis, mapas y bitácoras.', source:'M2–M7', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Identidad', field:'Razón social / propietario', detail:'Identidad legal o responsable de la unidad productiva.', source:'Por confirmar', modules:{2:'p',3:'p',4:'p',5:'p',6:'p',7:'p',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Ubicación', field:'Domicilio de la unidad', detail:'Localidad, municipio, estado y referencias de acceso.', source:'M2', modules:{2:'c',3:'p',4:'p',5:'p',6:'p',7:'p',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Ubicación', field:'Coordenadas geográficas', detail:'Polígono y puntos georreferenciados en grados decimales.', source:'M2', modules:{2:'c',3:'',4:'',5:'',6:'',7:'',8:'p',9:'',10:'p',11:'',12:'p',13:'',14:''}},
  {category:'Ubicación', field:'Macro y microlocalización', detail:'Mapas y referencias territoriales de la unidad de producción.', source:'M2', modules:{2:'c',3:'',4:'',5:'',6:'',7:'',8:'p',9:'',10:'p',11:'',12:'p',13:'',14:''}},
  {category:'Producción', field:'Cultivo y variedad', detail:'Producto agrícola al que aplican procedimientos, riesgos y registros.', source:'M2–M7', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Producción', field:'Superficie y áreas productivas', detail:'Extensión, invernaderos, bloques y zonas incluidas.', source:'M2', modules:{2:'c',3:'p',4:'p',5:'',6:'p',7:'p',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Personas', field:'Alta Dirección', detail:'Nombre y cargo de quien autoriza procedimientos y recursos.', source:'M2–M7', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Personas', field:'Responsable de inocuidad', detail:'Persona que implementa, supervisa y revisa el sistema SRRC.', source:'M2–M7', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Personas', field:'Responsables por área', detail:'Producción, mantenimiento, higiene, capacitación, fauna y auditoría.', source:'M2–M7', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Personas', field:'Firmas de elaboración, revisión y autorización', detail:'Nombres y cargos para los pies de firma de procedimientos.', source:'M2–M7', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Infraestructura', field:'Inventario de instalaciones y equipos', detail:'Áreas, estaciones sanitarias, almacenes, comedor, agua y equipos.', source:'M2–M4', modules:{2:'c',3:'c',4:'c',5:'',6:'p',7:'p',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Infraestructura', field:'Croquis de instalaciones', detail:'Distribución física y ubicación de puntos de control.', source:'M2–M4', modules:{2:'c',3:'c',4:'c',5:'',6:'p',7:'p',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Control documental', field:'Código del documento', detail:'Clave de procedimiento, programa, plan, análisis o registro.', source:'M2–M7', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Control documental', field:'Versión y fecha de emisión', detail:'Control uniforme de vigencia documental.', source:'M2–M7', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}}
];

let activeMasterCategory='Todas';
let masterValues=JSON.parse(localStorage.getItem('redGreenhouseMasterData')||'{}');
const requiredMasterFields=new Set(masterData.map(x=>x.field));
function masterKey(field){return field.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')}
function masterCompletion(){const total=requiredMasterFields.size;const filled=masterData.filter(x=>String(masterValues[masterKey(x.field)]||'').trim()).length;return {filled,total,percent:total?Math.round(filled/total*100):0}}
function syncMasterTask(){
  let task=tasks.find(t=>t.linkedTo==='masterData'||/completar datos maestros|capturar datos maestros/i.test(t.title));
  if(!task){task={id:1,title:'Capturar Datos Maestros',detail:'Completar el catálogo único que alimentará los documentos SRRC.',owner:'Dirección',priority:'critical',status:'pending',due:'30 jul',linkedTo:'masterData'};tasks.unshift(task)}
  task.title='Capturar Datos Maestros';task.detail='Completar el catálogo único que alimentará los documentos SRRC.';task.linkedTo='masterData';
  const c=masterCompletion();task.status=c.percent===100?'done':c.percent>0?'doing':'pending';saveTasks();return c;
}
function saveMasterData(){
  document.querySelectorAll('[data-master-input]').forEach(input=>{masterValues[input.dataset.masterInput]=input.value.trim()});
  localStorage.setItem('redGreenhouseMasterData',JSON.stringify(masterValues));
  const c=syncMasterTask();renderAll();
  const msg=document.getElementById('masterSaveMessage');if(msg){msg.textContent=`Guardado · ${c.filled} de ${c.total}`;setTimeout(()=>{msg.textContent=''},2500)}
}

function renderMasterData(){
  const categories=['Todas',...new Set(masterData.map(x=>x.category))];
  const filters=document.getElementById('masterFilters');
  if(!filters) return;
  filters.innerHTML=categories.map(c=>`<button class="master-filter ${c===activeMasterCategory?'active':''}" data-master-category="${c}">${c}</button>`).join('');
  filters.querySelectorAll('[data-master-category]').forEach(b=>b.addEventListener('click',()=>{activeMasterCategory=b.dataset.masterCategory;renderMasterData()}));

  const shown=activeMasterCategory==='Todas'?masterData:masterData.filter(x=>x.category===activeMasterCategory);
  const groups=[...new Set(shown.map(x=>x.category))];
  document.getElementById('masterCatalog').innerHTML=groups.map(group=>`
    <section class="master-group">
      <h3>${group}</h3>
      ${shown.filter(x=>x.category===group).map(x=>{const key=masterKey(x.field),value=esc(String(masterValues[key]||'')),long=/domicilio|coordenadas|macro|inventario|croquis|responsables por área|firmas/i.test(x.field);return `
        <div class="master-field">
          <span class="field-complete ${value?'complete':''}">${value?'✓':'○'}</span>
          <div class="master-input-wrap"><strong>${x.field}<span class="required-mark">*</span></strong><p>${x.detail}</p>${long?`<textarea class="master-textarea" data-master-input="${key}">${value}</textarea>`:`<input class="master-input" data-master-input="${key}" value="${value}">`}</div>
          <span class="source-chip">${x.source}</span>
        </div>`}).join('')}
    </section>`).join('');
  document.querySelectorAll('[data-master-input]').forEach(input=>input.addEventListener('input',()=>{const dot=input.closest('.master-field').querySelector('.field-complete');dot.classList.toggle('complete',!!input.value.trim());dot.textContent=input.value.trim()?'✓':'○'}));

  document.getElementById('masterFieldCount').textContent=masterData.length;
  document.getElementById('masterCategoryCount').textContent=new Set(masterData.map(x=>x.category)).size;
  const c=masterCompletion();
  const val=document.getElementById('masterProgressValue'),fill=document.getElementById('masterProgressFill'),dash=document.getElementById('dashboardMasterProgress');
  if(val)val.textContent=`${c.percent}%`;if(fill)fill.style.width=`${c.percent}%`;if(dash)dash.textContent=`${c.percent}%`;

  const modules=Array.from({length:13},(_,i)=>i+2);
  document.getElementById('matrixHead').innerHTML=`<tr><th>Dato maestro</th>${modules.map(m=>`<th>M${m}</th>`).join('')}</tr>`;
  document.getElementById('matrixBody').innerHTML=masterData.map(x=>`
    <tr><td class="matrix-field-name"><strong>${x.field}</strong><small>${x.category}</small></td>${modules.map(m=>{const st=x.modules[m]||'';return `<td><span class="matrix-cell ${st==='c'?'confirmed':st==='p'?'probable':'empty'}">${st==='c'?'✓':st==='p'?'?':'–'}</span></td>`}).join('')}</tr>`).join('');
}
const DEADLINE=new Date('2026-08-11T23:59:59');
const defaultTasks=[
{id:1,title:'Completar Datos Maestros',detail:'Razón social, unidad, ubicación, responsables y cultivo.',owner:'Dirección',priority:'critical',status:'doing',due:'30 jul'},
{id:2,title:'Recibir módulos 8 al 14',detail:'Solicitar y validar la versión documental oficial.',owner:'Christian',priority:'critical',status:'pending',due:'30 jul'},
{id:3,title:'Levantamiento de infraestructura',detail:'Croquis, áreas, equipos y evidencia fotográfica.',owner:'Operaciones',priority:'critical',status:'pending',due:'01 ago'},
{id:4,title:'Definir estructura organizacional',detail:'Responsables y funciones relacionadas con SRRC.',owner:'Dirección',priority:'high',status:'doing',due:'31 jul'},
{id:5,title:'Inventario de infraestructura',detail:'Listado maestro de instalaciones y equipos.',owner:'Mantenimiento',priority:'high',status:'pending',due:'02 ago'},
{id:6,title:'Análisis de peligros de infraestructura',detail:'Adecuar el análisis a las condiciones reales.',owner:'Calidad',priority:'critical',status:'pending',due:'03 ago'},
{id:7,title:'Programa de mantenimiento preventivo',detail:'Frecuencias, responsables y evidencias.',owner:'Mantenimiento',priority:'high',status:'pending',due:'04 ago'},
{id:8,title:'Procedimiento de mantenimiento',detail:'Revisión y adaptación a RED Greenhouse.',owner:'Calidad',priority:'high',status:'pending',due:'04 ago'},
{id:9,title:'Registro de hallazgos',detail:'Definir formato y mecanismo de seguimiento.',owner:'Calidad',priority:'medium',status:'pending',due:'05 ago'},
{id:10,title:'Macro y microlocalización',detail:'Preparar mapas de ubicación de la unidad.',owner:'Administración',priority:'high',status:'pending',due:'02 ago'},
{id:11,title:'Validar documentos del módulo 2',detail:'Revisar datos, firmas y control de versiones.',owner:'Christian',priority:'critical',status:'pending',due:'06 ago'},
{id:12,title:'Preparar impresión del módulo 2',detail:'Integrar documentos aprobados en carpeta física.',owner:'Administración',priority:'medium',status:'pending',due:'07 ago'}];
let tasks=JSON.parse(localStorage.getItem('redGreenhouseTasks')||'null')||defaultTasks;let activeFilter='all';
const statusLabels={pending:'Pendiente',doing:'En proceso',done:'Completada'};const priorityLabels={critical:'Crítica',high:'Alta',medium:'Media'};
function saveTasks(){localStorage.setItem('redGreenhouseTasks',JSON.stringify(tasks))}
function setDate(){document.getElementById('currentDate').textContent=new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'long',year:'numeric'}).format(new Date());document.getElementById('daysRemaining').textContent=Math.max(0,Math.ceil((DEADLINE-new Date())/86400000))}
function progress(){if(!tasks.length)return 0;return Math.round(tasks.reduce((s,t)=>s+(t.status==='done'?1:t.status==='doing'?.5:0),0)/tasks.length*100)}
function esc(v=''){return v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function renderDashboard(){const p=progress(),c=masterCompletion();document.getElementById('progressValue').textContent=`${p}%`;document.getElementById('progressFill').style.width=`${p}%`;const dm=document.getElementById('dashboardMasterProgress');if(dm)dm.textContent=`${c.percent}%`;document.getElementById('dashboardTasks').innerHTML=tasks.slice(0,5).map(t=>`<div class="compact-task"><div><strong>${esc(t.title)}</strong><small>${esc(t.owner)} · ${esc(t.due)}</small></div>${t.linkedTo==='masterData'?'<button class="open-master-button" data-open-master>Capturar</button>':`<span class="badge badge-${t.priority}">${priorityLabels[t.priority]}</span>`}<span class="badge status-badge">${statusLabels[t.status]}</span></div>`).join('');document.querySelectorAll('[data-open-master]').forEach(b=>b.addEventListener('click',()=>showView('datos')))}
function renderTasks(){const f=tasks.filter(t=>activeFilter==='all'||(activeFilter==='critical'?t.priority==='critical':t.status===activeFilter));document.getElementById('taskList').innerHTML=f.length?f.map(t=>`<div class="task-row ${t.linkedTo==='masterData'?'linked-task':''}"><input class="task-check" type="checkbox" ${t.status==='done'?'checked':''} ${t.linkedTo==='masterData'?'disabled title="Se actualiza desde Datos Maestros"':''} data-id="${t.id}"><div class="task-title"><strong>${esc(t.title)}</strong><small>${esc(t.detail||'')}</small></div><div class="task-owner">${esc(t.owner)}</div>${t.linkedTo==='masterData'?'<span class="linked-chip">Vinculada</span>':`<span class="badge badge-${t.priority}">${priorityLabels[t.priority]}</span>`}<div class="task-date">${esc(t.due||'Sin fecha')}</div>${t.linkedTo==='masterData'?'<button class="open-master-button" data-open-master>Capturar</button>':`<button class="delete-task" data-delete="${t.id}">×</button>`}</div>`).join(''):'<div class="placeholder"><p>No hay tareas para este filtro.</p></div>';document.getElementById('totalTasks').textContent=tasks.length;document.getElementById('pendingTasks').textContent=tasks.filter(t=>t.status==='pending').length;document.getElementById('doingTasks').textContent=tasks.filter(t=>t.status==='doing').length;document.getElementById('doneTasks').textContent=tasks.filter(t=>t.status==='done').length;document.querySelectorAll('.task-check:not([disabled])').forEach(i=>i.addEventListener('change',()=>{const t=tasks.find(x=>x.id===Number(i.dataset.id));if(t){t.status=i.checked?'done':'pending';saveTasks();renderAll()}}));document.querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',()=>{tasks=tasks.filter(t=>t.id!==Number(b.dataset.delete));saveTasks();renderAll()}));document.querySelectorAll('[data-open-master]').forEach(b=>b.addEventListener('click',()=>showView('datos')))}
function renderAll(){renderDashboard();renderTasks();renderMasterData()}
let currentView='inicio',viewHistory=[];
function showView(v,track=true){if(track&&v!==currentView)viewHistory.push(currentView);document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));const d=document.getElementById(`view-${v}`);if(d){d.classList.add('active');document.getElementById('breadcrumb').textContent=v==='inicio'?'Inicio':v==='plan'?'Plan Maestro':v==='datos'?'Datos Maestros':v}else{document.getElementById('view-placeholder').classList.add('active');document.getElementById('placeholderTitle').textContent=v.charAt(0).toUpperCase()+v.slice(1);document.getElementById('breadcrumb').textContent=v.charAt(0).toUpperCase()+v.slice(1)}currentView=v;document.getElementById('backButton').disabled=viewHistory.length===0;document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===v));document.getElementById('sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'})}
document.getElementById('backButton').addEventListener('click',()=>{if(viewHistory.length)showView(viewHistory.pop(),false)});document.getElementById('homeButton').addEventListener('click',()=>showView('inicio'));document.getElementById('saveMasterDataButton').addEventListener('click',saveMasterData);
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));document.getElementById('menuButton').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderTasks()}));
const modal=document.getElementById('modalBackdrop');document.getElementById('addTaskButton').addEventListener('click',()=>modal.classList.add('open'));document.getElementById('closeModal').addEventListener('click',()=>modal.classList.remove('open'));modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});document.getElementById('taskForm').addEventListener('submit',e=>{e.preventDefault();tasks.unshift({id:Date.now(),title:document.getElementById('taskTitle').value.trim(),detail:'Tarea agregada desde el portal.',owner:document.getElementById('taskOwner').value.trim(),priority:document.getElementById('taskPriority').value,status:document.getElementById('taskStatus').value,due:'Sin fecha'});saveTasks();e.target.reset();modal.classList.remove('open');renderAll()});syncMasterTask();setDate();renderAll();
