/* Módulo 2: documento HTML vivo. Conserva la transcripción del Excel e incrusta controles sólo en las celdas marcadas. */
const M2_SHEET_NAME_BY_CODE={
  'PORTADA':'PORTADA','POE MTTO INFRAESTR':'POE MTTO INFRAESTR','ANÁLISIS DESCRIPTIVO':'ANALISIS DE PELIGRO DESCRIP',
  'PLAN DE ACCIÓN':'ANALISIS DE PEL ACCIO','MAPA 2.1':'MAPAS GEOREFERENCIACION 2.1','MAPA 2.1.1':'MAPAS GEOREFERENCIACION 2.1.1.',
  'MAPA 2.1.2':'MAPA POLIONOS  2.1.2.','CROQUIS 2.2':'CROQUIS DE INSTALACIONES 2.2','DOC-2.3 FRENTE':'BITACORA 2.3 FRENTE.',
  'DOC-2.3 REVERSO':'BITACORA 2.3 ATRAS','DOC-2.4':'ORGANIGRAMA 2.4','DOC-2.5':'PERFIL DE PUESTOS 2.5'
};
const M2_IMAGE_RANGES={
 'PORTADA':['A1:C7'],'POE MTTO INFRAESTR':['A1:C7'],'ANÁLISIS DESCRIPTIVO':['A1:G5'],'PLAN DE ACCIÓN':['A1:C5'],
 'MAPA 2.1':['A2:G6','B10:AV35'],'MAPA 2.1.1':['A2:G6','B10:AV35'],'MAPA 2.1.2':['A2:B6','C16:Q40'],
 'CROQUIS 2.2':['B2:H6','B8:AX38'],'DOC-2.3 FRENTE':['A1:G5'],'DOC-2.3 REVERSO':['A1:G5'],
 'DOC-2.4':['A1:G5','A7:AW32'],'DOC-2.5':['A1:G5','C10:G15','C25:G30','C40:G45']
};
const M2_STORE_KEY='redGreenhouseM2Embedded';
let m2EmbeddedValues=JSON.parse(localStorage.getItem(M2_STORE_KEY)||'{}');
function m2Save(){localStorage.setItem(M2_STORE_KEY,JSON.stringify(m2EmbeddedValues));}
function m2Replica(doc){return (typeof MODULE2_REPLICAS!=='undefined'&&MODULE2_REPLICAS[doc.code])||'';}
function m2MasterValue(field){
 const key=masterKey(field); return String(masterValues[key]||'').trim();
}
function m2RenderDocument(doc){
 const replica=m2Replica(doc);
 if(!replica)return '<p class="empty-value">No se encontró la transcripción HTML de esta hoja.</p>';
 return `<div class="living-document-toolbar"><div><b>Documento vivo</b><span>Captura directamente en el contexto del formato original.</span></div><button type="button" class="ghost-button m2-design-toggle">Ver referencias</button></div><div class="living-document" data-m2-code="${esc(doc.code)}">${replica}</div>`;
}
function m2ParseCell(cell){const m=/^([A-Z]+)(\d+)$/.exec(cell);if(!m)return null;let col=0;for(const ch of m[1])col=col*26+ch.charCodeAt(0)-64;return {col,row:Number(m[2])};}
function m2CellsInRange(root,range){
 const [a,b=a]=range.split(':'),pa=m2ParseCell(a),pb=m2ParseCell(b);if(!pa||!pb)return [];
 return [...root.querySelectorAll('[data-cell]')].filter(el=>{const p=m2ParseCell(el.dataset.cell);return p&&p.col>=pa.col&&p.col<=pb.col&&p.row>=pa.row&&p.row<=pb.row;});
}
function m2TopCell(root,range){return root.querySelector(`[data-cell="${range.split(':')[0]}"]`);}
function m2ReplaceMasterText(root){
 const replacements=[
  {tests:[/RANCHO PEREZ PEREZ/i],field:'Nombre de la unidad de producción',fallback:'RED Greenhouse'},
  {tests:[/PARAJE LA PARCELA/i],field:'Domicilio de la unidad',fallback:'Domicilio pendiente'},
  {tests:[/^UP\d+/i],field:'Folio SENASICA',fallback:'Folio pendiente'},
  {tests:[/SUGEILI PEREZ ALVARADO/i],field:'Alta Dirección',fallback:'Eduardo Romero Mani'}
 ];
 root.querySelectorAll('[data-cell]').forEach(cell=>{
  const txt=cell.textContent.trim();if(!txt)return;
  const item=replacements.find(r=>r.tests.some(t=>t.test(txt)));if(!item)return;
  const value=m2MasterValue(item.field)||item.fallback;
  cell.innerHTML=`<span class="embedded-master" title="Dato Maestro: ${item.field}">${esc(value)}</span>`;
  cell.dataset.m2Master=item.field;
 });
}
function m2AddImages(root,doc){
 (M2_IMAGE_RANGES[doc.code]||[]).forEach((range,index)=>{
  const cells=m2CellsInRange(root,range),top=m2TopCell(root,range);if(!top)return;
  cells.forEach(c=>c.classList.add('m2-image-region'));
  const key=`${doc.code}|image|${index}`,stored=m2EmbeddedValues[key]||'';
  if(index===0){
   top.innerHTML=`<div class="embedded-logo-slot"><img src="assets/logo-red-greenhouse.png" alt="RED Greenhouse"><small data-m2-ref>${range}</small></div>`;
  }else{
   top.innerHTML=`<label class="embedded-image-input"><input type="file" accept="image/*" data-m2-image="${esc(key)}"><span>${stored?'Imagen seleccionada: '+esc(stored):'＋ Agregar imagen'}</span><small data-m2-ref>${range}</small></label>`;
  }
 });
}
function m2AddControls(root,doc){
 const sheetName=M2_SHEET_NAME_BY_CODE[doc.code]||doc.code;
 const controls=(typeof MODULE2_ANNOTATIONS!=='undefined'&&MODULE2_ANNOTATIONS[sheetName])||[];
 controls.forEach(item=>{
  const cell=m2TopCell(root,item.cell);if(!cell)return;
  const key=`${doc.code}|${item.cell}`;
  if(item.type==='text'){
   const current=Object.prototype.hasOwnProperty.call(m2EmbeddedValues,key)?m2EmbeddedValues[key]:(item.value||'');
   const isDate=/fecha/i.test(item.value||cell.textContent||'');
   cell.innerHTML=`<div class="embedded-control-wrap"><input class="embedded-text" data-m2-input="${esc(key)}" type="${isDate?'date':'text'}" value="${esc(String(current))}" placeholder="Capturar…"><small data-m2-ref>${item.cell}</small></div>`;
   cell.classList.add('m2-editable-cell');
  }else if(item.type==='status'){
   const current=m2EmbeddedValues[key]||'✓';
   cell.innerHTML=`<button type="button" class="embedded-status status-${current==='✓'?'yes':current==='✗'?'no':'nl'}" data-m2-status="${esc(key)}" title="Clic para cambiar: ✓, ✗, NL"><span>${current}</span><small data-m2-ref>${item.cell}</small></button>`;
   cell.classList.add('m2-editable-cell','m2-status-cell');
  }
 });
}
function m2Bind(root){
 root.querySelectorAll('[data-m2-input]').forEach(el=>el.addEventListener('input',()=>{m2EmbeddedValues[el.dataset.m2Input]=el.value;m2Save();}));
 root.querySelectorAll('[data-m2-status]').forEach(btn=>btn.addEventListener('click',()=>{
  const seq=['✓','✗','NL'],key=btn.dataset.m2Status,next=seq[(seq.indexOf(m2EmbeddedValues[key]||'✓')+1)%seq.length];m2EmbeddedValues[key]=next;m2Save();
  btn.querySelector('span').textContent=next;btn.classList.remove('status-yes','status-no','status-nl');btn.classList.add(next==='✓'?'status-yes':next==='✗'?'status-no':'status-nl');
 }));
 root.querySelectorAll('[data-m2-image]').forEach(el=>el.addEventListener('change',()=>{const name=el.files[0]?.name||'';m2EmbeddedValues[el.dataset.m2Image]=name;m2Save();el.nextElementSibling.textContent=name?'Imagen seleccionada: '+name:'＋ Agregar imagen';}));
}
function m2EnhanceOpenDocument(detail,doc){
 const root=detail.querySelector(`.living-document[data-m2-code="${CSS.escape(doc.code)}"]`);if(!root)return;
 m2ReplaceMasterText(root);m2AddImages(root,doc);m2AddControls(root,doc);m2Bind(root);
 const toggle=detail.querySelector('.m2-design-toggle');if(toggle)toggle.addEventListener('click',()=>{root.classList.toggle('show-m2-refs');toggle.textContent=root.classList.contains('show-m2-refs')?'Ocultar referencias':'Ver referencias';});
}
