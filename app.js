const titles = {
  inicio:"Centro de control",
  srrc:"Certificaciones · SRRC",
  produccion:"Producción",
  inventarios:"Inventarios",
  calidad:"Calidad",
  "otras-certificaciones":"Otras certificaciones",
  mantenimiento:"Mantenimiento",
  personal:"Personal",
  configuracion:"Configuración"
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
  document.getElementById(btn.dataset.toggle).classList.toggle("open");
  btn.classList.toggle("open");
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
    const card=document.createElement("article");
    card.className=`module-card ${m.state}`;
    card.innerHTML=`
      <div class="module-top">
        <span class="module-number">${m.number}</span>
        <span class="tag ${m.state==="received"?"green":"gray"}">${m.priority}</span>
      </div>
      <h4>${m.name}</h4>
      <div class="module-meta"><span>${m.documents} documentos</span><span>${m.state==="received"?"Recibido":"Pendiente"}</span></div>
      <div class="module-state">${m.state==="received"?"Ver detalle →":"Archivo por recibir"}</div>`;
    card.addEventListener("click",()=>showModuleDetail(m));
    moduleGrid.appendChild(card);
  });
}
function showModuleDetail(m){
  const detail=document.getElementById("moduleDetail");
  detail.innerHTML=`
    <strong>Módulo ${m.number} · ${m.name}</strong>
    <span>Estado: ${m.state==="received"?"Recibido para diagnóstico":"Pendiente de recibir"}</span>
    <span>Documentos detectados: ${m.documents}</span>
    <span>Prioridad: ${m.priority}</span>
    <span>${m.state==="received"?"Siguiente paso: inventariar documentos, responsables y evidencias.":"Siguiente paso: incorporar el archivo del módulo."}</span>`;
  detail.scrollIntoView({behavior:"smooth",block:"center"});
}
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  renderModules(btn.dataset.filter);
}));
renderModules();
