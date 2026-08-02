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

const M2_REFERENCE_STORE_KEY='redGreenhouseExcelReferences';
function m2Reference(id,fallback){
 try{const refs=JSON.parse(localStorage.getItem(M2_REFERENCE_STORE_KEY)||'{}');return String(refs[id]||fallback||'').trim();}catch(_err){return fallback;}
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
function m2ImageRange(code,index){return m2Reference((M2_IMAGE_IDS[code]||[])[index],(M2_IMAGE_RANGES[code]||[])[index]);}
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
 const key=masterKey(field); return String(masterValues[key]||'').trim();
}
function m2RenderDocument(doc){
 const replica=m2Replica(doc);
 if(!replica)return '<p class="empty-value">No se encontró la transcripción HTML de esta hoja.</p>';
 return `<div class="living-document-toolbar"><div><b>Documento vivo</b><span>Captura directamente en el contexto del formato original.</span></div><button type="button" class="primary-button m2-export-excel">Generar Excel listo para imprimir</button></div><div class="living-document" data-m2-code="${esc(doc.code)}">${replica}</div>`;
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
 (M2_IMAGE_RANGES[doc.code]||[]).forEach((_range,index)=>{
  const range=m2ImageRange(doc.code,index);
  const cells=m2CellsInRange(root,range),top=m2TopCell(root,range);if(!top)return;
  cells.forEach(c=>c.classList.add('m2-image-region'));
  const key=`${doc.code}|image|${index}`,stored=m2EmbeddedValues[key]||'',storedName=typeof stored==='object'?stored.name:stored;
  if(index===0){
   top.innerHTML=`<div class="embedded-logo-slot"><img src="assets/images/logo-redgreenhouse.png" alt="RED Greenhouse"><small data-m2-ref>${range}</small></div>`;
  }else{
   const storedObj=stored&&typeof stored==='object'?stored:null;
   top.innerHTML=`<div class="embedded-image-input">${storedObj?.imageUrl?`<img class="m2-drive-preview" src="${esc(storedObj.imageUrl)}" alt="${esc(storedName||'Evidencia')}"><a href="${esc(storedObj.url||storedObj.imageUrl)}" target="_blank" rel="noopener">Ver imagen guardada</a>`:''}<label><input type="file" accept="image/*" data-m2-image-file="${esc(key)}"><span data-m2-file-name>${storedName?'Cambiar imagen':'Elegir imagen'}</span></label><button type="button" class="primary-button m2-upload-drive" data-m2-upload="${esc(key)}" disabled>Subir a Google Drive</button><small data-m2-ref>${range}</small></div>`;
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
function m2AddControls(root,doc){
 m2EnsureCoordinateGrid(root,doc);
 const sheetName=M2_SHEET_NAME_BY_CODE[doc.code]||doc.code;
 const controls=[...((typeof MODULE2_ANNOTATIONS!=='undefined'&&MODULE2_ANNOTATIONS[sheetName])||[])];
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
   cell.innerHTML=`<button type="button" class="embedded-status ${current==='✓'?'status-yes':current==='✗'?'status-no':current==='NL'?'status-nl':'status-empty'}" data-m2-status="${esc(key)}" title="Clic para cambiar: ✓, ✗, NL"><span>${current||' '}</span><small data-m2-ref>${item.cell}</small></button>`;
   cell.classList.add('m2-editable-cell','m2-status-cell');
  }
 });
}
function m2Bind(root){
 root.querySelectorAll('[data-m2-input]').forEach(el=>el.addEventListener('input',()=>{m2EmbeddedValues[el.dataset.m2Input]=el.value;m2Save();}));
 root.querySelectorAll('[data-m2-status]').forEach(btn=>btn.addEventListener('click',()=>{
  const seq=['','✓','✗','NL'],key=btn.dataset.m2Status,current=Object.prototype.hasOwnProperty.call(m2EmbeddedValues,key)?m2EmbeddedValues[key]:'',next=seq[(seq.indexOf(current)+1)%seq.length];m2EmbeddedValues[key]=next;m2Save();
  btn.querySelector('span').textContent=next;btn.classList.remove('status-yes','status-no','status-nl','status-empty');btn.classList.add(next==='✓'?'status-yes':next==='✗'?'status-no':next==='NL'?'status-nl':'status-empty');
 }));
 root.querySelectorAll('[data-m2-image-file]').forEach(el=>el.addEventListener('change',()=>{
  const file=el.files[0],key=el.dataset.m2ImageFile,wrap=el.closest('.embedded-image-input'),button=wrap?.querySelector('[data-m2-upload]'),name=wrap?.querySelector('[data-m2-file-name]');
  if(file){m2ImageFiles.set(key,file);if(name)name.textContent=file.name;if(button)button.disabled=false;}
 }));
 root.querySelectorAll('[data-m2-upload]').forEach(button=>button.addEventListener('click',async()=>{
  const key=button.dataset.m2Upload,file=m2ImageFiles.get(key),url=galleryEndpoint();
  if(!file)return alert('Primero selecciona una imagen.');
  if(!url)return alert('Configura la URL de Apps Script en Administración.');
  button.disabled=true;button.textContent='Subiendo…';
  try{const payload={action:'uploadImage',folderId:imagesFolderId(),fileName:file.name,mimeType:file.type||'image/jpeg',base64:await fileToBase64(file),module:'M2',field:key};const r=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)}),j=await r.json();if(!j.ok)throw new Error(j.error||'No se pudo subir');m2EmbeddedValues[key]=j;m2Save();m2ImageFiles.delete(key);button.textContent='Imagen guardada';setTimeout(()=>openModule2(),350);}catch(err){alert(err.message);button.disabled=false;button.textContent='Subir a Google Drive';}
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
const M2_HEADER_CELLS={
 'PORTADA':{empresa:'D1',domicilio:'D2',folio:'H2',emision:'I3',version:'I4',vigencia:'I5'},
 'POE MTTO INFRAESTR':{empresa:'D1',domicilio:'D2',folio:'H2',emision:'J3',version:'J4',vigencia:'J5'},
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
function m2CurrentMaster(field,captureKey,fallback=''){
 const direct=m2MasterValue(field);if(direct)return direct;
 try{const capture=JSON.parse(localStorage.getItem('red_srrc_capture_v119')||'{}');const value=capture['master.'+captureKey];if(String(value||'').trim())return String(value).trim();}catch(_err){}
 return fallback;
}
function m2ApplyHeaders(workbook){
 const values={
  empresa:m2CurrentMaster('Nombre de la unidad de producción','unidadProduccion','RED Greenhouse'),
  domicilio:m2CurrentMaster('Domicilio de la unidad','domicilio',''),
  folio:m2CurrentMaster('Folio SENASICA','folioSenasica','Folio pendiente'),
  emision:m2CurrentMaster('Fecha de emisión','fechaEmision',''),
  vigencia:m2CurrentMaster('Vigencia','vigenciaDocumento',''),
  version:m2CurrentMaster('Versión','versionDocumento','')
 };
 Object.entries(M2_HEADER_CELLS).forEach(([code,cells])=>{
  const sheet=m2PopulateSheet(workbook,M2_SHEET_NAME_BY_CODE[code]);if(!sheet)return;
  Object.entries(cells).forEach(([key,cell])=>sheet.cell(cell).value(values[key]||''));
 });
}

async function m2RestoreTemplateFormulas(templateBuffer,generatedBuffer){
 if(typeof JSZip==='undefined')throw new Error('No se cargó el protector de fórmulas de Excel.');
 const [templateZip,generatedZip]=await Promise.all([JSZip.loadAsync(templateBuffer),JSZip.loadAsync(generatedBuffer)]);
 const sheetPaths=Object.keys(templateZip.files).filter(path=>/^xl\/worksheets\/sheet\d+\.xml$/.test(path));
 const parser=new DOMParser(),serializer=new XMLSerializer();
 for(const path of sheetPaths){
  const templateFile=templateZip.file(path),generatedFile=generatedZip.file(path);if(!templateFile||!generatedFile)continue;
  const [templateXml,generatedXml]=await Promise.all([templateFile.async('string'),generatedFile.async('string')]);
  const templateDoc=parser.parseFromString(templateXml,'application/xml');
  const generatedDoc=parser.parseFromString(generatedXml,'application/xml');
  if(templateDoc.querySelector('parsererror')||generatedDoc.querySelector('parsererror'))throw new Error('No se pudo proteger las fórmulas de '+path+'.');
  const generatedCells=new Map([...generatedDoc.getElementsByTagName('c')].map(cell=>[cell.getAttribute('r'),cell]));
  [...templateDoc.getElementsByTagName('c')].forEach(sourceCell=>{
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
  if(/^xl\/(media|drawings)\//.test(path)){const source=templateZip.file(path);if(source)generatedZip.file(path,await source.async('uint8array'));}
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
async function m2GenerateExcel(){
 m2ImageTrace=[];m2Trace('generation-start',{imageCount:m2ImageFiles.size});
 const buttons=[...document.querySelectorAll('.m2-export-excel')];buttons.forEach(b=>{b.disabled=true;b.textContent='Generando Excel…'});
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
  Object.entries(m2EmbeddedValues).forEach(([key,value])=>{if(!key.includes('|image|')||!value||typeof value!=='object'||!value.url)return;const [code,_image,index]=key.split('|'),sheet=m2PopulateSheet(workbook,M2_SHEET_NAME_BY_CODE[code]),target=m2ImageRange(code,Number(index))?.split(':')[0];if(sheet&&target)sheet.cell(target).formula(`HYPERLINK("${String(value.url).replace(/"/g,'""')}","Abrir evidencia fotográfica")`);});
  const sig=m2SignatureData(),poe=m2PopulateSheet(workbook,M2_SHEET_NAME_BY_CODE['POE MTTO INFRAESTR']);
  if(poe){poe.cell(m2Reference('M2.SIGN.ELABORO','B66')).value(sig.elaboro.nombre);poe.cell(m2Reference('M2.SIGN.REVISO','E66')).value(sig.reviso.nombre);poe.cell(m2Reference('M2.SIGN.AUTORIZO','H66')).value(sig.autorizo.nombre);}
  let blob=await workbook.outputAsync();
  // Las evidencias se guardan en Drive. Después restauramos fórmulas y dibujos originales (incluido el logo).
  const formulaProtected=await m2RestoreTemplateFormulas(templateBuffer,await blob.arrayBuffer());
  const visuallyProtected=await m2RestoreTemplateDrawings(templateBuffer,formulaProtected);
  blob=new Blob([visuallyProtected],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='MODULO 2 INFRAESTRUCTURA_LISTO_PARA_IMPRIMIR.xlsx';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }catch(err){m2Trace('generation-error',{message:err.message,stack:err.stack||''});m2DownloadTrace();alert('No se pudo generar el Excel: '+err.message);}
 finally{buttons.forEach(b=>{b.disabled=false;b.textContent='Generar Excel listo para imprimir'});}
}
function m2EnhanceOpenDocument(detail,doc){
 const root=detail.querySelector(`.living-document[data-m2-code="${CSS.escape(doc.code)}"]`);if(!root)return;
 m2ReplaceMasterText(root);m2AddImages(root,doc);m2AddControls(root,doc);m2AddMasterSignatures(root,doc);m2Bind(root);
 detail.querySelectorAll('.m2-export-excel').forEach(btn=>{if(!btn.dataset.bound){btn.dataset.bound='1';btn.addEventListener('click',m2GenerateExcel);}});
}
