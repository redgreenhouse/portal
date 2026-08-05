

const masterData = [
  {category:'Identidad', field:'Nombre de la unidad de producción', detail:'Nombre oficial usado en encabezados, portadas y registros.', source:'M2–M14', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Identidad', field:'Logo corporativo', detail:'Imagen oficial usada en el portal y en las cabeceras documentales.', inputType:'image', source:'M2–M14', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Identidad', field:'Folio SENASICA', detail:'Folio puntual que se mostrará en las hojas oficiales.', source:'M2–M14', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Identidad', field:'Razón social / propietario', detail:'Identidad legal o responsable de la unidad productiva.', source:'Por confirmar', modules:{2:'p',3:'p',4:'p',5:'p',6:'p',7:'p',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Ubicación', field:'Domicilio de la unidad', detail:'Dirección utilizada en las cabeceras de los documentos.', source:'M2–M14', modules:{2:'c',3:'p',4:'p',5:'p',6:'p',7:'p',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Producción', field:'Cultivo y variedad', detail:'Producto agrícola al que aplican procedimientos, riesgos y registros.', source:'M2–M14', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Personas', field:'Alta Dirección', detail:'Nombre y cargo de quien autoriza procedimientos y recursos.', source:'M2–M14', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Personas', field:'Responsable de inocuidad', detail:'Persona que implementa, supervisa y revisa el sistema SRRC.', source:'M2–M14', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Personas', field:'Responsables por área', detail:'Producción, mantenimiento, higiene, capacitación, fauna y auditoría.', source:'M2–M14', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Personas', field:'Firmas de elaboración, revisión y autorización', detail:'Nombres y cargos estables para los pies de aprobación.', source:'M2–M14', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Control documental', field:'Versión', detail:'Versión vigente del documento.', source:'M2–M14', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Control documental', field:'Fecha de emisión', detail:'Fecha de emisión del documento oficial.', inputType:'date', source:'M2–M14', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}},
  {category:'Control documental', field:'Vigencia', detail:'Fecha límite de vigencia del documento oficial.', inputType:'date', source:'M2–M14', modules:{2:'c',3:'c',4:'c',5:'c',6:'c',7:'c',8:'p',9:'p',10:'p',11:'p',12:'p',13:'p',14:'p'}}
];


const structuredDefinitions={
  'Responsables por área':{
    columns:[{key:'nombre',label:'Nombre del responsable'},{key:'cargo',label:'Cargo / función'}],
    rows:['Producción','Mantenimiento','Higiene','Capacitación','Fauna','Auditoría'].map(area=>({id:masterKey(area),label:area})),
    mapping:'Catálogo transversal; se relacionará con perfiles, programas y procedimientos de M2–M7.'
  },
  'Firmas de elaboración, revisión y autorización':{
    columns:[{key:'nombre',label:'Nombre completo'},{key:'cargo',label:'Cargo'}],
    rows:[
      {id:'elaboro',label:'Elaboró',defaultCargo:'Auxiliar en SRRC',mapping:'M2 POE MTTO: B67–C68 · M3 POES: B149–C150 · M4 POE: B72–D73 · M5 POE: B64–D65 · M6 POE: B102–D103 · M7 POE: B85–D86'},
      {id:'reviso',label:'Revisó',defaultCargo:'Responsable de inocuidad',mapping:'M2: E67–F68 · M3: E149–F150 · M4: F72–G73 · M5: F64–G65 · M6: F102–G103 · M7: F85–G86'},
      {id:'autorizo',label:'Autorizó',defaultCargo:'Director general',mapping:'M2: H67–I68 · M3: H149–I150 · M4: I72–J73 · M5: I64–J65 · M6: I102–J103 · M7: I85–J86'}
    ],
    mapping:'Ejemplo real confirmado en los pies de firma de los procedimientos recibidos.'
  }
};
let structuredValues=JSON.parse(localStorage.getItem('redGreenhouseStructuredData')||'{}');
function ensureStructuredDefaults(){
  Object.entries(structuredDefinitions).forEach(([field,def])=>{
    const k=masterKey(field);structuredValues[k]=structuredValues[k]||{};
    def.rows.forEach(row=>{structuredValues[k][row.id]=structuredValues[k][row.id]||{};if(row.defaultCargo&&!structuredValues[k][row.id].cargo)structuredValues[k][row.id].cargo=row.defaultCargo});
  });
  const owner=masterValues[masterKey('Alta Dirección')]||masterValues[masterKey('Razón social / propietario')]||'';
  const safety=masterValues[masterKey('Responsable de inocuidad')]||'';
  const sig=structuredValues[masterKey('Firmas de elaboración, revisión y autorización')];
  if(owner&&!sig.autorizo.nombre)sig.autorizo.nombre=owner;
  if(safety&&!sig.reviso.nombre)sig.reviso.nombre=safety;
}
function structuredFieldStatus(field){
  const def=structuredDefinitions[field],vals=structuredValues[masterKey(field)]||{};let total=0,filled=0;
  def.rows.forEach(r=>def.columns.forEach(c=>{total++;if(String(vals[r.id]?.[c.key]||'').trim())filled++}));
  return {total,filled,complete:total>0&&filled===total};
}
function renderStructuredCapture(item){
  const def=structuredDefinitions[item.field],key=masterKey(item.field),vals=structuredValues[key]||{};
  const old=String(masterValues[key]||'').trim();
  return `<div class="structured-capture"><table><thead><tr><th>${item.field==='Responsables por área'?'Área':'Función'}</th>${def.columns.map(c=>`<th>${c.label}</th>`).join('')}</tr></thead><tbody>${def.rows.map(r=>`<tr><td class="fixed-cell">${r.label}</td>${def.columns.map(c=>`<td><input class="structured-input" data-structured-field="${key}" data-structured-row="${r.id}" data-structured-col="${c.key}" value="${esc(String(vals[r.id]?.[c.key]||''))}" placeholder="Capturar..."></td>`).join('')}</tr>`).join('')}</tbody></table></div>${old?`<div class="previous-text-note">Texto anterior conservado: ${esc(old)}</div>`:''}`;
}

let activeMasterCategory='Todas';
let masterValues=JSON.parse(localStorage.getItem('redGreenhouseMasterData')||'{}');
const requiredMasterFields=new Set(masterData.map(x=>x.field));
function masterKey(field){return field.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')}
function masterCompletion(){let total=0,filled=0;masterData.forEach(x=>{if(structuredDefinitions[x.field]){const st=structuredFieldStatus(x.field);total+=st.total;filled+=st.filled}else{total++;if(String(masterValues[masterKey(x.field)]||'').trim())filled++}});return {filled,total,percent:total?Math.round(filled/total*100):0}}
function syncMasterTask(){
  let task=tasks.find(t=>t.linkedTo==='masterData'||/completar datos maestros|capturar datos maestros/i.test(t.title));
  if(!task){task={id:1,title:'Capturar Datos Maestros',detail:'Completar el catálogo único que alimentará los documentos SRRC.',owner:'Dirección',priority:'critical',status:'pending',due:'30 jul',linkedTo:'masterData'};tasks.unshift(task)}
  task.title='Capturar Datos Maestros';task.detail='Completar el catálogo único que alimentará los documentos SRRC.';task.linkedTo='masterData';task.priority='critical';
  const c=masterCompletion();task.status=c.percent===100?'done':c.percent>0?'doing':'pending';saveTasks();return c;
}
function saveMasterData(){
  document.querySelectorAll('[data-master-input]').forEach(input=>{masterValues[input.dataset.masterInput]=input.value.trim()});
  document.querySelectorAll('[data-structured-field]').forEach(input=>{structuredValues[input.dataset.structuredField]=structuredValues[input.dataset.structuredField]||{};structuredValues[input.dataset.structuredField][input.dataset.structuredRow]=structuredValues[input.dataset.structuredField][input.dataset.structuredRow]||{};structuredValues[input.dataset.structuredField][input.dataset.structuredRow][input.dataset.structuredCol]=input.value.trim()});
  ensureStructuredDefaults();
  localStorage.setItem('redGreenhouseMasterData',JSON.stringify(masterValues));
  localStorage.setItem('redGreenhouseStructuredData',JSON.stringify(structuredValues));
  const c=syncMasterTask();renderAll();
  const msg=document.getElementById('masterSaveMessage');if(msg){msg.textContent=`Guardado · ${c.filled} de ${c.total}`;setTimeout(()=>{msg.textContent=''},2500)}
}

function masterDateInputValue(value){
  const raw=String(value||'').trim();
  if(!raw)return '';
  if(/^\d{4}-\d{2}-\d{2}$/.test(raw))return raw;
  const dmY=raw.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
  if(dmY){const [,d,m,y]=dmY;return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;}
  const parsed=new Date(raw);
  if(!Number.isNaN(parsed.getTime())){
    const y=parsed.getFullYear(),m=String(parsed.getMonth()+1).padStart(2,'0'),d=String(parsed.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  }
  return '';
}

function masterImageValue(value){
  return value&&typeof value==='object'?value:null;
}
function masterImageHtml(key,value){
  const image=masterImageValue(value),src=image?.imageUrl||image?.thumbnailUrl||'',url=image?.url||src||'',name=image?.name||'';
  return `<div class="master-image-control" data-master-image-control="${esc(key)}"><div class="master-image-details"><strong>${name?esc(name):'Sin imagen vinculada'}</strong>${url?`<a href="${esc(url)}" target="_blank" rel="noopener">Ver imagen</a>`:''}<input class="drive-file-input" type="file" accept="image/*" data-master-image-input="${esc(key)}" hidden><div class="master-image-actions"><button type="button" class="drive-upload-button" data-master-image-upload="${esc(key)}">${image?'Reemplazar':'Subir al Drive'}</button>${image?`<button type="button" class="ghost-button master-image-remove" data-master-image-remove="${esc(key)}">Eliminar vínculo</button>`:''}</div><small data-master-image-status="${esc(key)}">${image?'Imagen oficial vinculada a Google Drive.':'La imagen se guardará en la carpeta Images.'}</small></div></div>`;
}
function masterInputHtml(item,key,value,long){
  if(item.inputType==='image')return masterImageHtml(key,value);
  if(item.inputType==='date')return `<input class="master-input" type="date" data-master-input="${key}" value="${esc(masterDateInputValue(value))}">`;
  if(long)return `<textarea class="master-textarea" data-master-input="${key}">${esc(String(value||''))}</textarea>`;
  return `<input class="master-input" type="${item.inputType||'text'}" data-master-input="${key}" value="${esc(String(value||''))}">`;
}
async function uploadMasterImage(input){
  const file=input.files?.[0];if(!file)return;
  const key=input.dataset.masterImageInput,url=galleryEndpoint(),status=document.querySelector(`[data-master-image-status="${CSS.escape(key)}"]`),button=document.querySelector(`[data-master-image-upload="${CSS.escape(key)}"]`);
  if(!url){alert('Configura la URL de Apps Script en Administración.');input.value='';return;}
  if(status)status.textContent='Subiendo a Google Drive…';if(button){button.disabled=true;button.textContent='Subiendo…';}
  try{
    const dataUrl=await fileToDataUrl(file);
    const payload={action:'uploadImage',fileName:file.name,mimeType:file.type||'image/png',base64:dataUrl.split(',')[1],module:'MASTER',field:key};
    const response=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)}),result=await response.json();
    if(!result.ok)throw new Error(result.error||'No se pudo subir el logo.');
    masterValues[key]={...result,name:result.name||file.name,dataUrl};localStorage.setItem('redGreenhouseMasterData',JSON.stringify(masterValues));renderMasterData();
  }catch(error){if(status)status.textContent='Error: '+error.message;alert(error.message);}
  finally{input.value='';if(button){button.disabled=false;button.textContent='Subir al Drive';}}
}
function bindMasterImageControls(){
  document.querySelectorAll('[data-master-image-upload]').forEach(button=>button.addEventListener('click',()=>document.querySelector(`[data-master-image-input="${CSS.escape(button.dataset.masterImageUpload)}"]`)?.click()));
  document.querySelectorAll('[data-master-image-input]').forEach(input=>input.addEventListener('change',()=>uploadMasterImage(input)));
  document.querySelectorAll('[data-master-image-remove]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.masterImageRemove;if(!confirm('¿Quitar esta imagen como logo oficial? El archivo permanecerá en Google Drive.'))return;delete masterValues[key];localStorage.setItem('redGreenhouseMasterData',JSON.stringify(masterValues));renderMasterData();}));
}

function renderMasterData(){
  const catalog=document.getElementById('masterCatalog');
  if(!catalog)return;
  const groups=[...new Set(masterData.map(x=>x.category))];
  catalog.innerHTML=groups.map(group=>`
    <section class="master-group">
      <h3>${group}</h3>
      ${masterData.filter(x=>x.category===group).map(x=>{const key=masterKey(x.field),long=/domicilio|coordenadas|macro|inventario|croquis|responsables por área|firmas/i.test(x.field);return `
        <div class="master-field">
          <div class="master-input-wrap"><strong>${x.field}<span class="required-mark">*</span></strong><p>${x.detail}</p>${structuredDefinitions[x.field]?renderStructuredCapture(x):masterInputHtml(x,key,masterValues[key]||'',long)}</div>
        </div>`}).join('')}
    </section>`).join('');
  document.querySelectorAll('[data-master-input]').forEach(input=>input.addEventListener('input',()=>{input.closest('.master-field').classList.toggle('has-value',!!input.value.trim())}));
  document.querySelectorAll('[data-structured-field]').forEach(input=>input.addEventListener('input',()=>input.closest('.master-field').classList.add('has-value')));
  bindMasterImageControls();

  const fieldCount=document.getElementById('masterFieldCount'),categoryCount=document.getElementById('masterCategoryCount');
  if(fieldCount)fieldCount.textContent=masterData.length;
  if(categoryCount)categoryCount.textContent=new Set(masterData.map(x=>x.category)).size;
  const c=masterCompletion();
  const val=document.getElementById('masterProgressValue'),fill=document.getElementById('masterProgressFill');
  if(val)val.textContent=`${c.percent}%`;
  if(fill)fill.style.width=`${c.percent}%`;
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
function setDate(){const date=document.getElementById('currentDate');if(date)date.textContent=new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'long',year:'numeric'}).format(new Date());const days=document.getElementById('daysRemaining');if(days)days.textContent=Math.max(0,Math.ceil((DEADLINE-new Date())/86400000))}
function progress(){if(!tasks.length)return 0;return Math.round(tasks.reduce((s,t)=>s+(t.status==='done'?1:t.status==='doing'?.5:0),0)/tasks.length*100)}
function esc(v=''){return v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function taskActionView(t){return t.linkedTo==='masterData'?'datos':null}
const SRRC_MODULE_IDS=Array.from({length:14},(_,i)=>i+2);
function integratedModule(n){
  if(n===2)return {module:2,title:moduleNames[2],sheets:RED_DATA.module2.map(s=>({name:s.code}))};
  return window.SRRC_MODULES?.find(m=>m.module===n)||null;
}
function moduleReleaseStats(n){
  const module=integratedModule(n),sheets=module?.sheets||[];
  const released=sheets.filter(s=>isDirectorReleased(`M${n}|${s.name}`)).length;
  return {module:n,title:moduleNames[n]||module?.title||'Pendiente de integrar',total:sheets.length,released,percent:sheets.length?Math.round(released/sheets.length*100):0,integrated:sheets.length>0};
}
function releaseDashboardStats(){
  const modules=SRRC_MODULE_IDS.map(moduleReleaseStats);
  const total=modules.reduce((sum,m)=>sum+m.total,0),released=modules.reduce((sum,m)=>sum+m.released,0);
  return {modules,total,released,pending:Math.max(0,total-released),percent:total?Math.round(released/total*100):0};
}
function renderDashboard(){
  const stats=releaseDashboardStats();
  const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
  set('dashboardModuleTotal',SRRC_MODULE_IDS.length);
  set('dashboardSheetTotal',stats.total);
  set('dashboardReleasedTotal',stats.released);
  set('dashboardPendingTotal',stats.pending);
  set('releasePercent',`${stats.percent}%`);
  set('releaseSummary',`${stats.released} de ${stats.total} hojas`);
  set('certificationProgressText',`${stats.percent}%`);
  set('certificationSheetCount',stats.total);
  const donut=document.getElementById('releaseDonut');if(donut)donut.style.setProperty('--progress',`${stats.percent*3.6}deg`);
  const certFill=document.getElementById('certificationProgressFill');if(certFill)certFill.style.width=`${stats.percent}%`;

  const integrated=stats.modules.filter(m=>m.integrated);
  const releasedModules=integrated.filter(m=>m.percent===100).length;
  set('modulesReleasedCount',releasedModules);
  set('modulesProgressCount',integrated.length-releasedModules);
  set('modulesLockedCount',stats.modules.length-integrated.length);

  const bars=document.getElementById('dashboardModuleBars');
  if(bars)bars.innerHTML=integrated.map(m=>`<button class="dashboard-module-row" data-dashboard-module="${m.module}"><span>M${m.module}</span><div><div class="dashboard-bar"><i style="width:${m.percent}%"></i></div><small>${m.released} de ${m.total} hojas</small></div><strong>${m.percent}%</strong></button>`).join('');
  document.querySelectorAll('[data-dashboard-module]').forEach(row=>row.addEventListener('click',()=>{showView('modulos');setTimeout(()=>openModule(Number(row.dataset.dashboardModule)),0)}));
}
function renderTasks(){
  const f=tasks.filter(t=>activeFilter==='all'||(activeFilter==='critical'?t.priority==='critical':t.status===activeFilter));
  document.getElementById('taskList').innerHTML=f.length?f.map(t=>{const target=taskActionView(t);return `<div class="task-row ${target?'linked-task':''}"><input class="task-check" type="checkbox" ${t.status==='done'?'checked':''} ${target?'disabled title="Se actualiza desde Datos Maestros"':''} data-id="${t.id}"><div class="task-title">${target?`<button class="task-title-link" data-task-view="${target}">${esc(t.title)}</button>`:`<strong>${esc(t.title)}</strong>`}<small>${esc(t.detail||'')}</small></div><div class="task-owner">${esc(t.owner)}</div><span class="badge badge-${t.priority}">${priorityLabels[t.priority]}</span><span class="badge status-badge">${statusLabels[t.status]}</span><div class="task-date">${esc(t.due||'Sin fecha')}</div>${target?`<button class="task-open-link" data-task-view="${target}">Abrir</button>`:`<button class="delete-task" data-delete="${t.id}">×</button>`}</div>`}).join(''):'<div class="placeholder"><p>No hay tareas para este filtro.</p></div>';
  document.getElementById('totalTasks').textContent=tasks.length;document.getElementById('pendingTasks').textContent=tasks.filter(t=>t.status==='pending').length;document.getElementById('doingTasks').textContent=tasks.filter(t=>t.status==='doing').length;document.getElementById('doneTasks').textContent=tasks.filter(t=>t.status==='done').length;
  document.querySelectorAll('.task-check:not([disabled])').forEach(i=>i.addEventListener('change',()=>{const t=tasks.find(x=>x.id===Number(i.dataset.id));if(t){t.status=i.checked?'done':'pending';saveTasks();renderAll()}}));
  document.querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',()=>{tasks=tasks.filter(t=>t.id!==Number(b.dataset.delete));saveTasks();renderAll()}));
  document.querySelectorAll('[data-task-view]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();showView(b.dataset.taskView)}));
}

const moduleNames={2:'Infraestructura',3:'Higiene',4:'Control de fauna',5:'Capacitación',6:'Programa de auditorías',7:'Validación de procedimientos',8:'Trazabilidad',9:'Historial de la unidad productiva',10:'Uso y manejo del agua',11:'Pendiente de integrar',12:'Pendiente de integrar',13:'Pendiente de integrar',14:'Pendiente de integrar',15:'Pendiente de integrar'};
const module2CaptureSpecs={
'PORTADA':[
 ['Nombre de la unidad de producción','text','Identidad que aparecerá en la carpeta impresa'],['Domicilio de la unidad','textarea','Dirección completa del sitio'],['Folio SENASICA','text','Identificador oficial'],['Fecha de emisión','date','Fecha de publicación'],['Vigencia','date','Fecha límite de vigencia'],['Versión','text','Clave de control documental']
],
'POE MTTO INFRAESTR':[
 ['Objetivo','textarea','Texto base recuperado de la hoja POE MTTO INFRAESTR del Excel','* Evitar demoras en los procesos de producción por fallas en la infraestructura productiva\n* Reducir los riesgos de contaminación derivado de un desgaste o falla en la infraestructura productiva\n* Actuar de manera eficiente si se presenta una eventualidad por fallas en la infraestructura productiva'],
 ['Alcance','textarea','Texto base recuperado de la hoja POE MTTO INFRAESTR del Excel','El Plan de Mantenimiento cubre las instalaciones (áreas e instalaciones) y equipos mecánicos (equipos de aspersión, transporte, etc.).'],
 ['Frecuencia','textarea','Periodicidad indicada en el procedimiento','El Plan de Mantenimiento Preventivo a la Infraestructura se revisa y actualiza una vez al año.'],
 ['Definiciones','textarea','Conceptos incluidos en el procedimiento','* Infraestructura Productiva. Son todas las áreas e instalaciones que se habilitaron para el funcionamiento de la Unidad de Producción.\n* Plan de Mantenimiento Preventivo. Es un documento elaborado por el responsable de inocuidad y autorizado por la Dirección de la UP, para realizar los mantenimientos preventivos en la Infraestructura Productiva'],
 ['Responsabilidades','textarea','Funciones definidas para cada participante','* Alta Dirección. Abastece los elementos necesarios para la implementación eficiente del presente procedimiento.\n* Responsable de Inocuidad. Implementa el presente documento en las áreas equipos e instalaciones correspondientes.\n* Personal Operativo. Auxilia al responsable de inocuidad en la implementación de los mantenimientos que se realizan en la U.P.'],
 ['Materiales','textarea','Materiales indicados en el procedimiento','* Herramientas múltiples en función a las necesidades de mantenimiento'],
 ['Reglas de operación','textarea','Regla general indicada en el procedimiento','* Todas las áreas, instalaciones y equipos que forman parte de la Unidad de Producción se verifican y se programan los mantenimientos preventivos a fin de evitar problemas que ocasionen demoras operacionales y/o problemas de inocuidad agroalimentaria.'],
 ['Descripción del procedimiento','textarea','Secuencia recuperada del Excel; revisar y personalizar cuando corresponda','* Durante la preparación de la Unidad de Producción previo al inicio del ciclo productivo, el Responsable de Inocuidad revisa y actualiza el Plan de Mantenimiento Preventivo a la Infraestructura, el cual considera lo siguiente:\n\n1. Área, instalación y/o equipo.\n2. Frecuencia.\n3. Día realizado.\n4. Estado: Cumple (Sin Fallas) o Falla (Deficiencias en el funcionamiento).\n5. Descripción de las observaciones y/o Acciones Correctivas al reverso del formato.\n\n* Para las instalaciones y/o equipos (sanitarios, tuberías, válvulas, sistema, equipos de aspersión) cuyos mantenimientos requieren instrucciones detallas, hacen referencia al instructivo del fabricante del equipo, por lo que se solicitan y controlan dichos documentos para su consulta durante el mantenimiento.\n\n* Entre más detalladas sean las instrucciones y que utilizan las recomendaciones del fabricante del equipo, detallan al operador los puntos de seguridad.'],
 ['Referencias','textarea','Referencia incluida en el Excel','* SENASICA (2021), Anexo Técnico 1. Requisitos Generales para la Certificación y Reconocimiento de Sistemas de Reducción de Riesgos de Contaminación (SRRC), Buen Uso y Manejo de Plaguicidas (BUMP) o Buenas Prácticas Agrícolas en la Actividad de Cosecha (BPCo) Durante la Producción Primaria de Vegetales.'],
 ['Formatos / Anexos','textarea','Formato relacionado indicado en el Excel','* Plan de Mantenimiento Preventivo a la Infraestructura DOC-2.3'],
 ['Elaboró / Revisó / Autorizó','signature','Nombres, cargos y firmas de aprobación']
],
'ANÁLISIS DESCRIPTIVO':[
 ['Análisis de peligros por 11 áreas','riskTable','Estructura original del Excel; únicamente se seleccionan probabilidad y severidad']
],
'PLAN DE ACCIÓN':[
 ['Acciones de control por 11 áreas','actionTable','Estructura original del Excel con tres espacios de acción para cada área']
],
'MAPA 2.1':[
 ['Mapa de macrolocalización','image','Imagen regional con vías principales de acceso'],['Nombre de la unidad','text','Identificación visible en el mapa'],['Municipio y estado','text','Ubicación territorial'],['Coordenadas','coordinates','Latitud y longitud'],['Norte y referencias','textarea','Orientación, escala o puntos de referencia']
],
'MAPA 2.1.1':[
 ['Mapa de microlocalización','image','Imagen del entorno inmediato de la unidad'],['Límites y colindancias','textarea','Predios vecinos y límites del sitio'],['Accesos','textarea','Entradas y caminos de acceso'],['Fuentes externas de riesgo','textarea','Descargas, caminos, animales, industrias u otros riesgos'],['Coordenadas','coordinates','Punto o polígono georreferenciado']
],
'MAPA 2.1.2':[
 ['Mapa de polígonos','image','Imagen con delimitación de superficies productivas'],['Nombre del polígono','table','Clave o nombre de cada área'],['Superficie','number','Hectáreas o metros cuadrados'],['Coordenadas de vértices','table','Latitud y longitud de cada vértice'],['Uso del área','table','Invernadero, almacén, servicios u otro uso']
],
'CROQUIS 2.2':[
 ['Croquis de instalaciones','image','Plano o croquis legible del sitio'],['Áreas identificadas','table','Invernaderos, sanitarios, lavado de manos, comedor, almacenes y accesos'],['Flujos y rutas','textarea','Circulación de personal, producto, residuos y vehículos'],['Puntos de control','table','Ubicación de instalaciones relevantes para inocuidad'],['Norte / escala / simbología','textarea','Referencias para interpretar el croquis']
],
'DOC-2.3 FRENTE':[
 ['Programa anual de mantenimiento','table','Instalación o equipo, frecuencia, mes, día y estado'],['Cerco perimetral','schedule','Revisión quincenal'],['Comedor y perchero','schedule','Revisión quincenal'],['Sanitarios','schedule','Revisión quincenal'],['Estación de lavado de manos','schedule','Revisión quincenal'],['Fosa séptica','schedule','Revisión mensual'],['Almacén general','schedule','Revisión mensual'],['Preparación de mezclas','schedule','Revisión mensual'],['Caldos sobrantes / CREVA','schedule','Revisión mensual'],['Zona buffer','schedule','Revisión mensual'],['Fumigadora','schedule','Revisión semestral'],['Transporte','schedule','Revisión semestral'],['Verificó y firma','signature','Responsable de revisar el programa']
],
'DOC-2.3 REVERSO':[
 ['Fecha y hora del hallazgo','datetime','Momento en que se detectó la falla'],['Área, instalación o equipo','text','Elemento afectado'],['Descripción del hallazgo','textarea','Condición observada'],['Acción realizada','textarea','Corrección o mantenimiento ejecutado'],['Responsable','person','Persona que atendió'],['Fecha de cierre','date','Cierre del hallazgo'],['Realizó','signature','Nombre y firma'],['Verificó','signature','Nombre y firma de validación']
],
'DOC-2.4':[
 ['Organigrama','image','Diagrama de estructura organizacional'],['Puestos y nombres','table','Puesto, ocupante y línea de reporte'],['Responsable de inocuidad','person','Identificación clara dentro de la estructura'],['Líneas de autoridad','table','Relaciones jerárquicas y suplencias'],['Emisión, vigencia y versión','document-control','Control documental del formato']
],
'DOC-2.5':[
 ['Nombre del puesto','text','Director general, auxiliar de campo, responsable de inocuidad u otro'],['Nombre del ocupante','person','Persona asignada'],['Reporta a','person','Jefatura inmediata'],['Objetivo del puesto','textarea','Propósito principal'],['Funciones específicas','table','Lista editable de responsabilidades'],['Autoridad y decisiones','textarea','Facultades del puesto'],['Competencias / requisitos','textarea','Experiencia, formación y conocimientos'],['Firma de aceptación','signature','Firma de la persona que ocupa el puesto'],['Emisión, vigencia y versión','document-control','Control documental del formato']
]
};
let module2Values=JSON.parse(localStorage.getItem('redGreenhouseModule2')||'{}');

function migrateModule2PoeValues(){
  const version=localStorage.getItem('redGreenhouseModule2Schema');
  if(version==='poe-excel-v1')return;
  const oldValues={...module2Values};
  const mapping={0:0,1:1,2:3,3:4,4:7,5:2,8:10};
  Object.entries(mapping).forEach(([from,to])=>{
    const oldKey=`RG-02-002-${from}`,newKey=`RG-02-002-${to}`;
    if(Object.prototype.hasOwnProperty.call(oldValues,oldKey)&&!Object.prototype.hasOwnProperty.call(module2Values,newKey)){
      module2Values[newKey]=oldValues[oldKey];
    }
  });
  for(let i=0;i<=8;i++)delete module2Values[`RG-02-002-${i}`];
  Object.entries(mapping).forEach(([from,to])=>{
    const oldKey=`RG-02-002-${from}`,newKey=`RG-02-002-${to}`;
    if(Object.prototype.hasOwnProperty.call(oldValues,oldKey))module2Values[newKey]=oldValues[oldKey];
  });
  localStorage.setItem('redGreenhouseModule2Schema','poe-excel-v1');
  localStorage.setItem('redGreenhouseModule2',JSON.stringify(module2Values));
}
function module2EffectiveValue(doc,field,i){
  const key=`${doc.id}-${i}`;
  if(Object.prototype.hasOwnProperty.call(module2Values,key))return String(module2Values[key]||'');
  return String(field[3]||'');
}
migrateModule2PoeValues();
const typeLabels={text:'Texto corto',textarea:'Texto amplio',date:'Fecha',datetime:'Fecha y hora',number:'Número',list:'Lista',table:'Tabla',signature:'Firma',image:'Imagen',evidence:'Evidencia',coordinates:'Coordenadas',person:'Persona',schedule:'Registro periódico','document-control':'Control documental'};

// Campos del Módulo 2 que ya existen en Datos Maestros.
// El valor se consulta directamente desde el catálogo para evitar doble captura.
const module2MasterLinks={
  'PORTADA|Nombre de la unidad de producción':'Nombre de la unidad de producción',
  'PORTADA|Domicilio de la unidad':'Domicilio de la unidad',
  'PORTADA|Folio SENASICA':'Folio SENASICA',
  'POE MTTO INFRAESTR|Elaboró / Revisó / Autorizó':'Firmas de elaboración, revisión y autorización',
  'MAPA 2.1|Nombre de la unidad':'Nombre de la unidad de producción',
  'DOC-2.4|Responsable de inocuidad':'Responsable de inocuidad'
};
function module2MasterField(doc,field){return module2MasterLinks[`${doc.code}|${field[0]}`]||''}
function module2MasterValue(field){
  if(structuredDefinitions[field]){const st=structuredFieldStatus(field);return st.filled?`${st.filled} de ${st.total} celdas capturadas`:''}
  return String(masterValues[masterKey(field)]||'').trim();
}
function clearDuplicateModule2Values(){
  let changed=false;
  RED_DATA.module2.forEach(doc=>(module2CaptureSpecs[doc.code]||[]).forEach((field,i)=>{
    if(module2MasterField(doc,field)&&Object.prototype.hasOwnProperty.call(module2Values,`${doc.id}-${i}`)){delete module2Values[`${doc.id}-${i}`];changed=true}
  }));
  if(changed)localStorage.setItem('redGreenhouseModule2',JSON.stringify(module2Values));
}
function fieldHasValue(item){if(structuredDefinitions[item.field])return structuredFieldStatus(item.field).complete;return !!String(masterValues[masterKey(item.field)]||'').trim()}
function fieldPreview(item){if(structuredDefinitions[item.field]){const st=structuredFieldStatus(item.field);return `${st.filled} de ${st.total} celdas capturadas`}return String(masterValues[masterKey(item.field)]||'').trim()}
function moduleStatus(m){const fields=masterData.filter(x=>x.modules[m]==='c');const filled=fields.filter(fieldHasValue).length;return {fields,filled,total:fields.length,percent:fields.length?Math.round(filled/fields.length*100):0}}

const module2RiskAreas=[
 {n:1,area:'BARRERAS DE PROTECCIÓN',description:'Originalmente la unidad de producción cuenta con un cerco perimetral de piedra, la cual se reforzó con malla borreguera anclada con postes de concreto.',justification:'Sin el mantenimiento y control de accesos (puertas cerradas) del cercado perimetral, existe la posibilidad de ingreso de animales, principalmente perros, animales de pastoreo, que pueden defecar dentro de la UP y en consecuencia comprometer la inocuidad de los productos cosechados.',hazards:[['FÍSICO','Ninguno.','',''],['QUÍMICO','Ninguno.','',''],['BIOLÓGICO','E. coli, salmonella spp.','Bajo','Bajo']]},
 {n:2,area:'ESTACIONES SANITARIAS',description:'La UP cuenta con 1 sanitario general. Las paredes, piso y escusado son de fácil limpieza y desinfección. Están provistas de cesto de basura con bolsa plástica y dispensador de papel higiénico. Están fuera del área activa de producción. El piso tiene un desnivel que conduce al drenaje para evitar escurrimientos durante la limpieza de la instalación. Se colocaron señalamientos de identificación entre otros gráficos alusivos al área.',justification:'Las deficiencias en el equipamiento y mantenimiento de las instalaciones sanitarias representan una fuente de contaminación; de ahí la importancia de establecer programas y protocolos de limpieza y mantenimiento para reducir los riesgos microbiológicos.',hazards:[['FÍSICO','Ninguno.','',''],['QUÍMICO','Ninguno.','',''],['BIOLÓGICO','E. coli, salmonella spp.','Bajo','Bajo']]},
 {n:3,area:'FOSA SÉPTICA',description:'Derivado a los terrenos sinuosos y baja afluencia de personal en la unidad de producción se optó por la habilitación de una fosa séptica básica y tradicional con paredes de concreto y filtro de agua residual mediante la colocación de capas de arena, grava, tepetzil.',justification:'La falta de mantenimiento de la instalación puede generar escurrimientos y por ende una posible contaminación de las áreas aledañas incluyendo las unidades de producción y/o área de productos cosechados.',hazards:[['FÍSICO','Ninguno.','',''],['QUÍMICO','Ninguno.','',''],['BIOLÓGICO','E. coli, salmonella spp.','Bajo','Bajo']]},
 {n:4,area:'ESTACIÓN DE LAVADO DE MANOS',description:'Se habilitaron estaciones de lavado de manos, ubicadas al ingreso del área de cultivo y a la salida de las estaciones sanitarias. Cada estación cuenta con dispensadores de jabón, gel desinfectante, toallas de papel desechables y cesto de basura con bolsa plástica. Las estaciones se hallan identificadas y con señalización gráfica alusiva.',justification:'La falta de mantenimiento en las estaciones de lavado de manos y/o dispensadores de insumos provoca deficiencias en el procedimiento de higiene en los trabajadores, siendo las manos el principal vehículo de bacterias patógenas y en consecuencia contaminación cruzada.',hazards:[['FÍSICO','Ninguno.','',''],['QUÍMICO','Ninguno.','',''],['BIOLÓGICO','E. coli, salmonella spp.','Bajo','Bajo']]},
 {n:5,area:'ÁREA DE OBJETOS PERSONALES',description:'Se colocaron percheros en el área del comedor con el propósito de resguardar los objetos personales de los trabajadores y evitar el ingreso de objetos ajenos a la composición natural del cultivo y/o productos cosechados.',justification:'La introducción de objetos ajenos a la unidad de producción puede constituir un riesgo de contaminación físico por desprendimiento o microbiológico por contaminación cruzada.',hazards:[['FÍSICO','Vidrio, joyería.','Bajo','Bajo'],['QUÍMICO','Ninguno.','',''],['BIOLÓGICO','E. coli, salmonella spp.','Bajo','Bajo']]},
 {n:6,area:'ÁREA DE COMEDOR',description:'Se habilitó un espacio para el consumo de alimentos, fuera del área activa de producción, almacenamiento de sustancias químicas y/o insumos de producción. El piso, la mesa y las sillas son de fácil limpieza y desinfección. Se colocó un cesto de basura con bolsa plástica y señalización alusiva al área.',justification:'Si no se cuenta con el comedor existe la probabilidad de consumir alimentos dentro de la unidad de producción, lo que ocasiona basura y migas que son fuente de atracción para animales silvestres, provocando la posibilidad de excretas en las inmediaciones del cultivo.',hazards:[['FÍSICO','Cubiertos, migas, basura inorgánica.','Bajo','Bajo'],['QUÍMICO','Ninguno.','',''],['BIOLÓGICO','E. coli, Salmonella','Bajo','Bajo']]},
 {n:7,area:'ALMACÉN GENERAL',description:'Se habilitó un espacio (cabaña) cuyas paredes están reforzadas con lámina calibre 28. El acceso es controlado y se emplea para el almacenamiento de insumos fitosanitarios, Equipos de Protección Personal, herramientas, equipo de fumigación, entre otros. Cada material, herramienta y/o insumo se almacena por separado. Se cuenta con señalización y kit de contención de derrames.',justification:'Las herramientas de trabajo en la mayoría de los casos mantienen contacto con el cultivo y/o productos cosechados, de ahí la importancia de establecer medidas preventivas para el almacenamiento y manipulación de estas herramientas.',hazards:[['FÍSICO','Ninguno.','',''],['QUÍMICO','Insumos plaguicidas y fertilizantes','Bajo','Bajo'],['BIOLÓGICO','Ninguno.','','']]},
 {n:8,area:'ÁREA DE PREPARACIÓN DE MEZCLAS',description:'Dentro de la UP y alejado de las fuentes de agua se habilitó un piso firme de concreto de 1.5 m². El área está provista de sardinel y dren para la retención y confinamiento de escurrimientos y/o posibles derrames generados durante la preparación de plaguicidas. Se colocaron señalamientos de identificación, precauciones y advertencias.',justification:'Para evitar riesgos a la salud de los fumigadores así como peligros de contaminación química hacia el cultivo es menester preparar en áreas específicas las mezclas fitosanitarias.',hazards:[['FÍSICO','Ninguno.','',''],['QUÍMICO','Plaguicidas.','Medio','Medio'],['BIOLÓGICO','Ninguno.','','']]},
 {n:9,area:'ÁREA DE CALDOS SOBRANTES',description:'A un costado del área de preparación de mezclas se habilitó una fosa de concreto con filtros de grava, tepezil y arena como área de caldos sobrantes. La eliminación de los remanentes se realiza mediante evaporación a través de la radiación solar. El área se halla identificada y con señalización correspondiente.',justification:'Para evitar que los remanentes de las mezclas plaguicidas entren en contacto con el medio ambiente fue necesario habilitar un área para la eliminación de dichos residuos, evitando exposiciones que representen un riesgo de contaminación a los productos cosechados y riesgos a la salud humana.',hazards:[['FÍSICO','Ninguno.','',''],['QUÍMICO','Residuos de plaguicidas.','Bajo','Bajo'],['BIOLÓGICO','Ninguno.','','']]},
 {n:10,area:'ÁREA DE ENVASES VACÍOS DE PLAGUICIDAS',description:'Se habilitó un contenedor metálico (tonel) para resguardo temporal de envases vacíos de plaguicidas. La instalación está identificada con las señalizaciones respectivas.',justification:'Con la finalidad de evitar que los envases vacíos de plaguicidas permanezcan es necesario un espacio para el resguardo temporal de estos residuos, evitando daños a la salud, al ambiente y riesgos de contaminación química.',hazards:[['FÍSICO','Ninguno.','',''],['QUÍMICO','Residuos de plaguicidas.','Bajo','Bajo'],['BIOLÓGICO','Ninguno.','','']]},
 {n:11,area:'ZONA BUFFER',description:'Alejado de las fuentes de agua y del cultivo se habilitó una fosa de 0.5 m de profundidad para el desecho de producto contaminado, posibles animales muertos y/o materia fecal. Para evitar malos olores y atracción de animales carroñeros y/o moscas se encala el área después de colocar el material desechado.',justification:'Cuando se presentan incidencias por hallazgo de animales muertos, materia fecal y/o producto contaminado, si éstos no se desechan en áreas específicas existe la posibilidad de una contaminación al producto en desarrollo y cosechado.',hazards:[['FÍSICO','Ninguno.','',''],['QUÍMICO','Ninguno.','',''],['BIOLÓGICO','E. coli, Salmonella','Bajo','Bajo']]}
];
const module2ActionAreas=[
 {area:'BARRERAS DE PROTECCIÓN',actions:[['Verificación de la señalización y buen funcionamiento de las barreras de protección','Visual','Orificios o rupturas; deslaves; maleza; excretas; escombro; basura','Ausencia / No detectable','DOC 2.0.1 MANTENIMIENTO A LA INFRAESTRUCTURA'],['Mantenimiento preventivo de la señalización y de las barreras de protección','','','','DOC 2.3 PLAN DE MANTENIMIENTO PREVENTIVO A LA INFRAESTRUCTURA']]},
 {area:'ESTACIONES SANITARIAS',actions:[['Verificación del buen funcionamiento de las estaciones sanitarias y señalización correspondiente','Visual','Depósito de agua; escusado','Funcional','DOC 2.0.1 MANTENIMIENTO A LA INFRAESTRUCTURA'],['Mantenimiento preventivo de las estaciones sanitarias y señalización correspondiente','','Drenaje; cesto de basura','','DOC 2.3 PLAN DE MANTENIMIENTO PREVENTIVO A LA INFRAESTRUCTURA'],['','', 'Obstrucciones; fugas','Ausencia / No detectable','']]},
 {area:'FOSA SÉPTICA',actions:[['Verificación del funcionamiento adecuado de la fosa séptica','Visual','Orificios o rupturas; desgaste','Ausencia / No detectable','DOC 2.0.1 MANTENIMIENTO A LA INFRAESTRUCTURA'],['Mantenimiento preventivo de la fosa séptica','','Maleza; escurrimiento; escombro; basura','','DOC 2.3 PLAN DE MANTENIMIENTO PREVENTIVO A LA INFRAESTRUCTURA']]},
 {area:'ESTACIÓN DE LAVADO DE MANOS',actions:[['Verificación del funcionamiento de las estaciones de lavado de manos y dispensadores','Desempeño','Lavamanos; dispensadores','Funcional','DOC 2.0.1 MANTENIMIENTO A LA INFRAESTRUCTURA'],['Mantenimiento preventivo para el funcionamiento correcto de las estaciones de lavado de manos y dispensadores','Visual','Cesto de basura; señalización','Detectable','DOC 2.3 PLAN DE MANTENIMIENTO PREVENTIVO A LA INFRAESTRUCTURA'],['','','Obstrucciones; fugas','Ausencia / No detectable','']]},
 {area:'ÁREA DE OBJETOS PERSONALES',actions:[['Verificación del funcionamiento óptimo del área de objetos personales y de la señalización correspondiente','Visual','Rupturas; aglomeración de objetos personales','Ausencia / No detectable','DOC 2.0.1 MANTENIMIENTO A LA INFRAESTRUCTURA'],['Mantenimiento preventivo del área de objetos personales y de la señalización correspondiente','','Cantidad','Acorde al N° de trabajadores','DOC 2.3 PLAN DE MANTENIMIENTO PREVENTIVO A LA INFRAESTRUCTURA']]},
 {area:'ÁREA DE COMEDOR',actions:[['Verificación del buen funcionamiento del comedor y señalización correspondiente','Visual','Área señalizada','Detectable','DOC 2.0.1 MANTENIMIENTO A LA INFRAESTRUCTURA'],['Mantenimiento preventivo del comedor y la señalética añadida','Desempeño','Mesas y bancos','Funcionales','DOC 2.3 PLAN DE MANTENIMIENTO PREVENTIVO A LA INFRAESTRUCTURA']]},
 {area:'ALMACÉN GENERAL',actions:[['Verificación del buen funcionamiento del almacén de herramientas y la señalización correspondiente','Visual','Área señalizada, acceso controlado; orificios, rupturas, deterioro','Detectable / Ausencia','DOC 2.0.1 MANTENIMIENTO A LA INFRAESTRUCTURA'],['Mantenimiento preventivo del almacén de herramientas y su señalética correspondiente','Desempeño','Anaqueles y/o contenedores; separación de insumos, equipos y materiales','Funcionales / Detectable','DOC 2.3 PLAN DE MANTENIMIENTO PREVENTIVO A LA INFRAESTRUCTURA']]},
 {area:'ÁREA DE PREPARACIÓN DE MEZCLAS',actions:[['Verificación del buen funcionamiento del área de preparación de mezclas y de la señalización correspondiente','Visual','Área señalizada','Detectable','DOC 2.0.1 MANTENIMIENTO A LA INFRAESTRUCTURA'],['Mantenimiento para el funcionamiento óptimo del área de preparación de mezclas y la señalización correspondiente','Desempeño','Instalación','Funcional','DOC 2.3 PLAN DE MANTENIMIENTO PREVENTIVO A LA INFRAESTRUCTURA']]},
 {area:'ÁREA DE CALDOS SOBRANTES',actions:[['Inspección de la señalización y buen funcionamiento del área de caldos sobrantes','Visual','Área señalizada; escurrimientos, deterioro, maleza','Detectable / Ausencia','DOC 2.0.1 MANTENIMIENTO A LA INFRAESTRUCTURA; DOC 2.3 PLAN DE MANTENIMIENTO PREVENTIVO A LA INFRAESTRUCTURA']]},
 {area:'ÁREA DE ENVASES VACÍOS DE PLAGUICIDAS',actions:[['Inspección de la señalización y buen funcionamiento del área de envases vacíos de plaguicidas','Visual','Área señalizada; escurrimientos, deterioro, maleza','Detectable / Ausencia','DOC 2.0.1 MANTENIMIENTO A LA INFRAESTRUCTURA; DOC 2.3 PLAN DE MANTENIMIENTO PREVENTIVO A LA INFRAESTRUCTURA']]},
 {area:'ZONA BUFFER',actions:[['Inspección de la señalización y buen funcionamiento de la zona buffer','Visual','Área señalizada; escurrimientos, deterioro, maleza, basura','Detectable / Ausencia','DOC 2.0.1 MANTENIMIENTO A LA INFRAESTRUCTURA; DOC 2.3 PLAN DE MANTENIMIENTO PREVENTIVO A LA INFRAESTRUCTURA']]}
].map(x=>({...x,actions:[...x.actions,...Array(Math.max(0,3-x.actions.length)).fill(['','','','',''])].slice(0,3)}));
function riskChoice(areaIndex,hazardIndex,dimension,defaultValue){const key=`risk-s3-${areaIndex}-${hazardIndex}-${dimension}`;return module2Values[key]||defaultValue||''}
function renderRiskOptions(areaIndex,hazardIndex,dimension,defaultValue){const selected=riskChoice(areaIndex,hazardIndex,dimension,defaultValue);return ['Alto','Medio','Bajo'].map(v=>`<label class="risk-x"><input type="radio" name="risk-${areaIndex}-${hazardIndex}-${dimension}" data-risk-key="risk-s3-${areaIndex}-${hazardIndex}-${dimension}" value="${v}" ${selected===v?'checked':''}><span>${selected===v?'X':'○'}</span><small>${v}</small></label>`).join('')}
function renderRiskTable(){return `<div class="srrc-table-note"><b>Hoja 3 · Análisis descriptivo.</b> Se conserva el contenido del Excel. Sólo son editables las columnas de Probabilidad y Severidad para marcar con una X.</div><div class="srrc-table-scroll"><table class="srrc-risk-table"><thead><tr><th>N°</th><th>Fase / área</th><th>Descripción</th><th>Peligro significativo</th><th>Probabilidad</th><th>Severidad</th><th>Justificación</th></tr></thead><tbody>${module2RiskAreas.map((a,ai)=>a.hazards.map((h,hi)=>`<tr>${hi===0?`<td rowspan="3">${a.n}</td><td rowspan="3"><strong>${a.area}</strong></td><td rowspan="3">${a.description}</td>`:''}<td><b>${h[0]}:</b> ${h[1]}</td><td><div class="risk-options">${renderRiskOptions(ai,hi,'p',h[2])}</div></td><td><div class="risk-options">${renderRiskOptions(ai,hi,'s',h[3])}</div></td>${hi===0?`<td rowspan="3">${a.justification}</td>`:''}</tr>`).join('')).join('')}</tbody></table></div>`}
function renderActionTable(){return `<div class="srrc-table-note"><b>Hoja 4 · Acciones del análisis de peligros.</b> Se copia la estructura y contenido del Excel. Cada una de las 11 áreas conserva exactamente tres espacios de acción.</div><div class="srrc-table-scroll"><table class="srrc-action-table"><thead><tr><th>Área</th><th>N°</th><th>Acciones de control</th><th>Método</th><th>Indicador</th><th>Criterio</th><th>Documentación</th></tr></thead><tbody>${module2ActionAreas.map(a=>a.actions.map((r,i)=>`<tr>${i===0?`<td rowspan="3"><strong>${a.area}</strong></td>`:''}<td>${i+1}</td><td>${r[0]||'<span class="empty-slot">Espacio disponible</span>'}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')).join('')}</tbody></table></div>`}
const module2ExcelPreviews={
 'PORTADA':'assets/excel/01-portada.png',
 'POE MTTO INFRAESTR':'assets/excel/02-poe.png',
 'DOC-2.3 FRENTE':'assets/excel/09-bitacora-frente.png',
 'DOC-2.3 REVERSO':'assets/excel/10-bitacora-atras.png',
 'DOC-2.4':'assets/excel/11-organigrama.png',
 'DOC-2.5':'assets/excel/12-perfil-puestos.png'
};
function renderExcelPreview(doc){const src=module2ExcelPreviews[doc.code];return src?`<div class="excel-source-preview"><div class="excel-source-title"><b>Vista fiel del Excel original</b><span>Referencia para revisión e impresión</span></div><div class="excel-source-scroll"><img src="${src}" alt="Vista de la hoja ${esc(doc.title)}"></div></div>`:''}
function renderModule2DocumentContent(doc){
 return m2RenderDocument(doc);
}
function module2Status(){const docs=RED_DATA.module2,total=docs.reduce((n,d)=>n+(module2CaptureSpecs[d.code]||[]).length,0),filled=docs.reduce((n,d)=>n+(module2CaptureSpecs[d.code]||[]).filter((f,i)=>{const masterField=module2MasterField(d,f);return masterField?!!module2MasterValue(masterField):!!module2EffectiveValue(d,f,i).trim()}).length,0);return {total,filled,percent:total?Math.round(filled/total*100):0}}
function renderModules(){
  const grid=document.getElementById('moduleGrid');if(!grid)return;
  const modules=SRRC_MODULE_IDS.map(moduleReleaseStats);
  grid.innerHTML=modules.map(m=>`<article class="card module-card release-module-card ${m.integrated?'is-integrated':'is-locked'}" ${m.integrated?`data-module="${m.module}" tabindex="0" role="button"`:''}>
    <div class="module-card-head"><div><span class="module-number">Módulo ${m.module}</span><h2>${m.title}</h2></div><span class="module-lock" title="${m.integrated?'Módulo integrado':'Plantilla pendiente'}">${m.integrated?'🔓':'🔒'}</span></div>
    <div class="module-release-stats"><span><strong>${m.total}</strong> hojas</span><span><strong>${m.released}</strong> liberadas</span></div>
    <div class="module-progress-line"><span>${m.integrated?'Liberación por Dirección':'Sin plantilla integrada'}</span><strong>${m.integrated?`${m.percent}%`:'—'}</strong></div>
    <div class="progress-track"><div class="progress-fill" style="width:${m.percent}%"></div></div>
    <span class="module-open">${m.integrated?'Abrir módulo →':'Pendiente de integrar'}</span>
  </article>`).join('');
  grid.querySelectorAll('[data-module]').forEach(card=>{const open=()=>openModule(Number(card.dataset.module));card.addEventListener('click',open);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
}
function renderCaptureControl(doc,field,i){const [label,type,hint]=field,key=`${doc.id}-${i}`,masterField=module2MasterField(doc,field);if(masterField){const raw=module2MasterValue(masterField),value=esc(raw);return `<div class="module-field master-linked-field"><div class="module-field-copy"><strong>${label}</strong><span class="data-type linked-data-type">Dato maestro</span><p>${hint}</p></div><div class="module-field-control"><div class="master-linked-value ${value?'':'master-linked-empty'}"><span>${value||'Pendiente de captura en Datos Maestros'}</span><button type="button" data-open-master>Ir a Datos Maestros</button></div><small class="master-linked-source">Origen único: ${masterField}</small></div></div>`}const value=esc(module2EffectiveValue(doc,field,i));let control='';
 if(type==='image'||type==='evidence'||type==='signature')control=`<label class="upload-box"><input type="file" data-module2-file="${key}" accept="${type==='image'?'image/*':type==='signature'?'image/*,.pdf':'image/*,.pdf'}"><span>${value?'Archivo seleccionado: '+value:'Seleccionar '+typeLabels[type].toLowerCase()}</span></label>`;
 else if(type==='textarea'||type==='table'||type==='schedule')control=`<textarea data-module2-input="${key}" placeholder="Capturar información…">${value}</textarea>`;
 else if(type==='list')control=`<select data-module2-input="${key}"><option value="">Seleccionar…</option>${['Baja','Media','Alta','No aplica'].map(x=>`<option ${value===x?'selected':''}>${x}</option>`).join('')}</select>`;
 else control=`<input data-module2-input="${key}" type="${type==='date'?'date':type==='datetime'?'datetime-local':type==='number'?'number':'text'}" value="${value}" placeholder="Capturar información…">`;
 return `<div class="module-field"><div class="module-field-copy"><strong>${label}</strong><span class="data-type">${typeLabels[type]||type}</span><p>${hint}</p></div><div class="module-field-control">${control}</div></div>`}
const DIRECTOR_RELEASE_KEY='redGreenhouseDirectorRelease';
function directorReleaseState(){try{return JSON.parse(localStorage.getItem(DIRECTOR_RELEASE_KEY)||'{}')}catch(_e){return {}}}
function isDirectorReleased(key){return !!directorReleaseState()[key]}
function setDirectorReleased(key,value){const state=directorReleaseState();state[key]=!!value;localStorage.setItem(DIRECTOR_RELEASE_KEY,JSON.stringify(state));}
function openModule2(){const detail=document.getElementById('moduleDetail');detail.hidden=false;detail.innerHTML=`<div class="module-detail-head"><div><h2>Módulo 2 · Mantenimiento de infraestructura</h2><p>Las 12 hojas se muestran como documentos vivos. Los controles aparecen dentro del formato y conservan el contexto original.</p></div><div><button type="button" class="primary-button m2-export-excel">Generar Excel</button> <button class="ghost-button" data-close-module>Cerrar</button></div></div><div class="module-document-list">${RED_DATA.module2.map((doc,index)=>`<article class="excel-sheet-card"><div class="excel-sheet-row"><button class="excel-sheet-head" data-sheet-toggle="${doc.id}"><span class="sheet-index">${String(index+1).padStart(2,'0')}</span><span><strong>${doc.title}</strong><small>Hoja: ${doc.code} · ${doc.type}</small></span><span class="sheet-chevron">⌄</span></button><label class="director-release"><input type="checkbox" data-director-release="M2|${doc.code}" ${isDirectorReleased(`M2|${doc.code}`)?'checked':''}><span>Liberado por Director</span></label></div><div class="excel-sheet-body" id="sheet-${doc.id}" hidden><p class="sheet-description">${doc.description}</p><div class="sheet-action"><b>Acción para la carpeta:</b> ${doc.action} · <b>Frecuencia:</b> ${doc.frequency}</div>${renderModule2DocumentContent(doc)}</div></article>`).join('')}</div>`;
 detail.querySelector('[data-close-module]').addEventListener('click',()=>detail.hidden=true);
 detail.querySelectorAll('[data-director-release]').forEach(c=>c.addEventListener('change',()=>{setDirectorReleased(c.dataset.directorRelease,c.checked);renderModules();renderDashboard()}));
 detail.querySelectorAll('[data-sheet-toggle]').forEach(b=>b.addEventListener('click',()=>{const body=detail.querySelector(`#sheet-${b.dataset.sheetToggle}`);body.hidden=!body.hidden}));
 detail.querySelectorAll('[data-module2-input]').forEach(el=>el.addEventListener('input',()=>{module2Values[el.dataset.module2Input]=el.value;localStorage.setItem('redGreenhouseModule2',JSON.stringify(module2Values));renderModules()}));
 detail.querySelectorAll('[data-risk-key]').forEach(el=>el.addEventListener('change',()=>{module2Values[el.dataset.riskKey]=el.value;localStorage.setItem('redGreenhouseModule2',JSON.stringify(module2Values));openModule2();renderModules()}));
 detail.querySelectorAll('[data-module2-file]').forEach(el=>el.addEventListener('change',()=>{module2Values[el.dataset.module2File]=el.files[0]?.name||'';localStorage.setItem('redGreenhouseModule2',JSON.stringify(module2Values));openModule2();renderModules()}));
 detail.querySelectorAll('[data-open-master]').forEach(el=>el.addEventListener('click',()=>showView('datos')));
 RED_DATA.module2.forEach(doc=>m2EnhanceOpenDocument(detail,doc));
 detail.scrollIntoView({behavior:'smooth',block:'start'});
}
function openModule(m){if(m===2){openModule2();return}if(window.SRRC_MODULES&&window.SRRC_MODULES.some(x=>x.module===m)){openStructuredModule(m);return}const st=moduleStatus(m),detail=document.getElementById('moduleDetail');detail.hidden=false;detail.innerHTML=`<div class="module-detail-head"><div><h2>Módulo ${m} · ${moduleNames[m]}</h2><p>Vista provisional basada en los datos transversales ya identificados.</p></div><button class="ghost-button" data-close-module>Cerrar</button></div><table class="module-detail-table"><thead><tr><th>Dato requerido</th><th>Valor capturado</th><th>Certeza</th><th>Destino</th></tr></thead><tbody>${st.fields.map(x=>{const value=fieldPreview(x);return `<tr><td><strong>${x.field}</strong><br><small>${x.detail}</small></td><td class="value-preview ${value?'':'empty-value'}">${esc(value||'Pendiente de captura')}</td><td><span class="certainty-label confirmed">Confirmado</span></td><td><span class="mapping-badge">M${m}</span></td></tr>`}).join('')}</tbody></table>`;detail.querySelector('[data-close-module]').addEventListener('click',()=>detail.hidden=true);detail.scrollIntoView({behavior:'smooth',block:'start'})}
function renderAll(){ensureStructuredDefaults();renderDashboard();renderTasks();renderMasterData();renderModules()}

let currentView='inicio',viewHistory=[];
function showView(v,track=true){
  if(track&&v!==currentView)viewHistory.push(currentView);
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));
  const d=document.getElementById(`view-${v}`),labels={inicio:'Inicio',certificaciones:'Certificaciones',plan:'Plan Maestro',datos:'Datos Maestros',modulos:'Módulos SRRC',bitacoras:'Bitácoras',vinculacion:'Referencias Excel',configuracion:'Administración',galeria:'Galería pública',captura:'Captura'};
  if(d){d.classList.add('active');document.getElementById('breadcrumb').textContent=labels[v]||v.charAt(0).toUpperCase()+v.slice(1)}
  else{document.getElementById('view-placeholder').classList.add('active');document.getElementById('placeholderTitle').textContent=v.charAt(0).toUpperCase()+v.slice(1);document.getElementById('breadcrumb').textContent=v.charAt(0).toUpperCase()+v.slice(1)}
  currentView=v;document.getElementById('backButton').disabled=viewHistory.length===0;document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===v));document.getElementById('sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});
}

const PORTAL_VERSION=window.RED_PORTAL_CONFIG?.version||'1.53';
function applyPortalVersion(){
  const values={privateVersion:PORTAL_VERSION,heroVersion:PORTAL_VERSION,sidebarVersion:`v${PORTAL_VERSION}`,systemVersion:`v${PORTAL_VERSION}`};
  Object.entries(values).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.textContent=value});
  const access=document.getElementById('openLoginButton');if(access)access.textContent=`Acceso Portal V${PORTAL_VERSION} →`;
}

// Acceso público / privado y configuración básica.
const DEFAULT_PORTAL_PASSWORD='RED2026';
const portalPassword=()=>localStorage.getItem('redGreenhousePortalPassword')||DEFAULT_PORTAL_PASSWORD;
function openLogin(){document.getElementById('loginBackdrop').hidden=false;document.getElementById('loginPassword').focus()}
function closeLogin(){document.getElementById('loginBackdrop').hidden=true;document.getElementById('loginError').textContent='';document.getElementById('loginForm').reset()}
function enterPrivatePortal(){document.getElementById('publicSite').hidden=true;document.getElementById('privateApp').hidden=false;sessionStorage.setItem('redGreenhousePrivateSession','1');showView('inicio',false)}
function exitPrivatePortal(){sessionStorage.removeItem('redGreenhousePrivateSession');document.getElementById('privateApp').hidden=true;document.getElementById('publicSite').hidden=false;showView('inicio',false)}
document.getElementById('openLoginButton').addEventListener('click',openLogin);
document.getElementById('footerLoginButton').addEventListener('click',openLogin);
document.getElementById('closeLoginButton').addEventListener('click',closeLogin);
document.getElementById('loginBackdrop').addEventListener('click',e=>{if(e.target.id==='loginBackdrop')closeLogin()});
document.getElementById('loginForm').addEventListener('submit',e=>{e.preventDefault();if(document.getElementById('loginPassword').value===portalPassword()){closeLogin();enterPrivatePortal()}else document.getElementById('loginError').textContent='Contraseña incorrecta.'});
document.getElementById('logoutButton').addEventListener('click',exitPrivatePortal);
document.getElementById('publicSiteButton').addEventListener('click',exitPrivatePortal);
document.getElementById('savePasswordButton').addEventListener('click',()=>{const a=document.getElementById('newPortalPassword').value,b=document.getElementById('confirmPortalPassword').value,msg=document.getElementById('passwordMessage');if(a.length<4){msg.textContent='Usa al menos 4 caracteres.';return}if(a!==b){msg.textContent='Las contraseñas no coinciden.';return}localStorage.setItem('redGreenhousePortalPassword',a);document.getElementById('newPortalPassword').value='';document.getElementById('confirmPortalPassword').value='';msg.textContent='Contraseña actualizada.'});
const driveConfig=JSON.parse(localStorage.getItem('redGreenhouseDriveConfig')||'{}');
document.getElementById('driveFolderId').value=driveConfig.folderId||'1nhz_xAqRz6kcsZdg_zodmaLACmw584sL';
document.getElementById('driveWebAppUrl').value=driveConfig.webAppUrl||'https://script.google.com/macros/s/AKfycbwA5CB0NFyUxU6xa_mmaCkfhnz9pwqIscAxmcSp1LTOpnmasBuFv46fEP3dc3MjABjlXw/exec';
document.getElementById('saveDriveConfigButton').addEventListener('click',()=>{localStorage.setItem('redGreenhouseDriveConfig',JSON.stringify({folderId:document.getElementById('driveFolderId').value.trim(),webAppUrl:document.getElementById('driveWebAppUrl').value.trim()}));document.getElementById('driveMessage').textContent='Configuración guardada.'});
if(sessionStorage.getItem('redGreenhousePrivateSession')==='1')enterPrivatePortal();


const DEFAULT_GALLERY=[{fileId:'local-invernadero',title:'Producción en campo',description:'Trabajo cotidiano dentro del invernadero.',imageUrl:'assets/images/gallery/invernadero-familia.png',visible:true,local:true}];
function galleryEndpoint(){return (JSON.parse(localStorage.getItem('redGreenhouseDriveConfig')||'{}').webAppUrl||document.getElementById('driveWebAppUrl')?.value||'').trim()}
function fileToDataUrl(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=reject;r.readAsDataURL(file)})}
function fileToBase64(file){return fileToDataUrl(file).then(dataUrl=>dataUrl.split(',')[1])}
function localGalleryItem(){
  const saved=JSON.parse(localStorage.getItem('redGreenhouseLocalGalleryItem')||'null');
  if(saved?.deleted)return null;
  return {...DEFAULT_GALLERY[0],...(saved||{})};
}
async function loadGallery(){
  const local=localGalleryItem();let items=local?[local]:[];const url=galleryEndpoint();
  if(url){try{const r=await fetch(url+'?action=listGallery&includeHidden=1');const j=await r.json();if(j.ok&&Array.isArray(j.items))items=items.concat(j.items)}catch(e){console.warn('Galería Drive no disponible',e)}}
  renderGallery(items);
}
function galleryActionButtons(x){
  const id=esc(x.fileId||'');
  const visible=x.visible!==false;
  return `<div class="gallery-item-actions">
    <button type="button" class="gallery-action-button" data-gallery-action="edit" data-file-id="${id}">Editar</button>
    <button type="button" class="gallery-action-button" data-gallery-action="toggle" data-file-id="${id}">${visible?'Ocultar':'Mostrar'}</button>
    <button type="button" class="gallery-action-button danger" data-gallery-action="delete" data-file-id="${id}">Eliminar</button>
  </div>`;
}
function renderGallery(items){
  const publicItems=items.filter(x=>x.visible!==false);
  const publicGrid=document.getElementById('publicGalleryGrid');
  if(publicGrid)publicGrid.innerHTML=publicItems.map(x=>`<article class="gallery-tile"><img src="${esc(x.imageUrl||x.thumbnailUrl||'')}" alt="${esc(x.title||'Fotografía RED Greenhouse')}"><div><strong>${esc(x.title||'RED Greenhouse')}</strong><span>${esc(x.description||'')}</span></div></article>`).join('');
  const admin=document.getElementById('galleryAdminGrid');
  if(admin)admin.innerHTML=items.map(x=>`<article class="card gallery-admin-item ${x.visible===false?'is-hidden':''}" data-file-id="${esc(x.fileId||'')}"><img src="${esc(x.imageUrl||x.thumbnailUrl||'')}" alt=""><div class="gallery-item-body"><div class="gallery-item-status"><strong>${esc(x.title||'Sin título')}</strong><span>${x.visible===false?'Oculta':'Visible'}</span></div><p>${esc(x.description||'')}</p><small>${x.local?'Incluida en el portal':'Google Drive · '+esc(x.name||x.fileId||'')}</small>${galleryActionButtons(x)}</div></article>`).join('');
}
async function uploadGalleryPhoto(){
  const file=document.getElementById('galleryFile').files[0],msg=document.getElementById('galleryMessage'),url=galleryEndpoint();
  if(!file){msg.textContent='Selecciona una fotografía.';return}if(!url){msg.textContent='Configura primero la URL del Apps Script.';return}
  msg.textContent='Subiendo fotografía…';
  try{const payload={action:'uploadGallery',fileName:file.name,mimeType:file.type||'image/jpeg',base64:await fileToBase64(file),title:document.getElementById('galleryTitle').value.trim(),description:document.getElementById('galleryDescription').value.trim(),visible:true};const r=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});const j=await r.json();if(!j.ok)throw new Error(j.error||'No se pudo subir');msg.textContent='Fotografía publicada.';document.getElementById('galleryFile').value='';document.getElementById('galleryTitle').value='';document.getElementById('galleryDescription').value='';await loadGallery()}catch(e){msg.textContent='Error: '+e.message}
}
async function saveLocalGalleryChange(action,item){
  if(action==='delete'){
    localStorage.setItem('redGreenhouseLocalGalleryItem',JSON.stringify({deleted:true}));
    return;
  }
  localStorage.setItem('redGreenhouseLocalGalleryItem',JSON.stringify(item));
}
async function postGalleryAction(payload){
  const url=galleryEndpoint();
  if(!url)throw new Error('Configura primero la URL del Apps Script.');
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
  const j=await r.json();if(!j.ok)throw new Error(j.error||'No se pudo actualizar la galería');return j;
}
async function handleGalleryAction(button){
  const action=button.dataset.galleryAction,fileId=button.dataset.fileId,msg=document.getElementById('galleryMessage');
  const isLocal=fileId==='local-invernadero';
  const currentCard=button.closest('.gallery-admin-item');
  const currentTitle=currentCard?.querySelector('strong')?.textContent||'';
  const currentDescription=currentCard?.querySelector('p')?.textContent||'';
  try{
    if(action==='edit'){
      const title=prompt('Título de la fotografía:',currentTitle);if(title===null)return;
      const description=prompt('Descripción:',currentDescription);if(description===null)return;
      if(isLocal){const item={...localGalleryItem(),title:title.trim(),description:description.trim()};await saveLocalGalleryChange('edit',item)}
      else await postGalleryAction({action:'updateGallery',fileId,title:title.trim(),description:description.trim()});
      msg.textContent='Fotografía actualizada.';
    }
    if(action==='toggle'){
      const currentlyHidden=currentCard?.classList.contains('is-hidden');
      const visible=currentlyHidden;
      if(isLocal){const item={...localGalleryItem(),visible};await saveLocalGalleryChange('toggle',item)}
      else await postGalleryAction({action:'updateGallery',fileId,visible});
      msg.textContent=visible?'Fotografía visible en el sitio público.':'Fotografía oculta del sitio público.';
    }
    if(action==='delete'){
      if(!confirm(isLocal?'¿Quitar esta fotografía del sitio público?':'¿Eliminar esta fotografía? También se enviará a la papelera de Google Drive.'))return;
      if(isLocal)await saveLocalGalleryChange('delete',localGalleryItem());
      else await postGalleryAction({action:'deleteGallery',fileId});
      msg.textContent='Fotografía eliminada.';
    }
    await loadGallery();
  }catch(e){msg.textContent='Error: '+e.message}
}
document.getElementById('uploadGalleryButton').addEventListener('click',uploadGalleryPhoto);
document.getElementById('refreshGalleryButton').addEventListener('click',loadGallery);
document.getElementById('galleryAdminGrid').addEventListener('click',e=>{const b=e.target.closest('[data-gallery-action]');if(b)handleGalleryAction(b)});
loadGallery();

applyPortalVersion();
ensureStructuredDefaults();
clearDuplicateModule2Values();
document.getElementById('backButton').addEventListener('click',()=>{if(viewHistory.length)showView(viewHistory.pop(),false)});document.getElementById('homeButton').addEventListener('click',()=>showView('inicio'));document.getElementById('saveMasterDataButton').addEventListener('click',saveMasterData);
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));document.getElementById('menuButton').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderTasks()}));
const modal=document.getElementById('modalBackdrop');document.getElementById('addTaskButton').addEventListener('click',()=>modal.classList.add('open'));document.getElementById('closeModal').addEventListener('click',()=>modal.classList.remove('open'));modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});document.getElementById('taskForm').addEventListener('submit',e=>{e.preventDefault();tasks.unshift({id:Date.now(),title:document.getElementById('taskTitle').value.trim(),detail:'Tarea agregada desde el portal.',owner:document.getElementById('taskOwner').value.trim(),priority:document.getElementById('taskPriority').value,status:document.getElementById('taskStatus').value,due:'Sin fecha'});saveTasks();e.target.reset();modal.classList.remove('open');renderAll()});syncMasterTask();setDate();renderAll();
