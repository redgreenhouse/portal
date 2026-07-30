let SRRC_CONFIG=null, SRRC_MASTER=null;
const CAPTURE_STORE=JSON.parse(localStorage.getItem('red_srrc_capture_v119')||'{}');
const capSave=()=>localStorage.setItem('red_srrc_capture_v119',JSON.stringify(CAPTURE_STORE));

async function initCapture(){
  try{
    [SRRC_CONFIG,SRRC_MASTER]=await Promise.all([
      fetch('config/field-map.json').then(r=>r.json()),
      fetch('config/master-data-map.json').then(r=>r.json())
    ]);
    renderCaptureHome(); renderLogs(); renderMap();
  }catch(e){
    ['captureApp','logsApp','mapApp'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML='<div class="card"><h2>No se pudo cargar la configuración</h2><p>Publica el portal mediante GitHub Pages; abrir index.html directamente puede bloquear la lectura de JSON.</p></div>'});
  }
}
function capEsc(s){return String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
function capAttr(s){return capEsc(s).replace(/"/g,'&quot;')}
function allSheets(){return SRRC_CONFIG.modules.flatMap(m=>m.sheets.map((s,i)=>({module:m.module,moduleTitle:m.title,sheet:s,index:i})))}
function renderCaptureHome(){
 const el=document.getElementById('captureApp'); if(!el||!SRRC_CONFIG)return;
 const sheets=allSheets(), controls=sheets.flatMap(x=>x.sheet.controls);
 el.innerHTML=`<div class="page-heading"><div><h1>Captura SRRC · Módulos 2 y 3</h1><p>Los colores del Excel sólo definen el comportamiento; no aparecen en el portal.</p></div><button class="primary-button" onclick="showCaptureMasters()">Datos Maestros</button></div>
 <section class="summary-grid capture-summary"><article class="summary-card"><span>Módulos activos</span><strong>2</strong></article><article class="summary-card"><span>Hojas configuradas</span><strong>${sheets.length}</strong></article><article class="summary-card"><span>Grupos de captura</span><strong>${controls.length}</strong></article><article class="summary-card"><span>Bitácoras</span><strong>${sheets.filter(x=>x.sheet.kind==='bitacora').length}</strong></article></section>
 <section class="card"><div class="section-heading"><div><h2>Selecciona un módulo</h2><p>Primera prueba visual y funcional del motor de captura.</p></div></div><div class="capture-module-grid">${SRRC_CONFIG.modules.map(m=>`<button class="capture-module-card" onclick="showCaptureModule(${m.module})"><span>Módulo ${m.module}</span><strong>${capEsc(m.title)}</strong><small>${m.sheets.length} hojas</small></button>`).join('')}</div></section>
 <section class="executive-alert"><div class="alert-icon">i</div><div><strong>Reglas activas</strong><p>Amarillo: texto/fecha · Verde: dato maestro · Rosa: imagen · Azul cielo: ✓ / ✗ / NL · Rojo: checkbox activo por defecto.</p></div></section>`;
}
function showCaptureModule(n){
 const m=SRRC_CONFIG.modules.find(x=>x.module===n),el=document.getElementById('captureApp');
 el.innerHTML=`<div class="page-heading"><div><button class="nav-control" onclick="renderCaptureHome()">←</button><h1>Módulo ${n} · ${capEsc(m.title)}</h1><p>Selecciona la hoja que deseas revisar o capturar.</p></div></div><div class="capture-sheet-grid">${m.sheets.map((s,i)=>`<article class="card capture-sheet-card" onclick="showCaptureSheet(${n},${i})"><span class="capture-kind ${s.kind==='bitacora'?'log':''}">${s.kind==='bitacora'?'Uso periódico':'Documento'}</span><h3>${capEsc(s.name)}</h3><p>${s.controls.length} grupos de captura</p><span class="open-arrow">Abrir →</span></article>`).join('')}</div>`;
}
function showCaptureSheet(n,i){
 const m=SRRC_CONFIG.modules.find(x=>x.module===n),s=m.sheets[i],el=document.getElementById('captureApp');
 el.innerHTML=`<div class="page-heading"><div><button class="nav-control" onclick="showCaptureModule(${n})">←</button><h1>${capEsc(s.name)}</h1><p>${s.kind==='bitacora'?'Plantilla reutilizable para registros periódicos':'Documento para integración a carpeta física'}</p></div><button class="primary-button" onclick="capSave();capToast('Captura guardada')">Guardar</button></div>
 ${s.kind==='bitacora'?`<section class="card periodic-banner"><div><strong>Bitácora de uso frecuente</strong><p>Cada uso puede crear un registro independiente sin modificar la plantilla.</p></div><button class="primary-button" onclick="newPeriodicRecord('${capAttr(s.name)}')">+ Nuevo registro</button></section>`:''}
 <section class="capture-form">${s.controls.map(renderCaptureControl).join('')}</section>`;
 hydrateCapture();
}
function renderCaptureControl(c){
 const coord=`<small class="excel-ref">${capEsc(c.range||c.excelCell||c.id)}</small>`;
 if(c.type==='masterData')return `<article class="capture-field master-field"><label>${capEsc(c.label||'Datos Maestros')}${coord}</label>${(c.fields||[]).map(f=>`<div class="master-inline"><span>${masterLabel(f)}</span><input data-cap-key="master.${f}" value="${capAttr(masterValue(f))}"></div>`).join('')}</article>`;
 if(c.type==='image')return `<article class="capture-field"><label>${capEsc(c.label||'Imagen')}${coord}</label><label class="image-drop"><input type="file" accept="image/*" data-cap-key="${c.id}"><span>＋</span><strong>Agregar imagen</strong><small>Fotografía, mapa, croquis o evidencia</small></label></article>`;
 if(c.type==='checkbox')return `<article class="capture-field"><label>Lista de verificación${coord}</label><label class="check-control"><input type="checkbox" checked data-cap-key="${c.id}"><span>${capEsc(c.label||'Activo')}</span></label></article>`;
 if(c.type==='status')return `<article class="capture-field"><label>${capEsc(c.label||'Estado')}${coord}</label><div class="status-selector" data-cap-key="${c.id}">${(c.options||['✓','✗','NL']).map((o,j)=>`<button type="button" class="${j===0?'active':''}" onclick="selectCapStatus(this,'${c.id}','${capAttr(o)}')">${capEsc(o)}</button>`).join('')}</div><small class="field-help">✓ Cumple · ✗ No cumple · NL No laboró</small></article>`;
 const isDate=c.type==='date'||/fecha/i.test(c.label||'');
 const isLong=c.type==='textarea'||String(c.label||'').length>70;
 return `<article class="capture-field"><label>${capEsc(c.label||'Dato de captura')}${coord}</label>${isLong?`<textarea data-cap-key="${c.id}" placeholder="Captura la información..."></textarea>`:`<input type="${isDate?'date':'text'}" data-cap-key="${c.id}" placeholder="${isDate?'dd/mm/aaaa':'Captura la información'}">`}</article>`;
}
function hydrateCapture(){document.querySelectorAll('[data-cap-key]').forEach(el=>{const k=el.dataset.capKey;if(k.startsWith('master.')){el.onchange=()=>{CAPTURE_STORE[k]=el.value;capSave()};return}if(CAPTURE_STORE[k]!==undefined){if(el.type==='checkbox')el.checked=CAPTURE_STORE[k];else if(el.tagName!=='DIV'&&el.type!=='file')el.value=CAPTURE_STORE[k]}el.onchange=()=>{CAPTURE_STORE[k]=el.type==='checkbox'?el.checked:el.value;capSave()}})}
function selectCapStatus(btn,key,val){btn.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');CAPTURE_STORE[key]=val;capSave()}
function masterLabel(f){return ({unidadProduccion:'Unidad de producción',domicilio:'Domicilio',folioSenasica:'Folio SENASICA',directorGeneral:'Director general',responsableTecnico:'Responsable técnico',auxiliarSRRC:'Auxiliar SRRC'})[f]||f}
function masterValue(f){return CAPTURE_STORE['master.'+f]??SRRC_MASTER?.empresa?.[f]?.value??SRRC_MASTER?.responsables?.[f]?.value??''}
function showCaptureMasters(){
 const el=document.getElementById('captureApp'),sections=[['Empresa',SRRC_MASTER.empresa],['Responsables permanentes',SRRC_MASTER.responsables]];
 el.innerHTML=`<div class="page-heading"><div><button class="nav-control" onclick="renderCaptureHome()">←</button><h1>Datos Maestros del motor</h1><p>Una sola captura alimenta todas las celdas verdes vinculadas.</p></div><button class="primary-button" onclick="saveCaptureMasters()">Guardar</button></div>${sections.map(([title,obj])=>`<section class="card"><h2>${title}</h2>${Object.entries(obj).map(([k,v])=>`<div class="master-edit-row"><label>${capEsc(v.label)}</label><input id="capMaster_${k}" value="${capAttr(masterValue(k))}"></div>`).join('')}</section>`).join('')}<section class="card"><h2>Personal general</h2><p class="field-help">Catálogo para seleccionar nombres en bitácoras. Las firmas variables permanecen en blanco para firma manual.</p><div class="employee-add"><input id="employeeName" placeholder="Nombre completo"><input id="employeeRole" placeholder="Puesto"><button class="primary-button" onclick="addCaptureEmployee()">Agregar</button></div><div id="employeeList">${(CAPTURE_STORE.employees||[]).map(e=>`<div class="employee-row"><span>${capEsc(e.nombre)}</span><small>${capEsc(e.puesto)}</small></div>`).join('')}</div></section>`;
}
function saveCaptureMasters(){document.querySelectorAll('[id^=capMaster_]').forEach(x=>CAPTURE_STORE['master.'+x.id.replace('capMaster_','')]=x.value);capSave();capToast('Datos Maestros guardados')}
function addCaptureEmployee(){const n=document.getElementById('employeeName').value.trim(),p=document.getElementById('employeeRole').value.trim();if(!n)return;CAPTURE_STORE.employees=CAPTURE_STORE.employees||[];CAPTURE_STORE.employees.push({nombre:n,puesto:p,activo:true});capSave();showCaptureMasters()}
function newPeriodicRecord(name){CAPTURE_STORE.records=CAPTURE_STORE.records||[];CAPTURE_STORE.records.push({id:'REG-'+Date.now(),template:name,date:new Date().toISOString().slice(0,10)});capSave();capToast('Nuevo registro creado')}
function renderLogs(){const el=document.getElementById('logsApp');if(!el||!SRRC_CONFIG)return;const rows=allSheets().filter(x=>x.sheet.kind==='bitacora');el.innerHTML=`<div class="page-heading"><div><h1>Bitácoras operativas</h1><p>Acceso frecuente a formatos que se llenarán durante la operación diaria.</p></div></div><div class="capture-sheet-grid">${rows.map(r=>`<article class="card capture-sheet-card" onclick="showView('captura');showCaptureSheet(${r.module},${r.index})"><span class="capture-kind log">Uso periódico</span><h3>${capEsc(r.sheet.name)}</h3><p>Módulo ${r.module} · ${r.sheet.controls.length} grupos de captura</p><span class="open-arrow">Capturar →</span></article>`).join('')}</div>`}
function renderMap(){const el=document.getElementById('mapApp');if(!el||!SRRC_CONFIG)return;const rows=allSheets().flatMap(x=>x.sheet.controls.map(c=>({module:x.module,sheet:x.sheet.name,...c})));el.innerHTML=`<div class="page-heading"><div><h1>Tabla de vinculación Excel</h1><p>Referencia pública para mantenimiento del portal y futuras exportaciones a Excel.</p></div><a class="primary-button" href="config/field-map.json" download>Descargar JSON</a></div><section class="card map-table-wrap"><table class="usage-matrix"><thead><tr><th>ID</th><th>Módulo</th><th>Hoja</th><th>Tipo</th><th>Etiqueta</th><th>Celda / rango</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${capEsc(r.id)}</td><td>${r.module}</td><td>${capEsc(r.sheet)}</td><td>${capEsc(r.type)}</td><td>${capEsc(r.label||'')}</td><td>${capEsc(r.range||r.excelCell||'')}</td></tr>`).join('')}</tbody></table></section>`}
function capToast(msg){let t=document.createElement('div');t.className='cap-toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}
window.addEventListener('DOMContentLoaded',initCapture);
