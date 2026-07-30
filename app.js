

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
  return `<div class="structured-capture"><table><thead><tr><th>${item.field==='Responsables por área'?'Área':'Función'}</th>${def.columns.map(c=>`<th>${c.label}</th>`).join('')}<th>Destino confirmado</th></tr></thead><tbody>${def.rows.map(r=>`<tr><td class="fixed-cell">${r.label}</td>${def.columns.map(c=>`<td><input class="structured-input" data-structured-field="${key}" data-structured-row="${r.id}" data-structured-col="${c.key}" value="${esc(String(vals[r.id]?.[c.key]||''))}" placeholder="Capturar..."></td>`).join('')}<td class="mapping-cell">${r.mapping||def.mapping}</td></tr>`).join('')}</tbody></table></div>${old?`<div class="previous-text-note">Texto anterior conservado: ${esc(old)}</div>`:''}`;
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
      ${shown.filter(x=>x.category===group).map(x=>{const key=masterKey(x.field),value=esc(String(masterValues[key]||'')),long=/domicilio|coordenadas|macro|inventario|croquis|responsables por área|firmas/i.test(x.field);const certainty=x.source==='Por confirmar'?'probable':'confirmed';const confirmedCount=Object.values(x.modules).filter(v=>v==='c').length;const probableCount=Object.values(x.modules).filter(v=>v==='p').length;const impactText=certainty==='confirmed'?`Impacto real: ${confirmedCount} módulo${confirmedCount===1?'':'s'}`:`Impacto probable: ${probableCount} módulo${probableCount===1?'':'s'}`;return `
        <div class="master-field">
          <span class="field-certainty ${certainty}" title="${certainty==='confirmed'?'Confirmado en Excel recibidos':'Probable; pendiente de validar'}"></span>
          <div class="master-input-wrap"><strong>${x.field}<span class="required-mark">*</span></strong><p>${x.detail}</p><div class="field-meta"><span class="certainty-label ${certainty}">${certainty==='confirmed'?'Confirmado':'Probable'}</span><span class="impact-chip">${impactText}</span></div>${structuredDefinitions[x.field]?renderStructuredCapture(x):(long?`<textarea class="master-textarea" data-master-input="${key}">${value}</textarea>`:`<input class="master-input" data-master-input="${key}" value="${value}">`)}</div>
          <span class="source-chip">${x.source}</span>
        </div>`}).join('')}
    </section>`).join('');
  document.querySelectorAll('[data-master-input]').forEach(input=>input.addEventListener('input',()=>{input.closest('.master-field').classList.toggle('has-value',!!input.value.trim())}));
  document.querySelectorAll('[data-structured-field]').forEach(input=>input.addEventListener('input',()=>input.closest('.master-field').classList.add('has-value')));

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
function taskActionView(t){return t.linkedTo==='masterData'?'datos':null}
function renderDashboard(){
  const p=progress(),c=masterCompletion();
  document.getElementById('progressValue').textContent=`${p}%`;
  document.getElementById('progressFill').style.width=`${p}%`;
  const dm=document.getElementById('dashboardMasterProgress');if(dm)dm.textContent=`${c.percent}%`;
  document.getElementById('dashboardTasks').innerHTML=tasks.slice(0,5).map(t=>{const target=taskActionView(t);return `<div class="compact-task ${target?'actionable':''}" ${target?`data-task-view="${target}" tabindex="0" role="link"`:''}><div class="compact-task-copy"><strong class="${target?'task-link':''}">${esc(t.title)}</strong><small>${esc(t.owner)} · ${esc(t.due)}</small></div><div class="compact-task-badges"><span class="badge badge-${t.priority}">${priorityLabels[t.priority]}</span><span class="badge status-badge">${statusLabels[t.status]}</span></div></div>`}).join('');
  document.querySelectorAll('[data-task-view]').forEach(row=>{const open=()=>showView(row.dataset.taskView);row.addEventListener('click',open);row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
}
function renderTasks(){
  const f=tasks.filter(t=>activeFilter==='all'||(activeFilter==='critical'?t.priority==='critical':t.status===activeFilter));
  document.getElementById('taskList').innerHTML=f.length?f.map(t=>{const target=taskActionView(t);return `<div class="task-row ${target?'linked-task':''}"><input class="task-check" type="checkbox" ${t.status==='done'?'checked':''} ${target?'disabled title="Se actualiza desde Datos Maestros"':''} data-id="${t.id}"><div class="task-title">${target?`<button class="task-title-link" data-task-view="${target}">${esc(t.title)}</button>`:`<strong>${esc(t.title)}</strong>`}<small>${esc(t.detail||'')}</small></div><div class="task-owner">${esc(t.owner)}</div><span class="badge badge-${t.priority}">${priorityLabels[t.priority]}</span><span class="badge status-badge">${statusLabels[t.status]}</span><div class="task-date">${esc(t.due||'Sin fecha')}</div>${target?`<button class="task-open-link" data-task-view="${target}">Abrir</button>`:`<button class="delete-task" data-delete="${t.id}">×</button>`}</div>`}).join(''):'<div class="placeholder"><p>No hay tareas para este filtro.</p></div>';
  document.getElementById('totalTasks').textContent=tasks.length;document.getElementById('pendingTasks').textContent=tasks.filter(t=>t.status==='pending').length;document.getElementById('doingTasks').textContent=tasks.filter(t=>t.status==='doing').length;document.getElementById('doneTasks').textContent=tasks.filter(t=>t.status==='done').length;
  document.querySelectorAll('.task-check:not([disabled])').forEach(i=>i.addEventListener('change',()=>{const t=tasks.find(x=>x.id===Number(i.dataset.id));if(t){t.status=i.checked?'done':'pending';saveTasks();renderAll()}}));
  document.querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',()=>{tasks=tasks.filter(t=>t.id!==Number(b.dataset.delete));saveTasks();renderAll()}));
  document.querySelectorAll('[data-task-view]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();showView(b.dataset.taskView)}));
}

const moduleNames={2:'Infraestructura',3:'Higiene',4:'Control de fauna',5:'Capacitación',6:'Programa de auditorías',7:'Validación de procedimientos'};
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
 ['Área, instalación o equipo','table','Elemento evaluado'],['Peligro de contaminación','table','Descripción del peligro identificado'],['Causa u origen','table','Condición que puede generar el peligro'],['Probabilidad','list','Baja, media o alta'],['Severidad','list','Baja, media o alta'],['Medidas preventivas existentes','table','Controles actuales'],['Evidencia o referencia','evidence','Fotografía, documento o registro de soporte']
],
'PLAN DE ACCIÓN':[
 ['Peligro o hallazgo','table','Resultado procedente del análisis descriptivo'],['Acción preventiva o correctiva','table','Medida concreta a ejecutar'],['Responsable','person','Persona o puesto asignado'],['Fecha compromiso','date','Fecha prevista de cumplimiento'],['Recursos requeridos','table','Materiales, servicio o presupuesto necesario'],['Evidencia de cierre','evidence','Prueba de ejecución'],['Verificación de eficacia','table','Resultado de revisión posterior']
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
  'MAPA 2.1|Coordenadas':'Coordenadas geográficas',
  'MAPA 2.1.1|Coordenadas':'Coordenadas geográficas',
  'CROQUIS 2.2|Croquis de instalaciones':'Croquis de instalaciones',
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
function module2Status(){const docs=RED_DATA.module2,total=docs.reduce((n,d)=>n+(module2CaptureSpecs[d.code]||[]).length,0),filled=docs.reduce((n,d)=>n+(module2CaptureSpecs[d.code]||[]).filter((f,i)=>{const masterField=module2MasterField(d,f);return masterField?!!module2MasterValue(masterField):!!module2EffectiveValue(d,f,i).trim()}).length,0);return {total,filled,percent:total?Math.round(filled/total*100):0}}
function renderModules(){
 const summary=document.getElementById('moduleSummary'),grid=document.getElementById('moduleGrid');if(!summary||!grid)return;
 const m2=module2Status(),mods=[2,3,4,5,6,7];
 summary.innerHTML=`<article class="summary-card"><span>Hojas visibles del Módulo 2</span><strong>${RED_DATA.module2.length}</strong></article><article class="summary-card"><span>Campos identificados</span><strong>${m2.total}</strong></article><article class="summary-card"><span>Captura Módulo 2</span><strong>${m2.percent}%</strong></article>`;
 grid.innerHTML=mods.map(m=>{const st=m===2?m2:moduleStatus(m);return `<article class="card module-card" data-module="${m}"><div class="module-card-head"><div><h2>Módulo ${m}</h2><p>${moduleNames[m]}</p></div><span class="badge status-badge">${m===2?'Piloto completo':st.percent===100?'Completo':st.percent?'En proceso':'Pendiente'}</span></div><div class="module-progress-line"><span>${m===2?`${RED_DATA.module2.length} hojas · ${st.total} campos`:`${st.filled} de ${st.total} datos aplicables`}</span><strong>${st.percent}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${st.percent}%"></div></div><span class="module-open">${m===2?'Ver contenido completo del Excel →':'Abrir tabla estructurada →'}</span></article>`}).join('');
 grid.querySelectorAll('[data-module]').forEach(card=>card.addEventListener('click',()=>openModule(Number(card.dataset.module))));
}
function renderCaptureControl(doc,field,i){const [label,type,hint]=field,key=`${doc.id}-${i}`,masterField=module2MasterField(doc,field);if(masterField){const raw=module2MasterValue(masterField),value=esc(raw);return `<div class="module-field master-linked-field"><div class="module-field-copy"><strong>${label}</strong><span class="data-type linked-data-type">Dato maestro</span><p>${hint}</p></div><div class="module-field-control"><div class="master-linked-value ${value?'':'master-linked-empty'}"><span>${value||'Pendiente de captura en Datos Maestros'}</span><button type="button" data-open-master>Ir a Datos Maestros</button></div><small class="master-linked-source">Origen único: ${masterField}</small></div></div>`}const value=esc(module2EffectiveValue(doc,field,i));let control='';
 if(type==='image'||type==='evidence'||type==='signature')control=`<label class="upload-box"><input type="file" data-module2-file="${key}" accept="${type==='image'?'image/*':type==='signature'?'image/*,.pdf':'image/*,.pdf'}"><span>${value?'Archivo seleccionado: '+value:'Seleccionar '+typeLabels[type].toLowerCase()}</span></label>`;
 else if(type==='textarea'||type==='table'||type==='schedule')control=`<textarea data-module2-input="${key}" placeholder="Capturar información…">${value}</textarea>`;
 else if(type==='list')control=`<select data-module2-input="${key}"><option value="">Seleccionar…</option>${['Baja','Media','Alta','No aplica'].map(x=>`<option ${value===x?'selected':''}>${x}</option>`).join('')}</select>`;
 else control=`<input data-module2-input="${key}" type="${type==='date'?'date':type==='datetime'?'datetime-local':type==='number'?'number':'text'}" value="${value}" placeholder="Capturar información…">`;
 return `<div class="module-field"><div class="module-field-copy"><strong>${label}</strong><span class="data-type">${typeLabels[type]||type}</span><p>${hint}</p></div><div class="module-field-control">${control}</div></div>`}
