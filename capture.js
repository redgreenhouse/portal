let SRRC_CONFIG=null, SRRC_MASTER=null;
const CAPTURE_STORE=JSON.parse(localStorage.getItem('red_srrc_capture_v119')||'{}');
const capSave=()=>localStorage.setItem('red_srrc_capture_v119',JSON.stringify(CAPTURE_STORE));

async function initCapture(){
  try{
    const version=window.RED_PORTAL_CONFIG?.version||'1.67';
    [SRRC_CONFIG,SRRC_MASTER]=await Promise.all([
      fetch(`config/field-map.json?v=${encodeURIComponent(version)}`,{cache:'no-store'}).then(r=>r.json()),
      fetch(`config/master-data-map.json?v=${encodeURIComponent(version)}`,{cache:'no-store'}).then(r=>r.json())
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
 el.innerHTML=`<div class="page-heading"><div><h1>Captura SRRC · Módulos 2 al 10</h1><p>Los colores del Excel sólo definen el comportamiento; no aparecen en el portal.</p></div><button class="primary-button" onclick="showCaptureMasters()">Datos Maestros</button></div>
 <section class="summary-grid capture-summary"><article class="summary-card"><span>Módulos activos</span><strong>${SRRC_CONFIG.modules.length}</strong></article><article class="summary-card"><span>Hojas configuradas</span><strong>${sheets.length}</strong></article><article class="summary-card"><span>Grupos de captura</span><strong>${controls.length}</strong></article><article class="summary-card"><span>Bitácoras</span><strong>${sheets.filter(x=>x.sheet.kind==='bitacora').length}</strong></article></section>
 <section class="card"><div class="section-heading"><div><h2>Selecciona un módulo</h2><p>Motor de captura y referencias activo para todas las plantillas disponibles.</p></div></div><div class="capture-module-grid">${SRRC_CONFIG.modules.map(m=>`<button class="capture-module-card" onclick="showCaptureModule(${m.module})"><span>Módulo ${m.module}</span><strong>${capEsc(m.title)}</strong><small>${m.sheets.length} hojas</small></button>`).join('')}</div></section>
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
function masterLabel(f){const personal=String(f||'').match(/^personalNombre(\d{2})$/);if(personal)return `Personal de la unidad · Trabajador ${personal[1]}`;return ({razonSocialPropietario:'Razón social / propietario',unidadProduccion:'Unidad de producción',domicilio:'Domicilio',folioSenasica:'Folio SENASICA',directorGeneral:'Director general',responsableInocuidad:'Responsable de inocuidad',responsableTecnico:'Responsable técnico',auxiliarSRRC:'Auxiliar SRRC',firmaElaboroNombre:'Elaboró · Nombre completo',firmaElaboroCargo:'Elaboró · Cargo',firmaRevisoNombre:'Revisó · Nombre completo',firmaRevisoCargo:'Revisó · Cargo',firmaAutorizoNombre:'Autorizó · Nombre completo',firmaAutorizoCargo:'Autorizó · Cargo'})[f]||f}
function masterValue(f){return CAPTURE_STORE['master.'+f]??SRRC_MASTER?.empresa?.[f]?.value??SRRC_MASTER?.responsables?.[f]?.value??''}
function showCaptureMasters(){
 const el=document.getElementById('captureApp'),sections=[['Empresa',SRRC_MASTER.empresa],['Responsables permanentes',SRRC_MASTER.responsables]];
 el.innerHTML=`<div class="page-heading"><div><button class="nav-control" onclick="renderCaptureHome()">←</button><h1>Datos Maestros del motor</h1><p>Una sola captura alimenta todas las celdas verdes vinculadas.</p></div><button class="primary-button" onclick="saveCaptureMasters()">Guardar</button></div>${sections.map(([title,obj])=>`<section class="card"><h2>${title}</h2>${Object.entries(obj).map(([k,v])=>`<div class="master-edit-row"><label>${capEsc(v.label)}</label><input id="capMaster_${k}" value="${capAttr(masterValue(k))}"></div>`).join('')}</section>`).join('')}<section class="card"><h2>Personal general</h2><p class="field-help">Catálogo para seleccionar nombres en bitácoras. Las firmas variables permanecen en blanco para firma manual.</p><div class="employee-add"><input id="employeeName" placeholder="Nombre completo"><input id="employeeRole" placeholder="Puesto"><button class="primary-button" onclick="addCaptureEmployee()">Agregar</button></div><div id="employeeList">${(CAPTURE_STORE.employees||[]).map(e=>`<div class="employee-row"><span>${capEsc(e.nombre)}</span><small>${capEsc(e.puesto)}</small></div>`).join('')}</div></section>`;
}
function saveCaptureMasters(){document.querySelectorAll('[id^=capMaster_]').forEach(x=>CAPTURE_STORE['master.'+x.id.replace('capMaster_','')]=x.value);capSave();capToast('Datos Maestros guardados')}
function addCaptureEmployee(){const n=document.getElementById('employeeName').value.trim(),p=document.getElementById('employeeRole').value.trim();if(!n)return;CAPTURE_STORE.employees=CAPTURE_STORE.employees||[];CAPTURE_STORE.employees.push({nombre:n,puesto:p,activo:true});capSave();showCaptureMasters()}
function newPeriodicRecord(name){CAPTURE_STORE.records=CAPTURE_STORE.records||[];CAPTURE_STORE.records.push({id:'REG-'+Date.now(),template:name,date:new Date().toISOString().slice(0,10)});capSave();capToast('Nuevo registro creado')}
function renderLogs(){const el=document.getElementById('logsApp');if(!el||!SRRC_CONFIG)return;const rows=allSheets().filter(x=>x.sheet.kind==='bitacora');el.innerHTML=`<div class="page-heading"><div><h1>Bitácoras operativas</h1><p>Acceso frecuente a formatos que se llenarán durante la operación diaria.</p></div></div><div class="capture-sheet-grid">${rows.map(r=>`<article class="card capture-sheet-card" onclick="showView('captura');showCaptureSheet(${r.module},${r.index})"><span class="capture-kind log">Uso periódico</span><h3>${capEsc(r.sheet.name)}</h3><p>Módulo ${r.module} · ${r.sheet.controls.length} grupos de captura</p><span class="open-arrow">Capturar →</span></article>`).join('')}</div>`}
function renderMap(){
 const el=document.getElementById('mapApp');if(!el||!SRRC_CONFIG)return;
 const storageKey='redGreenhouseExcelReferences';
 let saved={};try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}')}catch(_err){}
 function controlSource(c){
  const row=Number((String(c.range||c.excelCell||'').match(/\d+/)||[])[0]||0);
  if(c.type==='masterData'&&/^firma/i.test(String(c.field||'')))return 'Firma / pie de página';
  if(c.type==='masterData'&&row>0&&row<=6)return 'Cabecera';
  return 'Campo de captura';
 }
 const controlRows=allSheets().flatMap(x=>x.sheet.controls.map(c=>({
  module:x.module,moduleTitle:x.moduleTitle,sheet:x.sheet.displayName||x.sheet.name,exactSheet:x.sheet.name,
  id:c.id,type:c.type,label:c.label||'',concept:c.label||'',target:saved[c.id]||c.range||c.excelCell||'',source:controlSource(c)
 })));
 const headerRows=allSheets().flatMap(x=>(x.sheet.headerMappings||[]).map((h,i)=>({
  module:x.module,moduleTitle:x.moduleTitle,sheet:x.sheet.displayName||x.sheet.name,exactSheet:x.sheet.name,
  id:`M${x.module}.HEADER.${x.index+1}.${h.concept}`,type:h.type||'masterData',label:h.label||h.concept,concept:h.concept,
  target:saved[`M${x.module}.HEADER.${x.index+1}.${h.concept}`]||h.cell||'',source:'Cabecera'
 })));
 const rows=[...headerRows,...controlRows];
 const modules=[...new Set(rows.map(r=>r.module))].sort((a,b)=>a-b);
 const sheets=[...new Map(rows.map(r=>[`${r.module}|||${r.exactSheet}`,{module:r.module,name:r.exactSheet}])).values()]
  .sort((a,b)=>a.module-b.module||a.name.localeCompare(b.name,'es'));
 el.innerHTML=`<div class="page-heading"><div><h1>Referencias Excel</h1><p>Mapeo agrupado por módulo. Busca un concepto o selecciona una hoja para localizar sus referencias.</p></div><div style="display:flex;gap:10px"><button class="ghost-button" id="resetExcelReferences">Restaurar originales</button><button class="primary-button" id="saveExcelReferences">Guardar referencias</button></div></div>
 <section class="card mapping-toolbar"><label>Buscar por concepto u hoja<input id="excelReferenceSearch" type="search" placeholder="Ej. Folio SENASICA, PORTADA, versión..."></label><label>Módulo<select id="excelReferenceModule"><option value="">Todos</option>${modules.map(m=>`<option value="${m}">Módulo ${m}</option>`).join('')}</select></label><label>Hoja<select id="excelReferenceSheet"><option value="">Todas</option></select></label><span id="excelReferenceCount"></span></section>
 <section class="card" style="padding:16px;margin-bottom:16px"><strong>Regla de seguridad</strong><p style="margin:6px 0 0">Solamente puede modificarse la celda o rango destino. El módulo, la hoja, el concepto y el tipo permanecen protegidos.</p></section>
 <div id="excelReferenceGroups">${modules.map(m=>{const mr=rows.filter(r=>r.module===m);return `<section class="card map-module-group" data-map-module="${m}"><div class="map-module-heading"><div><h2>Módulo ${m} · ${capEsc(mr[0]?.moduleTitle||'')}</h2><p>${mr.length} referencias</p></div></div><div class="map-table-wrap"><table class="usage-matrix"><thead><tr><th>Concepto</th><th>Hoja exacta del Excel</th><th>Origen</th><th>Tipo</th><th>Celda / rango destino</th></tr></thead><tbody>${mr.map(r=>`<tr data-map-row data-map-sheet="${capAttr(r.exactSheet)}" data-search="${capAttr(`${r.concept} ${r.label} ${r.sheet} ${r.exactSheet} ${r.type} M${r.module}`.toLowerCase())}"><td><strong>${capEsc(r.label||r.concept)}</strong><small class="map-field-id">${capEsc(r.id)}</small></td><td>${capEsc(r.sheet)}</td><td>${capEsc(r.source)}</td><td>${capEsc(r.type)}</td><td><input class="excel-reference-input" data-reference-id="${capAttr(r.id)}" value="${capAttr(r.target)}" spellcheck="false"></td></tr>`).join('')}</tbody></table></div></section>`}).join('')}</div><p class="save-message" id="excelReferenceMessage"></p>`;
 const valid=/^[A-Z]{1,3}[1-9]\d*(?::[A-Z]{1,3}[1-9]\d*)?$/;
 const search=document.getElementById('excelReferenceSearch'),moduleFilter=document.getElementById('excelReferenceModule'),sheetFilter=document.getElementById('excelReferenceSheet'),count=document.getElementById('excelReferenceCount');
 function refreshSheetOptions(){const mod=moduleFilter.value,previous=sheetFilter.value,available=sheets.filter(s=>!mod||String(s.module)===mod);sheetFilter.innerHTML=`<option value="">Todas</option>${available.map(s=>`<option value="${capAttr(`${s.module}|||${s.name}`)}">${mod?capEsc(s.name):`Módulo ${s.module} · ${capEsc(s.name)}`}</option>`).join('')}`;if(available.some(s=>`${s.module}|||${s.name}`===previous))sheetFilter.value=previous;}
 function applyFilter(){const q=search.value.trim().toLowerCase(),mod=moduleFilter.value,sheet=sheetFilter.value;let visible=0;el.querySelectorAll('[data-map-module]').forEach(group=>{let groupVisible=0;group.querySelectorAll('[data-map-row]').forEach(row=>{const rowSheet=`${group.dataset.mapModule}|||${row.dataset.mapSheet}`,show=(!q||row.dataset.search.includes(q))&&(!mod||group.dataset.mapModule===mod)&&(!sheet||rowSheet===sheet);row.hidden=!show;if(show){visible++;groupVisible++;}});group.hidden=groupVisible===0;});count.textContent=`${visible} referencia${visible===1?'':'s'}`;}
 search.addEventListener('input',applyFilter);moduleFilter.addEventListener('change',()=>{refreshSheetOptions();applyFilter()});sheetFilter.addEventListener('change',applyFilter);refreshSheetOptions();applyFilter();
 document.getElementById('saveExcelReferences').addEventListener('click',()=>{
  const next={};let bad=null;
  el.querySelectorAll('[data-reference-id]').forEach(input=>{const value=input.value.trim().toUpperCase();input.value=value;if(value&&!valid.test(value)&&!bad)bad=input;next[input.dataset.referenceId]=value;});
  const msg=document.getElementById('excelReferenceMessage');
  if(bad){bad.focus();msg.textContent='Referencia inválida. Usa formatos como H66 o C16:Q40.';return;}
  localStorage.setItem(storageKey,JSON.stringify(next));msg.textContent='Referencias guardadas como mapa activo. Se usarán en la siguiente generación del Excel.';
 });
 document.getElementById('resetExcelReferences').addEventListener('click',()=>{if(confirm('¿Restaurar todas las referencias originales del archivo de configuración?')){localStorage.removeItem(storageKey);renderMap();}});
}
function capToast(msg){let t=document.createElement('div');t.className='cap-toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}
window.addEventListener('DOMContentLoaded',initCapture);
