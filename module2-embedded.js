/* Módulo 2: documento HTML vivo. Conserva la transcripción del Excel e incrusta controles sólo en las celdas marcadas. */
const M2_SHEET_NAME_BY_CODE={
  'PORTADA':'PORTADA','POE MTTO INFRAESTR':'POE MTTO INFRAESTR','ANÁLISIS DESCRIPTIVO':'ANALISIS DE PELIGRO DESCRIP  ',
  'PLAN DE ACCIÓN':'ANALISIS DE PEL ACCIO','MAPA 2.1':'MAPAS GEOREFERENCIACION 2.1','MAPA 2.1.1':'MAPAS GEOREFERENCIACION 2.1.1.',
  'MAPA 2.1.2':'MAPA POLIGONOS  2.1.2.','CROQUIS 2.2':'CROQUIS DE INSTALACIONES 2.2','DOC-2.3 FRENTE':'BITACORA 2.3 FRENTE.',
  'DOC-2.3 REVERSO':'BITACORA 2.3 ATRAS ','DOC-2.4':'ORGANIGRAMA 2.4','DOC-2.5':'PERFIL DE PUESTOS 2.5'
};
const M2_REFERENCE_STORE_KEY='redGreenhouseExcelReferences';
function m2Reference(id,fallback){
 try{
  const refs=JSON.parse(localStorage.getItem(M2_REFERENCE_STORE_KEY)||'{}');
  return Object.prototype.hasOwnProperty.call(refs,id)?String(refs[id]||'').trim():String(fallback||'').trim();
 }catch(_err){return String(fallback||'').trim();}
}
function m2PopulateSheet(workbook,name){
 const exact=workbook.sheet(name);if(exact)return exact;
 const wanted=String(name||'').trim();
 return workbook.sheets().find(sheet=>String(sheet.name()||'').trim()===wanted);
}
function m2ExcelJsSheet(workbook,name){
 const exact=workbook.getWorksheet(name);if(exact)return exact;
 const wanted=String(name||'').trim();
 return workbook.worksheets.find(sheet=>String(sheet.name||'').trim()===wanted);
}
const M2_IMAGE_IDS={
 'PORTADA':['M2.H01.IMG1'],'POE MTTO INFRAESTR':['M2.H02.IMG1'],'ANÁLISIS DESCRIPTIVO':['M2.H03.IMG1'],'PLAN DE ACCIÓN':['M2.H04.IMG1'],
 'MAPA 2.1':['M2.H05.IMG1','M2.H05.IMG2'],'MAPA 2.1.1':['M2.H06.IMG1','M2.H06.IMG2'],'MAPA 2.1.2':['M2.H07.IMG1','M2.H07.IMG2'],
 'CROQUIS 2.2':['M2.H08.IMG1','M2.H08.IMG2'],'DOC-2.3 FRENTE':['M2.H09.IMG1'],'DOC-2.3 REVERSO':['M2.H10.IMG1'],
 'DOC-2.4':['M2.H11.IMG1','M2.H11.IMG2'],'DOC-2.5':['M2.H12.IMG1','M2.H12.IMG2','M2.H12.IMG3','M2.H12.IMG4']
};
function m2ImageIds(code){return M2_IMAGE_IDS[code]||[];}
function m2ImageControlById(id){
 const config=typeof SRRC_CONFIG!=='undefined'?SRRC_CONFIG:null;
 const module=config?.modules?.find(item=>Number(item.module)===2);
 if(!module||!id)return null;
 for(const sheet of module.sheets||[]){
  const control=(sheet.controls||[]).find(item=>item.id===id&&item.type==='image');
  if(control)return control;
 }
 return null;
}
function m2ImageRange(code,index){
 const id=m2ImageIds(code)[index],control=m2ImageControlById(id);
 return id?m2Reference(id,control?.range||''):'';
}
const M2_STORE_KEY='redGreenhouseM2Embedded';
let m2EmbeddedValues=JSON.parse(localStorage.getItem(M2_STORE_KEY)||'{}');
const m2ImageFiles=new Map();