function openModule2(){const detail=document.getElementById('moduleDetail');detail.hidden=false;detail.innerHTML=`<div class="module-detail-head"><div><h2>Módulo 2 · Mantenimiento de infraestructura</h2><p>Las 12 hojas útiles del Excel están representadas abajo. Cada campo indica exactamente el tipo de información que debe entregar el usuario.</p></div><button class="ghost-button" data-close-module>Cerrar</button></div><div class="module-document-list">${RED_DATA.module2.map((doc,index)=>`<article class="excel-sheet-card"><button class="excel-sheet-head" data-sheet-toggle="${doc.id}"><span class="sheet-index">${String(index+1).padStart(2,'0')}</span><span><strong>${doc.title}</strong><small>Hoja: ${doc.code} · ${doc.type}</small></span><span class="sheet-chevron">⌄</span></button><div class="excel-sheet-body" id="sheet-${doc.id}" ${index?'hidden':''}><p class="sheet-description">${doc.description}</p><div class="sheet-action"><b>Acción para la carpeta:</b> ${doc.action} · <b>Frecuencia:</b> ${doc.frequency}</div><div class="module-fields">${(module2CaptureSpecs[doc.code]||[]).map((f,i)=>renderCaptureControl(doc,f,i)).join('')}</div></div></article>`).join('')}</div>`;
 detail.querySelector('[data-close-module]').addEventListener('click',()=>detail.hidden=true);
 detail.querySelectorAll('[data-sheet-toggle]').forEach(b=>b.addEventListener('click',()=>{const body=detail.querySelector(`#sheet-${b.dataset.sheetToggle}`);body.hidden=!body.hidden}));
 detail.querySelectorAll('[data-module2-input]').forEach(el=>el.addEventListener('input',()=>{module2Values[el.dataset.module2Input]=el.value;localStorage.setItem('redGreenhouseModule2',JSON.stringify(module2Values));renderModules()}));
 detail.querySelectorAll('[data-module2-file]').forEach(el=>el.addEventListener('change',()=>{module2Values[el.dataset.module2File]=el.files[0]?.name||'';localStorage.setItem('redGreenhouseModule2',JSON.stringify(module2Values));openModule2();renderModules()}));
 detail.querySelectorAll('[data-open-master]').forEach(el=>el.addEventListener('click',()=>showView('datos')));
 detail.scrollIntoView({behavior:'smooth',block:'start'});
}
function openModule(m){if(m===2){openModule2();return}const st=moduleStatus(m),detail=document.getElementById('moduleDetail');detail.hidden=false;detail.innerHTML=`<div class="module-detail-head"><div><h2>Módulo ${m} · ${moduleNames[m]}</h2><p>Vista provisional basada en los datos transversales ya identificados.</p></div><button class="ghost-button" data-close-module>Cerrar</button></div><table class="module-detail-table"><thead><tr><th>Dato requerido</th><th>Valor capturado</th><th>Certeza</th><th>Destino</th></tr></thead><tbody>${st.fields.map(x=>{const value=fieldPreview(x);return `<tr><td><strong>${x.field}</strong><br><small>${x.detail}</small></td><td class="value-preview ${value?'':'empty-value'}">${esc(value||'Pendiente de captura')}</td><td><span class="certainty-label confirmed">Confirmado</span></td><td><span class="mapping-badge">M${m}</span></td></tr>`}).join('')}</tbody></table>`;detail.querySelector('[data-close-module]').addEventListener('click',()=>detail.hidden=true);detail.scrollIntoView({behavior:'smooth',block:'start'})}
function renderAll(){ensureStructuredDefaults();renderDashboard();renderTasks();renderMasterData();renderModules()}

