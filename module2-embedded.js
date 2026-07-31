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
 (M2_IMAGE_RANGES[doc.code]||[]).forEach((range,index)=>{
  const cells=m2CellsInRange(root,range),top=m2TopCell(root,range);if(!top)return;
  cells.forEach(c=>c.classList.add('m2-image-region'));
  const key=`${doc.code}|image|${index}`,stored=m2EmbeddedValues[key]||'',storedName=typeof stored==='object'?stored.name:stored;
  if(index===0){
   top.innerHTML=`<div class="embedded-logo-slot"><img src="assets/logo-red-greenhouse.png" alt="RED Greenhouse"><small data-m2-ref>${range}</small></div>`;
  }else{
   top.innerHTML=`<label class="embedded-image-input"><input type="file" accept="image/*" data-m2-image="${esc(key)}"><span>${storedName?'Imagen seleccionada: '+esc(storedName):'＋ Agregar imagen'}</span><small data-m2-ref>${range}</small></label>`;
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
 root.querySelectorAll('[data-m2-image]').forEach(el=>el.addEventListener('change',()=>{const file=el.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{m2EmbeddedValues[el.dataset.m2Image]={name:file.name,type:file.type,dataUrl:reader.result};m2Save();el.nextElementSibling.textContent='Imagen seleccionada: '+file.name;};reader.readAsDataURL(file);}));
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
async function m2GenerateExcel(){
 const buttons=[...document.querySelectorAll('.m2-export-excel')];buttons.forEach(b=>{b.disabled=true;b.textContent='Generando Excel…'});
 try{
  if(typeof XlsxPopulate==='undefined')throw new Error('No se cargó el motor de Excel. Revisa la conexión y vuelve a intentar.');
  const response=await fetch('MODULO-2-PLANTILLA.xlsx');if(!response.ok)throw new Error('No se encontró la plantilla Excel del Módulo 2.');
  const workbook=await XlsxPopulate.fromDataAsync(await response.arrayBuffer());
  Object.entries(m2EmbeddedValues).forEach(([key,value])=>{
   const parts=key.split('|');if(parts.length!==2||parts[1].startsWith('image'))return;
   const [code,cell]=parts,sheetName=M2_SHEET_NAME_BY_CODE[code];if(!sheetName||!cell)return;
   const sheet=workbook.sheet(sheetName);if(sheet)sheet.cell(cell).value(value||'');
  });
  const sig=m2SignatureData(),poe=workbook.sheet(M2_SHEET_NAME_BY_CODE['POE MTTO INFRAESTR']);
  if(poe){poe.cell('B66').value(sig.elaboro.nombre);poe.cell('E66').value(sig.reviso.nombre);poe.cell('H66').value(sig.autorizo.nombre);}
  const masterReplacements={
   'SUGEILI PEREZ ALVARADO':m2MasterValue('Alta Dirección')||sig.autorizo.nombre,
   'RANCHO PEREZ PEREZ':m2MasterValue('Nombre de la unidad de producción')||'RED Greenhouse',
   'PARAJE LA PARCELA S/N SAN FRANCISCO TEPANGO, COHUECAN C.P. 74522':m2MasterValue('Domicilio de la unidad')||'',
   'UP2022005242':m2MasterValue('Folio SENASICA')||''
  };
  workbook.sheets().forEach(sheet=>{const used=sheet.usedRange();if(!used)return;const values=used.value();if(!Array.isArray(values))return;values.forEach((row,r)=>{if(!Array.isArray(row))return;row.forEach((value,c)=>{if(typeof value!=='string')return;const trimmed=value.trim();if(Object.prototype.hasOwnProperty.call(masterReplacements,trimmed))used.cell(r+1,c+1).value(masterReplacements[trimmed]);});});});
  let blob=await workbook.outputAsync();
  const mapImage=m2EmbeddedValues['MAPA 2.1.2|image|1'];
  if(mapImage&&typeof mapImage==='object'&&mapImage.dataUrl){
   if(typeof ExcelJS==='undefined')throw new Error('No se cargó el motor para insertar imágenes en Excel.');
   const excelBook=new ExcelJS.Workbook();await excelBook.xlsx.load(await blob.arrayBuffer());
   const imageSheet=excelBook.getWorksheet(M2_SHEET_NAME_BY_CODE['MAPA 2.1.2']);
   if(imageSheet){const ext=(mapImage.type||'image/png').toLowerCase().includes('jpeg')?'jpeg':'png';const imageId=excelBook.addImage({base64:mapImage.dataUrl,extension:ext});imageSheet.addImage(imageId,{tl:{col:2,row:15},br:{col:17,row:40},editAs:'oneCell'});}
   blob=new Blob([await excelBook.xlsx.writeBuffer()],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='MODULO 2 INFRAESTRUCTURA_LISTO_PARA_IMPRIMIR.xlsx';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }catch(err){alert('No se pudo generar el Excel: '+err.message);}
 finally{buttons.forEach(b=>{b.disabled=false;b.textContent='Generar Excel listo para imprimir'});}
}
function m2EnhanceOpenDocument(detail,doc){
 const root=detail.querySelector(`.living-document[data-m2-code="${CSS.escape(doc.code)}"]`);if(!root)return;
 m2ReplaceMasterText(root);m2AddImages(root,doc);m2AddControls(root,doc);m2AddMasterSignatures(root,doc);m2Bind(root);
 detail.querySelectorAll('.m2-export-excel').forEach(btn=>{if(!btn.dataset.bound){btn.dataset.bound='1';btn.addEventListener('click',m2GenerateExcel);}});
}