const M2_TRACE_FILE='M2_IMAGE_TRACE.json';
let m2ImageTrace=[];
function m2Trace(event,data={}){
 const row={time:new Date().toISOString(),event,...data};
 m2ImageTrace.push(row);
 console.log('[M2-TRACE]',row);
}
function m2DownloadTrace(){
 const blob=new Blob([JSON.stringify(m2ImageTrace,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=M2_TRACE_FILE;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}

async function m2InspectGeneratedImageLinks(buffer){
 if(typeof JSZip==='undefined')return;
 const zip=await JSZip.loadAsync(buffer);
 const parser=new DOMParser();
 const workbookXml=await zip.file('xl/workbook.xml')?.async('string');
 const workbookRelsXml=await zip.file('xl/_rels/workbook.xml.rels')?.async('string');
 if(!workbookXml||!workbookRelsXml)return;
 const wb=parser.parseFromString(workbookXml,'application/xml');
 const wr=parser.parseFromString(workbookRelsXml,'application/xml');
 const relTargets={};
 [...wr.getElementsByTagName('*')].filter(n=>n.localName==='Relationship').forEach(n=>relTargets[n.getAttribute('Id')]=n.getAttribute('Target'));
 for(const sheetNode of [...wb.getElementsByTagName('*')].filter(n=>n.localName==='sheet')){
  const name=sheetNode.getAttribute('name');
  const rid=sheetNode.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id')||sheetNode.getAttribute('r:id');
  let target=relTargets[rid]||'';
  target=target.replace(/^\/?/,'');
  const sheetPath=target.startsWith('xl/')?target:'xl/'+target.replace(/^\.\//,'');
  const sheetXml=await zip.file(sheetPath)?.async('string');
  if(!sheetXml)continue;
  const sd=parser.parseFromString(sheetXml,'application/xml');
  const drawing=[...sd.getElementsByTagName('*')].find(n=>n.localName==='drawing');
  const drawingRid=drawing?(drawing.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id')||drawing.getAttribute('r:id')):'';
  const relPath=sheetPath.replace('/worksheets/','/worksheets/_rels/')+'.rels';
  let drawingTarget='';
  const relXml=await zip.file(relPath)?.async('string');
  if(relXml&&drawingRid){
   const rd=parser.parseFromString(relXml,'application/xml');
   const rel=[...rd.getElementsByTagName('*')].find(n=>n.localName==='Relationship'&&n.getAttribute('Id')===drawingRid);
   drawingTarget=rel?.getAttribute('Target')||'';
  }
  m2Trace('xlsx-sheet-drawing',{sheet:name,sheetPath,drawingRid,drawingTarget});
 }
}

function m2Save(){
 const safe={};
 Object.entries(m2EmbeddedValues).forEach(([key,value])=>{
  if(value&&typeof value==='object'&&value.dataUrl)safe[key]={name:value.name||'',type:value.type||''};
  else safe[key]=value;
 });
 try{localStorage.setItem(M2_STORE_KEY,JSON.stringify(safe));}catch(err){console.warn('No se pudo guardar temporalmente el Módulo 2',err);}
}
function m2Replica(doc){return (typeof MODULE2_REPLICAS!=='undefined'&&MODULE2_REPLICAS[doc.code])||'';}
function m2MasterValue(field){
 const key=masterKey(field),value=masterValues[key];return value&&typeof value==='object'?'':String(value||'').trim();
}
function m2MasterImage(field){
 const value=masterValues[masterKey(field)];return value&&typeof value==='object'?value:null;
}
function m2LogoSource(){
 const logo=m2MasterImage('Logo corporativo');return {
  src:logo?.dataUrl||'assets/images/logo-redgreenhouse.png',
  url:logo?.url||logo?.imageUrl||'',
  name:logo?.name||'Logo RED Greenhouse',
  fileId:logo?.fileId||''
 };
}
function m2RenderDocument(doc){
 const replica=m2Replica(doc);
 if(!replica)return '<p class="empty-value">No se encontró la transcripción HTML de esta hoja.</p>';
 return `<div class="living-document-toolbar"><div><b>Documento vivo</b><span>Captura directamente en el contexto del formato original.</span></div></div><div class="living-document" data-m2-code="${esc(doc.code)}">${replica}</div>`;
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
 m2ImageIds(doc.code).forEach((_id,index)=>{
  const range=m2ImageRange(doc.code,index);
  const cells=m2CellsInRange(root,range),top=m2TopCell(root,range);if(!top)return;
  cells.forEach(c=>c.classList.add('m2-image-region'));
  const key=`${doc.code}|image|${index}`,stored=m2EmbeddedValues[key]||'',storedName=typeof stored==='object'?stored.name:stored;
  if(index===0){
   return;
  }else{
   const storedObj=stored&&typeof stored==='object'?stored:null;
   top.innerHTML=`<div class="embedded-image-input">${storedObj?.imageUrl?`<img class="m2-drive-preview" src="${esc(storedObj.imageUrl)}" alt="${esc(storedName||'Evidencia')}"><a href="${esc(storedObj.url||storedObj.imageUrl)}" target="_blank" rel="noopener">Ver imagen guardada</a>`:''}<input class="drive-file-input" type="file" accept="image/*" data-m2-image="${esc(key)}" hidden><button class="drive-upload-button" type="button" data-m2-upload-trigger="${esc(key)}">${storedName?'Cambiar imagen en Drive':'Subir al Drive'}</button>${storedName?`<em class="drive-file-name">${esc(storedName)}</em>`:''}<small data-m2-ref>${range}</small></div>`;
  }
 });
}
function m2EnsureCoordinateGrid(root,doc){
 if(doc.code!=='MAPA 2.1.2'||root.querySelector('.m2-coordinate-grid'))return;
 const rows=[
  [['A','E9','18.988608° -98.488697°'],['D','J9','18.987893° -98.488645°'],['G','O9','18.988337° -98.487868°']],
  [['B','E11','18.989391° -98.489109°'],['E','J11','18.988251° -98.488463°'],['H','O11','18.988573° -98.487551°']],
  [['C','E13','18.988319° -98.489547°'],['F','J13','18.988219° -98.488380°'],['I','O13','18.988684° -98.487619°']]
 ];
 const panel=document.createElement('section');panel.className='m2-coordinate-panel';
 panel.innerHTML=`<div class="m2-coordinate-title"><strong>Coordenadas geográficas del polígono</strong><span>Estos valores se escribirán en la hoja MAPA 2.1.2 del Excel.</span></div><div class="m2-coordinate-grid">${rows.flat().map(([label,cell,value])=>`<label class="m2-coordinate-item"><b>${label}</b><span data-cell="${cell}"></span></label>`).join('')}</div>`;
 root.appendChild(panel);
}
function m2AnnotationsForSheet(sheetName){
 if(typeof MODULE2_ANNOTATIONS==='undefined')return [];
 if(MODULE2_ANNOTATIONS[sheetName])return MODULE2_ANNOTATIONS[sheetName];
 const wanted=String(sheetName||'').trim().toUpperCase();
 const key=Object.keys(MODULE2_ANNOTATIONS).find(name=>String(name||'').trim().toUpperCase()===wanted);
 return key?MODULE2_ANNOTATIONS[key]:[];
}
function m2AddControls(root,doc){
 m2EnsureCoordinateGrid(root,doc);
 const sheetName=M2_SHEET_NAME_BY_CODE[doc.code]||doc.code;
 const controls=[...m2AnnotationsForSheet(sheetName)];
 if(doc.code==='MAPA 2.1.2') controls.push(...[
  ['E9',' 18.988608° -98.488697°'],['J9',' 18.987893° -98.488645°'],['O9',' 18.988337° -98.487868°'],
  ['E11',' 18.989391° -98.489109°'],['J11',' 18.988251° -98.488463°'],['O11',' 18.988573° -98.487551°'],
  ['E13',' 18.988319° -98.489547°'],['J13',' 18.988219° -98.488380°'],['O13',' 18.988684° -98.487619°']
 ].map(([cell,value])=>({cell,type:'text',value})));
 [...new Map(controls.map(x=>[x.cell,x])).values()].forEach(item=>{
  const cell=m2TopCell(root,item.cell);if(!cell)return;
  const key=`${doc.code}|${item.cell}`;
  if(item.type==='text'){
   const current=Object.prototype.hasOwnProperty.call(m2EmbeddedValues,key)?m2EmbeddedValues[key]:(item.value||'');
   if(!Object.prototype.hasOwnProperty.call(m2EmbeddedValues,key)&&item.value){m2EmbeddedValues[key]=item.value;m2Save();}
   const isDate=/fecha/i.test(item.value||cell.textContent||'');
   cell.innerHTML=`<div class="embedded-control-wrap"><input class="embedded-text" data-m2-input="${esc(key)}" type="${isDate?'date':'text'}" value="${esc(String(current))}" placeholder="Capturar…"><small data-m2-ref>${item.cell}</small></div>`;
   cell.classList.add('m2-editable-cell');
  }else if(item.type==='status'){
   const current=Object.prototype.hasOwnProperty.call(m2EmbeddedValues,key)?m2EmbeddedValues[key]:'';
   cell.innerHTML=`<button type="button" class="embedded-status ${current==='✓'?'status-yes':current==='✗'?'status-no':current==='NL'?'status-nl':'status-empty'}" data-m2-status="${esc(key)}" title="Clic para cambiar: □, ✓, ✗, NL" aria-label="Estado ${esc(item.cell)}: ${esc(current||'sin marcar')}"><span>${current||'□'}</span><small data-m2-ref>${item.cell}</small></button>`;
   cell.classList.add('m2-editable-cell','m2-status-cell');
  }
 });
}
function m2StoredImageInfoHtml(value){
 if(!value||typeof value!=='object'||!value.fileId)return '';
 const name=String(value.name||'Imagen guardada');
 const url=String(value.url||value.imageUrl||'');
 return `<span class="m2-drive-file-info" data-m2-file-info><strong>${esc(name)}</strong><small>Ruta: Images / M2 / ${esc(name)}</small>${url?`<a href="${esc(url)}" target="_blank" rel="noopener">Ver imagen</a>`:''}</span>`;
}
function m2UpgradeLegacyFileInputs(root,doc){
 const evidenceRanges=Math.max(0,m2ImageIds(doc.code).length-1);
 root.querySelectorAll('input[type="file"]:not([data-m2-image])').forEach((input,index)=>{
  // Cuando la hoja tiene áreas de evidencia, cada selector legacy se vincula al rango oficial posterior al logo.
  const imageIndex=index<evidenceRanges?index+1:null;
  const key=imageIndex!==null?`${doc.code}|image|${imageIndex}`:`${doc.code}|legacy-image|${index}`;
  const stored=m2EmbeddedValues[key];
  input.classList.add('drive-file-input');input.hidden=true;input.dataset.m2Image=key;input.removeAttribute('data-module2-file');
  const button=document.createElement('button');button.type='button';button.className='drive-upload-button';button.dataset.m2UploadTrigger=key;button.textContent=stored&&typeof stored==='object'&&stored.fileId?'Cambiar imagen':'Subir al Drive';
  input.insertAdjacentElement('afterend',button);
  if(imageIndex!==null)button.insertAdjacentHTML('afterend',m2StoredImageInfoHtml(stored));
 });
}
function m2Bind(root){
 root.querySelectorAll('[data-m2-upload-trigger]').forEach(btn=>btn.addEventListener('click',()=>{const input=root.querySelector(`[data-m2-image="${CSS.escape(btn.dataset.m2UploadTrigger)}"]`);if(input)input.click();}));
 root.querySelectorAll('[data-m2-input]').forEach(el=>el.addEventListener('input',()=>{m2EmbeddedValues[el.dataset.m2Input]=el.value;m2Save();}));
 root.querySelectorAll('[data-m2-status]').forEach(btn=>btn.addEventListener('click',()=>{
  const seq=['','✓','✗','NL'],key=btn.dataset.m2Status,current=Object.prototype.hasOwnProperty.call(m2EmbeddedValues,key)?m2EmbeddedValues[key]:'',next=seq[(seq.indexOf(current)+1)%seq.length];m2EmbeddedValues[key]=next;m2Save();
  btn.querySelector('span').textContent=next||'□';btn.setAttribute('aria-label',`Estado ${key.split('|').pop()}: ${next||'sin marcar'}`);btn.classList.remove('status-yes','status-no','status-nl','status-empty');btn.classList.add(next==='✓'?'status-yes':next==='✗'?'status-no':next==='NL'?'status-nl':'status-empty');
 }));
 root.querySelectorAll('[data-m2-image]').forEach(el=>el.addEventListener('change',async()=>{
  const file=el.files[0];if(!file)return;const key=el.dataset.m2Image,url=galleryEndpoint();
  if(!url){alert('Configura la URL de Apps Script en Administración.');return;}
  const trigger=root.querySelector(`[data-m2-upload-trigger="${CSS.escape(key)}"]`);el.disabled=true;if(trigger){trigger.disabled=true;trigger.textContent='Subiendo a Google Drive…';}
  try{
   const payload={action:'uploadImage',fileName:file.name,mimeType:file.type||'image/jpeg',base64:await fileToBase64(file),module:'M2',field:key};
   const r=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)}),j=await r.json();
   if(!j.ok)throw new Error(j.error||'No se pudo subir');
   m2EmbeddedValues[key]=j;m2Save();
   if(trigger){
    trigger.textContent='Cambiar imagen';
    const oldInfo=trigger.parentElement?.querySelector('[data-m2-file-info]')||trigger.nextElementSibling?.matches?.('[data-m2-file-info]')&&trigger.nextElementSibling;
    if(oldInfo)oldInfo.remove();
    trigger.insertAdjacentHTML('afterend',m2StoredImageInfoHtml(j));
   }
  }catch(err){alert(err.message);if(trigger)trigger.textContent='Subir al Drive';}finally{el.disabled=false;if(trigger)trigger.disabled=false;}
 }));
}

function m2SignatureData(){
 const sig=structuredValues[masterKey('Firmas de elaboración, revisión y autorización')]||{};
 return {
  elaboro:{nombre:String(sig.elaboro?.nombre||m2MasterValue('Auxiliar SRRC')||'').trim(),cargo:String(sig.elaboro?.cargo||'Auxiliar en SRRC').trim()},
  reviso:{nombre:String(sig.reviso?.nombre||m2MasterValue('Responsable técnico')||'').trim(),cargo:String(sig.reviso?.cargo||'Responsable técnico').trim()},
  autorizo:{nombre:String(sig.autorizo?.nombre||m2MasterValue('Alta Dirección')||'Eduardo Romero Mani').trim(),cargo:String(sig.autorizo?.cargo||'Director general').trim()}
 };
}
function m2AddMasterSignatures(root,doc){
 if(doc.code!=='POE MTTO INFRAESTR')return;
 const sig=m2SignatureData();
 [['B66',sig.elaboro,'Elaboró'],['E66',sig.reviso,'Revisó'],['H66',sig.autorizo,'Autorizó']].forEach(([cell,data,label])=>{
  const el=m2TopCell(root,cell);if(!el)return;
  el.innerHTML=`<div class="embedded-signature-master" title="Dato Maestro: ${label}"><strong>${esc(data.nombre||'Pendiente en Datos Maestros')}</strong><small>${esc(data.cargo)}</small></div>`;
  el.classList.add('m2-master-cell');
 });
}
const M2_HEADER_SHEET_INDEX={
 'PORTADA':1,'POE MTTO INFRAESTR':2,'ANÁLISIS DESCRIPTIVO':3,'PLAN DE ACCIÓN':4,
 'MAPA 2.1':5,'MAPA 2.1.1':6,'MAPA 2.1.2':7,'CROQUIS 2.2':8,
 'DOC-2.3 FRENTE':9,'DOC-2.3 REVERSO':10,'DOC-2.4':11,'DOC-2.5':12
};
const M2_HEADER_CONCEPT={
 empresa:'unidadProduccion',domicilio:'domicilio',folio:'folioSenasica',
 emision:'fechaEmision',version:'versionDocumento',vigencia:'vigenciaDocumento'
};
function m2HeaderReference(code,key,fallback){
 const sheetIndex=M2_HEADER_SHEET_INDEX[code],concept=M2_HEADER_CONCEPT[key];
 return sheetIndex&&concept?m2Reference(`M2.HEADER.${sheetIndex}.${concept}`,fallback):fallback;
}
const M2_HEADER_CELLS={
 'PORTADA':{empresa:'D1',domicilio:'D2',folio:'H2',emision:'I3',version:'I4',vigencia:'I5'},
 'POE MTTO INFRAESTR':{empresa:'D1',domicilio:'D2',folio:'H2',emision:'I3',version:'I4',vigencia:'I5'},
 'ANÁLISIS DESCRIPTIVO':{empresa:'H1',domicilio:'H2',folio:'AQ2',emision:'AV3',vigencia:'AV4',version:'AV5'},
 'PLAN DE ACCIÓN':{empresa:'D1',domicilio:'D2',folio:'AA2',emision:'AC3',vigencia:'AC4',version:'AC5'},
 'MAPA 2.1':{empresa:'H2',domicilio:'H3',folio:'AP3',emision:'AT4',vigencia:'AT5',version:'AT6'},
 'MAPA 2.1.1':{empresa:'H2',domicilio:'H3',folio:'AP3',emision:'AT4',vigencia:'AT5',version:'AT6'},
 'MAPA 2.1.2':{empresa:'C2',domicilio:'C3',folio:'R3',emision:'S4',vigencia:'S5',version:'S6'},
 'CROQUIS 2.2':{empresa:'I2',domicilio:'I3',folio:'AQ3',emision:'AU4',vigencia:'AU5',version:'AU6'},
 'DOC-2.3 FRENTE':{empresa:'H1',domicilio:'H2',folio:'AP2',emision:'AT3',vigencia:'AT4',version:'AT5'},
 'DOC-2.3 REVERSO':{empresa:'H1',domicilio:'H2',folio:'AP2',emision:'AT3',vigencia:'AT4',version:'AT5'},
 'DOC-2.4':{empresa:'H1',domicilio:'H2',folio:'AP2',emision:'AT3',vigencia:'AT4',version:'AT5'},
 'DOC-2.5':{empresa:'H1',domicilio:'H2',folio:'AD2',emision:'AH3',vigencia:'AH4',version:'AH5'}
};
const M2_HTML_HEADER_CELLS={
 'PORTADA':{empresa:'D1',domicilio:'D2',folio:'H1',emision:'I4',version:'I5',vigencia:'I6'},
 'POE MTTO INFRAESTR':{empresa:'D1',domicilio:'D2',folio:'H1',emision:'I4',version:'I5',vigencia:'I6'},
 'ANÁLISIS DESCRIPTIVO':{empresa:'H1',domicilio:'H2',folio:'AQ2',emision:'AV3',vigencia:'AV4',version:'AV5'},
 'PLAN DE ACCIÓN':{empresa:'D1',domicilio:'D2',folio:'AA2',emision:'AC3',vigencia:'AC4',version:'AC5'},
 'MAPA 2.1':{empresa:'H2',domicilio:'H3',folio:'AP3',emision:'AT4',vigencia:'AT5',version:'AT6'},
 'MAPA 2.1.1':{empresa:'H2',domicilio:'H3',folio:'AP3',emision:'AT4',vigencia:'AT5',version:'AT6'},
 'MAPA 2.1.2':{empresa:'C2',domicilio:'C3',folio:'R3',emision:'S4',vigencia:'S5',version:'S6'},
 'CROQUIS 2.2':{empresa:'I2',domicilio:'I3',folio:'AQ3',emision:'AU4',vigencia:'AU5',version:'AU6'},
 'DOC-2.3 FRENTE':{empresa:'H1',domicilio:'H2',folio:'AP2',emision:'AT3',vigencia:'AT4',version:'AT5'},
 'DOC-2.3 REVERSO':{empresa:'H1',domicilio:'H2',folio:'AP2',emision:'AT3',vigencia:'AT4',version:'AT5'},
 'DOC-2.4':{empresa:'H1',domicilio:'H2',folio:'AP2',emision:'AT3',vigencia:'AT4',version:'AT5'},
 'DOC-2.5':{empresa:'H1',domicilio:'H2',folio:'AD2',emision:'AH3',vigencia:'AH4',version:'AH5'}
};
function m2DisplayDate(value){
 const raw=String(value||'').trim();if(!raw)return 'Pendiente';
 const iso=raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);if(iso)return `${iso[3]}/${iso[2]}/${iso[1]}`;
 return raw;
}
function m2GetMasterHeader(){
 return {
  logo:m2LogoSource(),
  empresa:m2CurrentMaster('Nombre de la unidad de producción','unidadProduccion','RED Greenhouse'),
  domicilio:m2CurrentMaster('Domicilio de la unidad','domicilio','Domicilio pendiente'),
  folio:m2CurrentMaster('Folio SENASICA','folioSenasica','Folio pendiente'),
  emision:m2DisplayDate(m2CurrentMaster('Fecha de emisión','fechaEmision','')),
  vigencia:m2DisplayDate(m2CurrentMaster('Vigencia','vigenciaDocumento','')),
  version:m2CurrentMaster('Versión','versionDocumento','Pendiente')
 };
}
function m2HeaderSummaryHtml(values){
 const logo=values.logo;
 return `<section class="m2-live-header-summary" aria-label="Cabecera vinculada a Datos Maestros"><div class="m2-live-header-logo">${logo.url?`<a href="${esc(logo.url)}" target="_blank" rel="noopener">`:''}<img src="${esc(logo.src)}" alt="${esc(logo.name)}">${logo.url?'</a>':''}</div><div class="m2-live-header-company"><strong>${esc(values.empresa)}</strong><span>${esc(values.domicilio)}</span></div><dl><div><dt>Folio SENASICA</dt><dd>${esc(values.folio)}</dd></div><div><dt>Emisión</dt><dd>${esc(values.emision)}</dd></div><div><dt>Vigencia</dt><dd>${esc(values.vigencia)}</dd></div><div><dt>Versión</dt><dd>${esc(values.version)}</dd></div></dl></section>`;
}
function m2ApplyMasterLogo(root,doc,header){
 root.querySelectorAll('.m2-master-logo-in-grid,.m2-image-replica-header').forEach(el=>el.remove());
 const imageReplica=root.querySelector('.replica-image-drop-wrap');
 if(imageReplica){
  imageReplica.insertAdjacentHTML('afterbegin',`<div class="m2-image-replica-header">${m2HeaderSummaryHtml(header)}</div>`);
  return;
 }
 const paper=root.querySelector('.excel-paper');
 if(!paper)return;
 const logo=header.logo;
 paper.insertAdjacentHTML('afterbegin',`<div class="m2-master-logo-in-grid">${logo.url?`<a href="${esc(logo.url)}" target="_blank" rel="noopener">`:''}<img src="${esc(logo.src)}" alt="${esc(logo.name)}">${logo.url?'</a>':''}</div>`);
}
function m2ApplyLiveHeader(root,doc){
 const values=m2GetMasterHeader(),cells=M2_HTML_HEADER_CELLS[doc.code]||null;
 let applied=0;
 if(cells){
  Object.entries(cells).forEach(([concept,cell])=>{
   const el=m2TopCell(root,cell);if(!el)return;
   el.innerHTML=`<span class="embedded-master" title="Dato Maestro: ${esc(concept)}">${esc(values[concept])}</span>`;
   el.dataset.m2Header=concept;el.classList.add('m2-master-cell');applied++;
  });
 }
 m2ApplyMasterLogo(root,doc,values);
 if(!root.querySelector('.image-replica')&&applied<6)console.warn('[M2] Cabecera incompleta en Live Page',{code:doc.code,applied});
}
function m2CurrentMaster(field,captureKey,fallback=''){
 const direct=m2MasterValue(field);if(direct)return direct;
 try{const capture=JSON.parse(localStorage.getItem('red_srrc_capture_v119')||'{}');const value=capture['master.'+captureKey];if(String(value||'').trim())return String(value).trim();}catch(_err){}
 return fallback;
}
function m2ApplyHeaders(workbook){
 const values=m2GetMasterHeader();
 Object.entries(M2_HEADER_CELLS).forEach(([code,cells])=>{
  const sheet=m2PopulateSheet(workbook,M2_SHEET_NAME_BY_CODE[code]);if(!sheet)return;
  Object.entries(cells).forEach(([key,fallback])=>{
   const cell=m2HeaderReference(code,key,fallback);
   if(cell)sheet.cell(cell).value(values[key]||'');
  });
 });
}

async function m2RestoreTemplateFormulas(templateBuffer,generatedBuffer){
 if(typeof JSZip==='undefined')throw new Error('No se cargó el protector de fórmulas de Excel.');
 const [templateZip,generatedZip]=await Promise.all([JSZip.loadAsync(templateBuffer),JSZip.loadAsync(generatedBuffer)]);
 const protectedBySheet={};
 Object.entries(M2_HEADER_CELLS).forEach(([code,cells])=>{const name=M2_SHEET_NAME_BY_CODE[code];if(!name)return;protectedBySheet[name]=protectedBySheet[name]||new Set();Object.entries(cells).forEach(([key,fallback])=>{const cell=m2HeaderReference(code,key,fallback);if(cell)protectedBySheet[name].add(cell);});});
 const poeName=M2_SHEET_NAME_BY_CODE['POE MTTO INFRAESTR'];protectedBySheet[poeName]=protectedBySheet[poeName]||new Set();['B66','E66','H66'].forEach(cell=>protectedBySheet[poeName].add(cell));
 Object.entries(m2EmbeddedValues).forEach(([key,value])=>{if(!key.includes('|image|')||!value||typeof value!=='object'||!value.url)return;const [code,_image,index]=key.split('|'),name=M2_SHEET_NAME_BY_CODE[code],target=m2ImageRange(code,Number(index))?.split(':')[0];if(name&&target){protectedBySheet[name]=protectedBySheet[name]||new Set();protectedBySheet[name].add(target);}});
 const sheetPaths=Object.keys(templateZip.files).filter(path=>/^xl\/worksheets\/sheet\d+\.xml$/.test(path));
 const parser=new DOMParser(),serializer=new XMLSerializer();
 const workbookDoc=parser.parseFromString(await templateZip.file('xl/workbook.xml').async('string'),'application/xml');
 const relsDoc=parser.parseFromString(await templateZip.file('xl/_rels/workbook.xml.rels').async('string'),'application/xml');
 const relTargets=new Map([...relsDoc.getElementsByTagName('*')].filter(n=>n.localName==='Relationship').map(n=>[n.getAttribute('Id'),n.getAttribute('Target')]));
 const sheetNameByPath={};
 [...workbookDoc.getElementsByTagName('*')].filter(n=>n.localName==='sheet').forEach(n=>{const rid=n.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id')||n.getAttribute('r:id'),target=relTargets.get(rid);if(target)sheetNameByPath['xl/'+target.replace(/^\/?xl\//,'').replace(/^\//,'')]=n.getAttribute('name');});
 for(const path of sheetPaths){
  const templateFile=templateZip.file(path),generatedFile=generatedZip.file(path);if(!templateFile||!generatedFile)continue;
  const [templateXml,generatedXml]=await Promise.all([templateFile.async('string'),generatedFile.async('string')]);
  const templateDoc=parser.parseFromString(templateXml,'application/xml');
  const generatedDoc=parser.parseFromString(generatedXml,'application/xml');
  if(templateDoc.querySelector('parsererror')||generatedDoc.querySelector('parsererror'))throw new Error('No se pudo proteger las fórmulas de '+path+'.');
  const generatedCells=new Map([...generatedDoc.getElementsByTagName('c')].map(cell=>[cell.getAttribute('r'),cell]));
  const protectedCells=protectedBySheet[sheetNameByPath[path]]||new Set();
  [...templateDoc.getElementsByTagName('c')].forEach(sourceCell=>{
   if(protectedCells.has(sourceCell.getAttribute('r')))return;
   const sourceFormula=[...sourceCell.children].find(node=>node.localName==='f');if(!sourceFormula)return;
   const targetCell=generatedCells.get(sourceCell.getAttribute('r'));if(!targetCell)return;
   [...targetCell.children].filter(node=>node.localName==='f').forEach(node=>node.remove());
   const imported=generatedDoc.importNode(sourceFormula,true);
   const before=[...targetCell.children].find(node=>node.localName==='v'||node.localName==='is'||node.localName==='inlineStr');
   targetCell.insertBefore(imported,before||targetCell.firstChild);
  });
  generatedZip.file(path,serializer.serializeToString(generatedDoc));
 }
 const workbookPath='xl/workbook.xml',workbookFile=generatedZip.file(workbookPath);
 if(workbookFile){
  const workbookXml=await workbookFile.async('string'),doc=parser.parseFromString(workbookXml,'application/xml');
  let calcPr=[...doc.getElementsByTagName('*')].find(node=>node.localName==='calcPr');
  if(!calcPr){calcPr=doc.createElementNS(doc.documentElement.namespaceURI,'calcPr');doc.documentElement.appendChild(calcPr);}
  calcPr.setAttribute('calcMode','auto');calcPr.setAttribute('fullCalcOnLoad','1');calcPr.setAttribute('forceFullCalc','1');
  generatedZip.file(workbookPath,serializer.serializeToString(doc));
 }
 return generatedZip.generateAsync({type:'arraybuffer',compression:'DEFLATE'});
}
async function m2RestoreTemplateDrawings(templateBuffer,generatedBuffer){
 if(typeof JSZip==='undefined')throw new Error('No se cargó el protector visual de Excel.');
 const [templateZip,generatedZip]=await Promise.all([JSZip.loadAsync(templateBuffer),JSZip.loadAsync(generatedBuffer)]);
 const parser=new DOMParser(),serializer=new XMLSerializer();
 // Conserva imágenes y dibujos originales de la plantilla (incluido el logo) sin reconstruir el libro.
 for(const path of Object.keys(templateZip.files)){
  if(!/^xl\/(media|drawings)\//.test(path))continue;
  const sourceFile=templateZip.file(path);if(!sourceFile)continue;
  generatedZip.file(path,await sourceFile.async('uint8array'));
 }
 const ct=templateZip.file('[Content_Types].xml');if(ct)generatedZip.file('[Content_Types].xml',await ct.async('string'));
 const sheetPaths=Object.keys(templateZip.files).filter(path=>/^xl\/worksheets\/sheet\d+\.xml$/.test(path));
 for(const path of sheetPaths){
  const tf=templateZip.file(path),gf=generatedZip.file(path);if(!tf||!gf)continue;
  const [tx,gx]=await Promise.all([tf.async('string'),gf.async('string')]);
  const td=parser.parseFromString(tx,'application/xml'),gd=parser.parseFromString(gx,'application/xml');
  const tDrawing=[...td.getElementsByTagName('*')].find(n=>n.localName==='drawing');
  if(!tDrawing)continue;
  const tRid=tDrawing.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id')||tDrawing.getAttribute('r:id');
  const relPath=path.replace('/worksheets/','/worksheets/_rels/')+'.rels';
  const trf=templateZip.file(relPath);if(!trf)continue;
  const trd=parser.parseFromString(await trf.async('string'),'application/xml');
  const tRel=[...trd.getElementsByTagName('*')].find(n=>n.localName==='Relationship'&&n.getAttribute('Id')===tRid);
  if(!tRel)continue;
  let grd,relsRoot;
  const grf=generatedZip.file(relPath);
  if(grf){grd=parser.parseFromString(await grf.async('string'),'application/xml');relsRoot=grd.documentElement;}
  else{grd=parser.parseFromString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>','application/xml');relsRoot=grd.documentElement;}
  const used=new Set([...grd.getElementsByTagName('*')].filter(n=>n.localName==='Relationship').map(n=>n.getAttribute('Id')));
  let newRid=tRid,seq=1;while(used.has(newRid))newRid='rIdDrawing'+(seq++);
  const rel=grd.createElementNS(relsRoot.namespaceURI,'Relationship');
  rel.setAttribute('Id',newRid);rel.setAttribute('Type',tRel.getAttribute('Type'));rel.setAttribute('Target',tRel.getAttribute('Target'));relsRoot.appendChild(rel);
  [...gd.getElementsByTagName('*')].filter(n=>n.localName==='drawing').forEach(n=>n.remove());
  const drawing=gd.importNode(tDrawing,true);drawing.setAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','r:id',newRid);
  const root=gd.documentElement,ext=[...root.children].find(n=>n.localName==='extLst');root.insertBefore(drawing,ext||null);
  generatedZip.file(path,serializer.serializeToString(gd));generatedZip.file(relPath,serializer.serializeToString(grd));
 }
 return generatedZip.generateAsync({type:'arraybuffer',compression:'DEFLATE'});
}
function m2FileToDataUrl(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('No se pudo leer '+file.name));reader.readAsDataURL(file);});}

async function m2GetDriveImage(fileId){
 const endpoint=galleryEndpoint();
 if(!endpoint)throw new Error('Configura la URL de Apps Script.');
 const response=await fetch(endpoint+'?action=getImage&fileId='+encodeURIComponent(fileId));
 const data=await response.json();
 if(!data.ok)throw new Error(data.error||'No se pudo obtener la imagen de Drive.');
 return data;
}
function m2Base64Bytes(base64){
 const binary=atob(base64),bytes=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
 return bytes;
}
function m2CellPoint(cell){
 const match=String(cell||'A1').toUpperCase().match(/^([A-Z]+)(\d+)$/);if(!match)throw new Error('Celda inválida: '+cell);
 let col=0;for(const ch of match[1])col=col*26+(ch.charCodeAt(0)-64);
 return {col:col-1,row:Number(match[2])-1};
}
async function m2InsertImages(generatedBuffer,insertions){
 if(typeof JSZip==='undefined')throw new Error('No se cargó JSZip.');
 if(!Array.isArray(insertions)||!insertions.length)return generatedBuffer;
 const zip=await JSZip.loadAsync(generatedBuffer),parser=new DOMParser(),serializer=new XMLSerializer();
 const workbookDoc=parser.parseFromString(await zip.file('xl/workbook.xml').async('string'),'application/xml');
 const workbookRels=parser.parseFromString(await zip.file('xl/_rels/workbook.xml.rels').async('string'),'application/xml');
 const relTargets=new Map([...workbookRels.getElementsByTagName('*')].filter(n=>n.localName==='Relationship').map(n=>[n.getAttribute('Id'),n.getAttribute('Target')]));
 const sheetPaths=new Map();
 [...workbookDoc.getElementsByTagName('*')].filter(n=>n.localName==='sheet').forEach(n=>{
  const rid=n.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id')||n.getAttribute('r:id');
  const target=relTargets.get(rid);if(!target)return;
  sheetPaths.set(String(n.getAttribute('name')||'').trim(),'xl/'+target.replace(/^\/?xl\//,'').replace(/^\//,''));
 });
 const grouped=new Map();
 insertions.forEach(item=>{const key=String(item.sheetName||'').trim();if(!grouped.has(key))grouped.set(key,[]);grouped.get(key).push(item);});
 let globalSeq=1;
 for(const [sheetName,items] of grouped){
  const sheetPath=sheetPaths.get(sheetName);if(!sheetPath||!zip.file(sheetPath))throw new Error('No se encontró la hoja '+sheetName+'.');
  const sheetDoc=parser.parseFromString(await zip.file(sheetPath).async('string'),'application/xml');
  const relPath=sheetPath.replace('/worksheets/','/worksheets/_rels/')+'.rels';
  let sheetRelDoc=zip.file(relPath)?parser.parseFromString(await zip.file(relPath).async('string'),'application/xml'):parser.parseFromString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>','application/xml');
  let drawingNode=[...sheetDoc.getElementsByTagName('*')].find(n=>n.localName==='drawing');
  let drawingPath='',drawingRelPath='',drawingDoc,drawingRelDoc;
  if(drawingNode){
   const drawingRid=drawingNode.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id')||drawingNode.getAttribute('r:id');
   const drawingRel=[...sheetRelDoc.getElementsByTagName('*')].find(n=>n.localName==='Relationship'&&n.getAttribute('Id')===drawingRid);
   const target=drawingRel&&drawingRel.getAttribute('Target');
   if(target){
    const base=sheetPath.substring(0,sheetPath.lastIndexOf('/')+1);
    const normalized=(base+target).replace('/worksheets/../','/');
    drawingPath=normalized.startsWith('xl/')?normalized:'xl/'+normalized.replace(/^\//,'');
   }
  }
  if(drawingPath&&zip.file(drawingPath)){
   drawingDoc=parser.parseFromString(await zip.file(drawingPath).async('string'),'application/xml');
   drawingRelPath=drawingPath.replace('/drawings/','/drawings/_rels/')+'.rels';
   drawingRelDoc=zip.file(drawingRelPath)?parser.parseFromString(await zip.file(drawingRelPath).async('string'),'application/xml'):parser.parseFromString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>','application/xml');
  }else{
   let drawIndex=1;while(zip.file('xl/drawings/drawing-m2-'+drawIndex+'.xml'))drawIndex++;
   drawingPath='xl/drawings/drawing-m2-'+drawIndex+'.xml';drawingRelPath='xl/drawings/_rels/drawing-m2-'+drawIndex+'.xml.rels';
   drawingDoc=parser.parseFromString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>','application/xml');
   drawingRelDoc=parser.parseFromString('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>','application/xml');
   const used=new Set([...sheetRelDoc.getElementsByTagName('*')].filter(n=>n.localName==='Relationship').map(n=>n.getAttribute('Id')));let rid='rIdM2Drawing',i=1;while(used.has(rid))rid='rIdM2Drawing'+(i++);
   const rel=sheetRelDoc.createElementNS(sheetRelDoc.documentElement.namespaceURI,'Relationship');rel.setAttribute('Id',rid);rel.setAttribute('Type','http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing');rel.setAttribute('Target','../drawings/'+drawingPath.split('/').pop());sheetRelDoc.documentElement.appendChild(rel);
   drawingNode=sheetDoc.createElementNS(sheetDoc.documentElement.namespaceURI,'drawing');drawingNode.setAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','r:id',rid);sheetDoc.documentElement.appendChild(drawingNode);
  }
  const usedImageRids=new Set([...drawingRelDoc.getElementsByTagName('*')].filter(n=>n.localName==='Relationship').map(n=>n.getAttribute('Id')));
  let picId=Math.max(0,...[...drawingDoc.getElementsByTagName('*')].filter(n=>n.localName==='cNvPr').map(n=>Number(n.getAttribute('id'))||0))+1;
  for(const item of items){
   const [fromCell,toCell]=String(item.range).split(':'),from=m2CellPoint(fromCell),to=m2CellPoint(toCell||fromCell);
   const ext=item.image.mimeType==='image/png'?'png':'jpeg';
   const mediaName='m2-image-'+(globalSeq++)+'.'+ext;zip.file('xl/media/'+mediaName,m2Base64Bytes(item.image.base64));
   let imageRid='rIdM2Image'+globalSeq,ridSeq=1;while(usedImageRids.has(imageRid))imageRid='rIdM2Image'+globalSeq+'_'+(ridSeq++);usedImageRids.add(imageRid);
   const imageRel=drawingRelDoc.createElementNS(drawingRelDoc.documentElement.namespaceURI,'Relationship');imageRel.setAttribute('Id',imageRid);imageRel.setAttribute('Type','http://schemas.openxmlformats.org/officeDocument/2006/relationships/image');imageRel.setAttribute('Target','../media/'+mediaName);drawingRelDoc.documentElement.appendChild(imageRel);
   const anchorXml=`<xdr:twoCellAnchor editAs="oneCell" xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><xdr:from><xdr:col>${from.col}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${from.row}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>${to.col+1}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${to.row+1}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="${picId++}" name="${String(item.name||'Evidencia').replace(/[&<>\"]/g,'')}"/><xdr:cNvPicPr/></xdr:nvPicPr><xdr:blipFill><a:blip r:embed="${imageRid}"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>`;
   const anchorDoc=parser.parseFromString(anchorXml,'application/xml');drawingDoc.documentElement.appendChild(drawingDoc.importNode(anchorDoc.documentElement,true));
  }
  zip.file(sheetPath,serializer.serializeToString(sheetDoc));zip.file(relPath,serializer.serializeToString(sheetRelDoc));zip.file(drawingPath,serializer.serializeToString(drawingDoc));zip.file(drawingRelPath,serializer.serializeToString(drawingRelDoc));
 }
 const ctDoc=parser.parseFromString(await zip.file('[Content_Types].xml').async('string'),'application/xml');
 for(const ext of ['png','jpeg'])if(![...ctDoc.getElementsByTagName('*')].some(n=>n.localName==='Default'&&n.getAttribute('Extension')===ext)){const d=ctDoc.createElementNS(ctDoc.documentElement.namespaceURI,'Default');d.setAttribute('Extension',ext);d.setAttribute('ContentType',ext==='png'?'image/png':'image/jpeg');ctDoc.documentElement.appendChild(d);}
 const drawingPaths=Object.keys(zip.files).filter(name=>name.startsWith('xl/drawings/')&&name.endsWith('.xml')&&!name.includes('/_rels/'));
 for(const path of drawingPaths){const part='/'+path;if(![...ctDoc.getElementsByTagName('*')].some(n=>n.localName==='Override'&&n.getAttribute('PartName')===part)){const o=ctDoc.createElementNS(ctDoc.documentElement.namespaceURI,'Override');o.setAttribute('PartName',part);o.setAttribute('ContentType','application/vnd.openxmlformats-officedocument.drawing+xml');ctDoc.documentElement.appendChild(o);}}
 zip.file('[Content_Types].xml',serializer.serializeToString(ctDoc));
 return zip.generateAsync({type:'arraybuffer',compression:'DEFLATE'});
}
async function m2GenerateExcel(){
 m2ImageTrace=[];m2Trace('generation-start',{imageCount:m2ImageFiles.size});
 const buttons=[...document.querySelectorAll('.m2-export-excel')];buttons.forEach(b=>{if(!b.dataset.originalText)b.dataset.originalText=b.textContent;b.disabled=true;b.textContent='Generando Excel…'});
 try{
  if(typeof XlsxPopulate==='undefined')throw new Error('No se cargó el motor de Excel. Revisa la conexión y vuelve a intentar.');
  const response=await fetch('templates/MODULO-2-PLANTILLA.xlsx');if(!response.ok)throw new Error('No se encontró la plantilla Excel del Módulo 2.');
  const templateBuffer=await response.arrayBuffer();m2Trace('template-loaded',{bytes:templateBuffer.byteLength});
  const workbook=await XlsxPopulate.fromDataAsync(templateBuffer.slice(0));
  Object.entries(m2EmbeddedValues).forEach(([key,value])=>{
   const parts=key.split('|');if(parts.length!==2||parts[1].startsWith('image'))return;
   const [code,cell]=parts,sheetName=M2_SHEET_NAME_BY_CODE[code];if(!sheetName||!cell)return;
   const sheet=m2PopulateSheet(workbook,sheetName);if(sheet)sheet.cell(cell).value(value||'');
  });
  m2ApplyHeaders(workbook);
  Object.entries(m2EmbeddedValues).forEach(([key,value])=>{if(!key.includes('|image|')||!value||typeof value!=='object'||!value.url)return;const [code,_image,index]=key.split('|'),sheet=m2PopulateSheet(workbook,M2_SHEET_NAME_BY_CODE[code]),target=m2ImageRange(code,Number(index))?.split(':')[0];if(sheet&&target){const cell=sheet.cell(target);cell.value('Abrir evidencia fotográfica');cell.hyperlink(String(value.url));cell.style({fontColor:'0563C1',underline:true});}});
  const sig=m2SignatureData(),poe=m2PopulateSheet(workbook,M2_SHEET_NAME_BY_CODE['POE MTTO INFRAESTR']);
  if(poe){poe.cell(m2Reference('M2.SIGN.ELABORO','B66')).value(sig.elaboro.nombre);poe.cell(m2Reference('M2.SIGN.REVISO','E66')).value(sig.reviso.nombre);poe.cell(m2Reference('M2.SIGN.AUTORIZO','H66')).value(sig.autorizo.nombre);}
  let blob=await workbook.outputAsync();
  // Las evidencias se guardan en Drive. Después restauramos fórmulas y dibujos originales (incluido el logo).
  const formulaProtected=await m2RestoreTemplateFormulas(templateBuffer,await blob.arrayBuffer());
  const visuallyProtected=await m2RestoreTemplateDrawings(templateBuffer,formulaProtected);
  let finalBuffer=visuallyProtected;
  // Inserta todas las evidencias persistidas en sus hojas y rangos mapeados.
  const imageEntries=Object.entries(m2EmbeddedValues).filter(([key,value])=>
   key.includes('|image|')&&value&&typeof value==='object'&&value.fileId
  );
  const insertions=[];
  // Inserta el logo maestro en la primera zona gráfica de las 12 hojas.
  const masterLogo=m2GetMasterHeader().logo;
  if(masterLogo?.fileId){
   m2Trace('excel-logo-fetch',{fileId:masterLogo.fileId});
   const logoImage=await m2GetDriveImage(masterLogo.fileId);
   Object.keys(M2_SHEET_NAME_BY_CODE).forEach(code=>{
    const sheetName=M2_SHEET_NAME_BY_CODE[code],logoRange=m2ImageRange(code,0);
    if(sheetName&&logoRange)insertions.push({sheetName,range:logoRange,image:logoImage,name:masterLogo.name||'Logo RED Greenhouse'});
   });
  }else m2Trace('excel-logo-skipped',{reason:'Logo maestro sin fileId'});
  for(const [imageKey,imageRef] of imageEntries){
   const [code,_image,indexText]=imageKey.split('|'),imageIndex=Number(indexText);
   const sheetName=M2_SHEET_NAME_BY_CODE[code],targetRange=m2ImageRange(code,imageIndex);
   if(!sheetName||!targetRange){m2Trace('excel-image-skipped',{imageKey,reason:'Sin hoja o rango mapeado'});continue;}
   m2Trace('excel-image-fetch',{imageKey,fileId:imageRef.fileId,sheetName,targetRange});
   const driveImage=await m2GetDriveImage(imageRef.fileId);
   insertions.push({sheetName,range:targetRange,image:driveImage,name:imageRef.name||driveImage.name||imageKey});
  }
  if(insertions.length){
   finalBuffer=await m2InsertImages(finalBuffer,insertions);
   m2Trace('excel-images-inserted',{count:insertions.length});
  }else m2Trace('excel-images-skipped',{reason:'No hay imágenes persistidas'});
  blob=new Blob([finalBuffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='MODULO 2 INFRAESTRUCTURA_LISTO_PARA_IMPRIMIR.xlsx';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }catch(err){m2Trace('generation-error',{message:err.message,stack:err.stack||''});m2DownloadTrace();alert('No se pudo generar el Excel: '+err.message);}
 finally{buttons.forEach(b=>{b.disabled=false;b.textContent=b.dataset.originalText||'Generar Excel'});}
}
function m2EnhanceOpenDocument(detail,doc){
 const root=detail.querySelector(`.living-document[data-m2-code="${CSS.escape(doc.code)}"]`);if(!root)return;
 m2ReplaceMasterText(root);m2ApplyLiveHeader(root,doc);m2AddImages(root,doc);m2AddControls(root,doc);m2AddMasterSignatures(root,doc);m2UpgradeLegacyFileInputs(root,doc);m2Bind(root);
 detail.querySelectorAll('.m2-export-excel').forEach(btn=>{if(!btn.dataset.bound){btn.dataset.bound='1';btn.addEventListener('click',m2GenerateExcel);}});
}