let currentView='inicio',viewHistory=[];
function showView(v,track=true){if(track&&v!==currentView)viewHistory.push(currentView);document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));const d=document.getElementById(`view-${v}`);if(d){d.classList.add('active');document.getElementById('breadcrumb').textContent=v==='inicio'?'Inicio':v==='plan'?'Plan Maestro':v==='datos'?'Datos Maestros':v==='modulos'?'Módulos SRRC':v}else{document.getElementById('view-placeholder').classList.add('active');document.getElementById('placeholderTitle').textContent=v.charAt(0).toUpperCase()+v.slice(1);document.getElementById('breadcrumb').textContent=v.charAt(0).toUpperCase()+v.slice(1)}currentView=v;document.getElementById('backButton').disabled=viewHistory.length===0;document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===v));document.getElementById('sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'})}
ensureStructuredDefaults();
clearDuplicateModule2Values();
document.getElementById('backButton').addEventListener('click',()=>{if(viewHistory.length)showView(viewHistory.pop(),false)});document.getElementById('homeButton').addEventListener('click',()=>showView('inicio'));document.getElementById('saveMasterDataButton').addEventListener('click',saveMasterData);
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));document.getElementById('menuButton').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderTasks()}));
const modal=document.getElementById('modalBackdrop');document.getElementById('addTaskButton').addEventListener('click',()=>modal.classList.add('open'));document.getElementById('closeModal').addEventListener('click',()=>modal.classList.remove('open'));modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});document.getElementById('taskForm').addEventListener('submit',e=>{e.preventDefault();tasks.unshift({id:Date.now(),title:document.getElementById('taskTitle').value.trim(),detail:'Tarea agregada desde el portal.',owner:document.getElementById('taskOwner').value.trim(),priority:document.getElementById('taskPriority').value,status:document.getElementById('taskStatus').value,due:'Sin fecha'});saveTasks();e.target.reset();modal.classList.remove('open');renderAll()});syncMasterTask();setDate();renderAll();
