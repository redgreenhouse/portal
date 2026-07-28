const titles = {
  inicio:"Centro de control", srrc:"Certificaciones · SRRC", modulo2:"SRRC · Módulo 2",
  produccion:"Producción", inventarios:"Inventarios", calidad:"Calidad",
  "otras-certificaciones":"Otras certificaciones", mantenimiento:"Mantenimiento",
  personal:"Personal", configuracion:"Configuración"
};

function showView(id){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));
  document.querySelectorAll("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
  document.getElementById("pageTitle").textContent=titles[id]||"Portal de Gestión";
  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-view]").forEach(btn=>btn.addEventListener("click",()=>showView(btn.dataset.view)));
document.querySelectorAll("[data-toggle]").forEach(btn=>btn.addEventListener("click",()=>{
  document.getElementById(btn.dataset.toggle).classList.toggle("open"); btn.classList.toggle("open");
}));
document.getElementById("menuButton").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("printButton").addEventListener("click",()=>window.print());

const effortTable=document.getElementById("effortTable");
RED_DATA.effort.forEach(row=>{
  const tr=document.createElement("tr");
  tr.innerHTML=`<td><strong>${row[0]}</strong></td><td>${row[1]}</td><td>${row[2]}</td><td><span class="effort ${row[3].toLowerCase()}">${row[3]}</span></td>`;
  effortTable.appendChild(tr);
});

const moduleGrid=document.getElementById("moduleGrid");
function renderModules(filter="all"){
  moduleGrid.innerHTML="";
  RED_DATA.modules.filter(m=>filter==="all"||m.state===filter).forEach(m=>{
    const card=document.createElement("article"); card.className=`module-card ${m.state}`;
    card.innerHTML=`<div class="module-top"><span class="module-number">${m.number}</span><span class="tag ${m.state==="received"?"green":"gray"}">${m.priority}</span></div>
      <h4>${m.name}</h4><div class="module-meta"><span>${m.documents} documentos</span><span>${m.state==="received"?"Recibido":"Pendiente"}</span></div>
      <div class="module-state">${m.number===2?"Abrir expediente →":m.state==="received"?"Ver resumen →":"Archivo por recibir"}</div>`;
    card.addEventListener("click",()=>m.number===2?showView("modulo2"):showModuleDetail(m)); moduleGrid.appendChild(card);
  });
}
function showModuleDetail(m){
  const detail=document.getElementById("moduleDetail");
  detail.innerHTML=`<strong>Módulo ${m.number} · ${m.name}</strong><span>Estado: ${m.state==="received"?"Recibido para diagnóstico":"Pendiente de recibir"}</span><span>Documentos detectados: ${m.documents}</span><span>Prioridad: ${m.priority}</span><span>${m.state==="received"?"Este módulo se desarrollará después del Módulo 2.":"Siguiente paso: incorporar el archivo del módulo."}</span>`;
  detail.scrollIntoView({behavior:"smooth",block:"center"});
}
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); renderModules(btn.dataset.filter);
}));
renderModules();

const riskLabels={high:"Alto",medium:"Medio",low:"Bajo"};
const module2Documents=document.getElementById("module2Documents");
function renderModule2Documents(filter="all"){
  module2Documents.innerHTML="";
  RED_DATA.module2.filter(d=>filter==="all"||d.risk===filter).forEach((d,index)=>{
    const row=document.createElement("button"); row.className="document-row";
    row.innerHTML=`<span class="doc-index">${String(index+1).padStart(2,"0")}</span><span class="doc-main"><strong>${d.title}</strong><small>${d.code} · ${d.type}</small></span><span class="risk-badge ${d.risk}">Riesgo ${riskLabels[d.risk]}</span><span class="doc-effort">${d.effort}</span><span class="doc-arrow">→</span>`;
    row.addEventListener("click",()=>showDocument(d,row)); module2Documents.appendChild(row);
  });
}
function previewHtml(d){
  const fieldRows=d.fields.map(f=>`<div class="form-field"><label>${f}</label><div class="blank-value">Pendiente de capturar</div></div>`).join("");
  if(d.preview==="schedule") return `<div class="html-document"><div class="doc-sheet-header"><span>RED Greenhouse</span><strong>Programa de Mantenimiento Preventivo</strong><small>DOC-2.3 · Versión pendiente</small></div><table class="preview-table"><thead><tr><th>Instalación / equipo</th><th>Frecuencia</th><th>Ene</th><th>Feb</th><th>Mar</th><th>Abr</th><th>Indicador</th></tr></thead><tbody><tr><td>Cerco perimetral</td><td>Quincenal</td><td>—</td><td>—</td><td>—</td><td>—</td><td>Sin rupturas, maleza o basura</td></tr><tr><td>Sanitarios</td><td>Quincenal</td><td>—</td><td>—</td><td>—</td><td>—</td><td>Sin fugas; equipo funcional</td></tr><tr><td>Fosa séptica</td><td>Mensual</td><td>—</td><td>—</td><td>—</td><td>—</td><td>Sin derrames ni escurrimientos</td></tr><tr><td>Fumigadora</td><td>Semestral</td><td>—</td><td>—</td><td>—</td><td>—</td><td>Sin fugas ni deterioro</td></tr></tbody></table><p class="preview-note">Vista resumida. El formato final conservará todos los meses, instalaciones e indicadores del archivo fuente.</p></div>`;
  if(d.preview==="risk") return `<div class="html-document"><div class="doc-sheet-header"><span>RED Greenhouse</span><strong>Análisis de Peligros</strong><small>${d.code}</small></div><table class="preview-table"><thead><tr><th>Área</th><th>Peligro</th><th>Probabilidad</th><th>Severidad</th><th>Control</th></tr></thead><tbody><tr><td>Por definir</td><td>Por identificar en inspección</td><td>—</td><td>—</td><td>—</td></tr><tr><td>Por definir</td><td>Por identificar en inspección</td><td>—</td><td>—</td><td>—</td></tr></tbody></table></div>`;
  if(d.preview==="action"||d.preview==="log") return `<div class="html-document"><div class="doc-sheet-header"><span>RED Greenhouse</span><strong>${d.title}</strong><small>${d.code}</small></div><table class="preview-table"><thead><tr><th>Fecha</th><th>Área / hallazgo</th><th>Acción</th><th>Responsable</th><th>Cierre</th></tr></thead><tbody><tr><td>—</td><td>Pendiente</td><td>Pendiente</td><td>Por asignar</td><td>—</td></tr><tr><td>—</td><td>Pendiente</td><td>Pendiente</td><td>Por asignar</td><td>—</td></tr></tbody></table></div>`;
  if(d.preview==="org") return `<div class="html-document"><div class="doc-sheet-header"><span>RED Greenhouse</span><strong>Organigrama</strong><small>DOC-2.4</small></div><div class="org-chart"><div>Dirección General<br><small>Eduardo Romero Maní</small></div><span>↓</span><div>Responsable Técnico<br><small>Christian Nieto · apellido pendiente</small></div><span>↓</span><div>Responsable de Inocuidad<br><small>Por confirmar</small></div><span>↓</span><div>Operación de campo<br><small>Por definir</small></div></div></div>`;
  if(d.preview==="map"||d.preview==="layout") return `<div class="html-document"><div class="doc-sheet-header"><span>RED Greenhouse</span><strong>${d.title}</strong><small>${d.code}</small></div><div class="map-placeholder"><div>Vista cartográfica pendiente</div><small>Se incorporará el mapa o croquis real de la unidad de producción.</small></div><div class="field-grid">${fieldRows}</div></div>`;
  return `<div class="html-document"><div class="doc-sheet-header"><span>RED Greenhouse</span><strong>${d.title}</strong><small>${d.code}</small></div><div class="field-grid">${fieldRows}</div></div>`;
}
function showDocument(d,row){
  document.querySelectorAll(".document-row").forEach(r=>r.classList.remove("selected")); row.classList.add("selected");
  const viewer=document.getElementById("documentViewer"); viewer.className="document-viewer";
  viewer.innerHTML=`<div class="viewer-heading"><div><p class="eyebrow">${d.id} · ${d.type}</p><h3>${d.title}</h3></div><span class="risk-badge ${d.risk}">Riesgo ${riskLabels[d.risk]}</span></div>
    <div class="document-metadata"><div><span>Acción requerida</span><strong>${d.action}</strong></div><div><span>Frecuencia</span><strong>${d.frequency}</strong></div><div><span>Esfuerzo</span><strong>${d.effort}</strong></div><div><span>Estado</span><strong>${d.status}</strong></div></div>
    <p class="document-description">${d.description}</p>${previewHtml(d)}
    <div class="source-note"><strong>Nota:</strong> esta vista HTML interpreta el contenido del Excel recibido. Todavía no es el documento oficial ni sustituye la revisión y aprobación técnica.</div>`;
  document.getElementById("documentViewerPanel").scrollIntoView({behavior:"smooth",block:"start"});
}
document.querySelectorAll(".doc-filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".doc-filter").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); renderModule2Documents(btn.dataset.docFilter);
}));
renderModule2Documents();
