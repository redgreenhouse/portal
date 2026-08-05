(function () {
  const DIRECTOR_RELEASE_KEY = 'redGreenhouseDirectorRelease';
  function directorReleaseState(){ try{return JSON.parse(localStorage.getItem(DIRECTOR_RELEASE_KEY)||'{}')}catch(_e){return {}} }
  function isDirectorReleased(key){ return !!directorReleaseState()[key]; }
  function setDirectorReleased(key,value){ const state=directorReleaseState(); state[key]=!!value; localStorage.setItem(DIRECTOR_RELEASE_KEY,JSON.stringify(state)); }
  const STORE = 'redGreenhouseModuleCaptureV128';
  let values = JSON.parse(localStorage.getItem(STORE) || '{}');
  const save = () => localStorage.setItem(STORE, JSON.stringify(values));
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const EXCEL_REFERENCE_STORE_KEY = 'redGreenhouseExcelReferences';
  const EXCEL_REFERENCE_LAYOUT_KEY = 'redGreenhouseExcelReferenceLayoutVersion';
  const EXCEL_REFERENCE_LAYOUT_VERSION = '1.61-m8-m10-live-aligned';
  // M8–M10 changed from horizontal page blocks to the new vertical templates.
  // Remove only their old saved destinations once; references for all other modules stay untouched.
  try {
    if (localStorage.getItem(EXCEL_REFERENCE_LAYOUT_KEY) !== EXCEL_REFERENCE_LAYOUT_VERSION) {
      const refs = JSON.parse(localStorage.getItem(EXCEL_REFERENCE_STORE_KEY) || '{}');
      Object.keys(refs).forEach((id) => {
        if (/^M(?:8|9|10)\./.test(id)) delete refs[id];
      });
      localStorage.setItem(EXCEL_REFERENCE_STORE_KEY, JSON.stringify(refs));
      localStorage.setItem(EXCEL_REFERENCE_LAYOUT_KEY, EXCEL_REFERENCE_LAYOUT_VERSION);
    }
  } catch (_err) {}
  function excelReference(id, fallback) {
    try {
      const refs = JSON.parse(localStorage.getItem(EXCEL_REFERENCE_STORE_KEY) || '{}');
      return Object.prototype.hasOwnProperty.call(refs, id)
        ? String(refs[id] || '').trim()
        : String(fallback || '').trim();
    } catch (_err) {
      return String(fallback || '').trim();
    }
  }
  function moduleReference(n, id, fallback) {
    const moduleNumber = Number(n);
    return moduleNumber >= 3 && moduleNumber <= 15
      ? excelReference(id, fallback)
      : String(fallback || '').trim();
  }

  function parseCell(a) {
    const m = /^([A-Z]+)(\d+)$/.exec(a);
    let c = 0;
    for (const x of m[1]) c = c * 26 + x.charCodeAt(0) - 64;
    return { r: Number(m[2]), c };
  }
  function parseRange(ref) {
    const p = ref.split(':');
    const a = parseCell(p[0]);
    const b = parseCell(p[1] || p[0]);
    return { r1:a.r, c1:a.c, r2:b.r, c2:b.c };
  }
  function cellRef(r, c) {
    let s = '';
    while (c) {
      const x = (c - 1) % 26;
      s = String.fromCharCode(65 + x) + s;
      c = Math.floor((c - 1) / 26);
    }
    return s + r;
  }
  const MASTER_FIELD_LABELS = {
    razonSocialPropietario:'Razón social / propietario', unidadProduccion:'Nombre de la unidad de producción', domicilio:'Domicilio de la unidad',
    folioSenasica:'Folio SENASICA', directorGeneral:'Alta Dirección',
    responsableInocuidad:'Responsable de inocuidad', responsableTecnico:'Responsable técnico',
    auxiliarSRRC:'Auxiliar SRRC', versionDocumento:'Versión', fechaEmision:'Fecha de emisión',
    vigenciaDocumento:'Vigencia',
    firmaElaboroNombre:'Elaboró · Nombre completo', firmaElaboroCargo:'Elaboró · Cargo',
    firmaRevisoNombre:'Revisó · Nombre completo', firmaRevisoCargo:'Revisó · Cargo',
    firmaAutorizoNombre:'Autorizó · Nombre completo', firmaAutorizoCargo:'Autorizó · Cargo'
  };
  function simpleMasterValue(field) {
    return (typeof masterValues !== 'undefined' && typeof masterKey !== 'undefined')
      ? (masterValues[masterKey(MASTER_FIELD_LABELS[field] || field)] || '')
      : '';
  }
  function signatureMasterValue(field) {
    const fields = {
      firmaElaboroNombre:['elaboro','nombre'], firmaElaboroCargo:['elaboro','cargo'],
      firmaRevisoNombre:['reviso','nombre'], firmaRevisoCargo:['reviso','cargo'],
      firmaAutorizoNombre:['autorizo','nombre'], firmaAutorizoCargo:['autorizo','cargo']
    };
    const target = fields[field];
    if (!target) return '';
    let value = '';
    if (typeof structuredValues !== 'undefined' && typeof masterKey !== 'undefined') {
      const signatures = structuredValues[masterKey('Firmas de elaboración, revisión y autorización')] || {};
      value = signatures[target[0]]?.[target[1]] || '';
    }
    if (value) return value;
    const fallback = {
      firmaElaboroNombre: simpleMasterValue('auxiliarSRRC'),
      firmaElaboroCargo: 'Auxiliar en SRRC',
      firmaRevisoNombre: simpleMasterValue('responsableInocuidad'),
      firmaRevisoCargo: 'Responsable de inocuidad',
      firmaAutorizoNombre: simpleMasterValue('directorGeneral'),
      firmaAutorizoCargo: 'Director general'
    };
    return fallback[field] || '';
  }
  function personnelMasterValue(field) {
    const match = /^personalNombre(\d{2})$/.exec(String(field || ''));
    if (!match || typeof structuredValues === 'undefined' || typeof masterKey === 'undefined') return '';
    const personnel = structuredValues[masterKey('Personal de la unidad')] || {};
    return personnel[`trabajador${match[1]}`]?.nombre || '';
  }
  function master(field) {
    const personal = personnelMasterValue(field);
    if (personal) return personal;
    const signature = signatureMasterValue(field);
    if (signature) return signature;
    const value = simpleMasterValue(field);
    if (value) return value;
    if (field === 'razonSocialPropietario') return simpleMasterValue('unidadProduccion');
    return '';
  }
  function masterFieldLabel(field) {
    const personal = /^personalNombre(\d{2})$/.exec(String(field || ''));
    if (personal) return `Personal de la unidad · Trabajador ${personal[1]}`;
    return MASTER_FIELD_LABELS[field] || field || 'Dato maestro';
  }

  const GENERIC_HEADER_MAP = {
    3: {
      'PORTADA':{folio:'H2',emision:'I3',version:'I4',vigencia:'I5'},
      'POES HIGIENE':{folio:'H2',emision:'J3',version:'J4',vigencia:'J5'},
      'POES PREPARACION MEZCLAS':{folio:'H2',emision:'J3',version:'J4',vigencia:'J5'},
      'FRENTE DOC 3.3 ':{folio:'AQ2',emision:'AU3',vigencia:'AU4',version:'AU5'},
      'ATRAS DOC  DOC 3.3':{folio:'AQ2',emision:'AU3',vigencia:'AU4',version:'AU5'},
      'ANALISIS DE PELIGRO FRENTE 3.0':{folio:'AQ2',emision:'AQ3',vigencia:'AQ4',version:'AQ5'},
      'ANALISIS DE PEL ATRAS 3.0':{folio:'AA2',emision:'AA3',vigencia:'AA4',version:'AA5'},
      'PLAN DE HIGIENE 3.1.':{folio:'AP2',emision:'AP3',vigencia:'AP4',version:'AP5'},
      'HIGIENE COMEDOR 3.1.':{folio:'AP2',emision:'AP3',vigencia:'AP4',version:'AP5'},
      'HIIGIENE CISTERNA Y TINACO 3.1':{folio:'AP2',emision:'AP3',vigencia:'AP4',version:'AP5'},
      'HIIGIENE ALAMCEN 3.1.':{folio:'AP2',emision:'AP3',vigencia:'AP4',version:'AP5'},
      'HIGIENE SANITARIOS 3.1.':{folio:'AP2',emision:'AP3',vigencia:'AP4',version:'AP5'},
      'HIGIENE  UNID PRODUCCIOIN 3.1':{folio:'AP2',emision:'AP3',vigencia:'AP4',version:'AP5'},
      'BIT HIGIENE DE INST B 06 FRENTE':{folio:'AS2',emision:'AW3',vigencia:'AW4',version:'AW5'},
      'BIT HIIENE INST B 06 ATRAS ':{folio:'AS2',emision:'AW3',vigencia:'AW4',version:'AW5'},
      'REV DE PERSONAL FRENTE BIT 08':{folio:'AR2',emision:'AU3',vigencia:'AU4',version:'AU5'},
      'REV PERSONAL ATRAS BIT 08':{folio:'AG2',emision:'AJ3',vigencia:'AJ4',version:'AJ5'},
      'REGLAMENTO INOCUIDAD 3.6 ':{folio:'AL2',emision:'AL3',vigencia:'AL4',version:'AL5'},
      'REGISTRO DE VISITANTES 3.8 ':{folio:'AA2',emision:'AA3',vigencia:'AA4',version:'AA5'}
    },
    4: {
      'PORTADA':{folio:'H2',emision:'I3',version:'I4',vigencia:'I5'},
      'POE  FAUNA ':{folio:'I2',emision:'K3',version:'K4',vigencia:'K5'},
      'ANALISIS DE PELIGRO DESCRIP  ':{folio:'AQ2',emision:'AQ3',vigencia:'AQ4',version:'AQ5'},
      'ANALISIS DE PEL ACCIO':{folio:'R2',emision:'R3',vigencia:'R4',version:'R5'},
      'PROTOCOLO DE FAUNA ':{folio:'AV2',emision:'AV3',vigencia:'AV4',version:'AV5'}
    },
    5: {
      'PORTADA':{folio:'H1',emision:'I4',version:'I5',vigencia:'I6'},
      'POE  CAPACITACION ':{folio:'I1',emision:'J4',version:'J5',vigencia:'J6'},
      'PROGRAMA DE CAPACITACION ':{folio:'AQ2',emision:'AQ3',vigencia:'AQ4',version:'AQ5'},
      'FORMATO CAPACITACION ':{folio:'Q2',emision:'Q3',vigencia:'Q4',version:'Q5'}
    },
    6: {
      'PORTADA':{folio:'H2',emision:'I3',version:'I4',vigencia:'I5'},
      'POE AUDITORIA ':{folio:'I2',emision:'K3',version:'K4',vigencia:'K5'},
      'PROGRAMA DE AUDITORIAS FRENTE  ':{folio:'AN2',emision:'AN3',vigencia:'AN4',version:'AN5'},
      'ACCIONES CORRECTIVAS ATRAS ':{folio:'S2',emision:'S3',vigencia:'S4',version:'S5'}
    },
    7: {
      'PORTADA':{folio:'H2',emision:'I3',version:'I4',vigencia:'I5'},
      'POE VALIDACION DE PROC':{folio:'I2',emision:'K3',version:'K4',vigencia:'K5'},
      'PLAN DE VALIDACION FRENTE ':{folio:'AL2',emision:'AL3',vigencia:'AL4',version:'AL5'},
      'REGISTRO DE TOMA DE MUESTRA ':{folio:'U2',emision:'U3',vigencia:'U4',version:'U5'}
    }
  };
  function headerValues(){ return { folio:master('folioSenasica')||'Folio pendiente', emision:master('fechaEmision')||'', vigencia:master('vigenciaDocumento')||'', version:master('versionDocumento')||'' }; }
  function resolveHeaderFormula(text){
    const f=String(text||''); if(!f.startsWith('='))return text;
    if(/CI\$?2/i.test(f))return master('unidadProduccion')||'RED Greenhouse';
    if(/CI\$?3/i.test(f))return master('domicilio')||'';
    if(/CI\$?4/i.test(f))return master('fechaEmision')||'';
    if(/CI\$?5/i.test(f))return master('vigenciaDocumento')||'';
    if(/CI\$?6/i.test(f))return master('versionDocumento')||'';
    const row=(f.match(/\$?[A-Z]+\$?(\d+)\s*$/i)||[])[1];
    if(row==='1'||row==='2')return master('folioSenasica')||'Folio pendiente';
    if(row==='3')return master('fechaEmision')||'';
    if(row==='4')return master('vigenciaDocumento')||'';
    if(row==='5')return master('versionDocumento')||'';
    return text;
  }
  const HEADER_CONCEPT_BY_KEY = {
    folio:'folioSenasica', emision:'fechaEmision', vigencia:'vigenciaDocumento', version:'versionDocumento'
  };
  function applyGenericHeaders(wb,n){
    const values=headerValues(), map=GENERIC_HEADER_MAP[n]||{};
    const moduleConfig=SRRC_MODULES.find(item=>Number(item.module)===Number(n));
    Object.entries(map).forEach(([sheetName,cells])=>{
      const sh=wb.sheet(sheetName)||wb.sheets().find(x=>String(x.name()).trim()===String(sheetName).trim()); if(!sh)return;
      const sheetIndex=(moduleConfig?.sheets||[]).findIndex(x=>String(x.name||'').trim()===String(sheetName).trim())+1;
      Object.entries(cells).forEach(([key,cell])=>{
        const concept=HEADER_CONCEPT_BY_KEY[key]||key;
        const referenceId=sheetIndex>0?`M${n}.HEADER.${sheetIndex}.${concept}`:'';
        const target=moduleReference(n,referenceId,cell).split(':')[0];
        if(target)sh.cell(target).value(values[key]||'');
      });
    });
  }

  function isHeaderLogoRange(ref) {
    try {
      const x = parseRange(String(ref || '').trim());
      return x.r1 <= 2 && x.c1 <= 2 && x.r2 <= 6 && x.c2 <= 8;
    } catch (_err) {
      return false;
    }
  }
  function isHeaderLogoControl(c) {
    return c?.type === 'logo' || (c?.type === 'image' && isHeaderLogoRange(c.range));
  }
  function corporateLogo() {
    const obj = (typeof masterValues !== 'undefined' && typeof masterKey !== 'undefined')
      ? masterValues[masterKey('Logo corporativo')]
      : null;
    if (obj && typeof obj === 'object') {
      const src = obj.dataUrl || obj.imageUrl || obj.thumbnailUrl || obj.url || '';
      if (src) return { src, url:obj.url || obj.imageUrl || src, name:obj.name || 'Logo corporativo', fileId:obj.fileId || '', dataUrl:obj.dataUrl || '', mimeType:obj.mimeType || obj.type || '' };
    }
    return { src:'assets/images/logo-redgreenhouse.png', url:'', name:'Logo corporativo RED Greenhouse', fileId:'', dataUrl:'', mimeType:'image/png' };
  }
  function dataUrlImage(dataUrl, fallbackMimeType) {
    const match = /^data:(image\/(?:png|jpe?g));base64,(.+)$/i.exec(String(dataUrl || ''));
    if (!match) return null;
    return { mimeType:match[1].toLowerCase().replace('image/jpg','image/jpeg'), base64:match[2] };
  }
  function bytesToBase64(bytes) {
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    return btoa(binary);
  }
  async function corporateLogoImage() {
    const logo = corporateLogo();
    const embedded = dataUrlImage(logo.dataUrl || logo.src, logo.mimeType);
    if (embedded) return embedded;
    if (logo.fileId && typeof m2GetDriveImage === 'function') return m2GetDriveImage(logo.fileId);
    const response = await fetch(logo.src);
    if (!response.ok) throw new Error('No se pudo leer el logo corporativo.');
    const blob = await response.blob();
    return { mimeType:blob.type || logo.mimeType || 'image/png', base64:bytesToBase64(new Uint8Array(await blob.arrayBuffer())) };
  }
  function inferredLogoRange(s) {
    const existing = (s.controls || []).find(isHeaderLogoControl);
    if (existing) return existing.range;
    const merged = (s.merges || []).map(ref => {
      try { return {ref, x:parseRange(ref)}; } catch (_err) { return null; }
    }).filter(Boolean).find(item => item.x.r1 <= 2 && item.x.c1 === 1 && item.x.r2 <= 6 && item.x.c2 >= 3 && item.x.c2 <= 8);
    if (merged) return merged.ref;
    if (/^PORTADA$/i.test(String(s.name || '').trim())) return 'A1:C6';
    return '';
  }
  function sheetControlsWithLogo(s) {
    const controls = [...(s.controls || [])];
    if (!controls.some(isHeaderLogoControl)) {
      const range = inferredLogoRange(s);
      if (range) controls.unshift({id:`AUTO.LOGO.${String(s.name || '').trim()}`,type:'logo',range,label:'Logo corporativo'});
    }
    return controls;
  }
  function controlHtml(c) {
    const v = values[c.id] ?? c.initial ?? '';
    if (c.type === 'masterData') {
      return `<div class="srrc-master-control" title="Dato maestro"><b>${esc(master(c.field) || 'Pendiente en Datos Maestros')}</b><small>${esc(masterFieldLabel(c.field))}</small></div>`;
    }
    if (isHeaderLogoControl(c)) {
      const logo = corporateLogo();
      return `<div class="srrc-logo-control">${logo.url ? `<a href="${esc(logo.url)}" target="_blank" rel="noopener">` : ''}<img src="${esc(logo.src)}" alt="${esc(logo.name)}">${logo.url ? '</a>' : ''}</div>`;
    }
    if (c.type === 'image') {
      const obj = typeof v === 'object' ? v : null;
      return `<div class="srrc-image-control">${obj?.imageUrl ? `<img src="${esc(obj.imageUrl)}"><a href="${esc(obj.url)}" target="_blank">Abrir evidencia</a>` : ''}<input class="drive-file-input" type="file" accept="image/*" data-srrc-image="${esc(c.id)}" hidden><button class="drive-upload-button" type="button" data-srrc-upload-trigger="${esc(c.id)}">${obj ? 'Cambiar imagen en Drive' : 'Subir al Drive'}</button><small>${esc(c.range)}</small></div>`;
    }
    if (c.type === 'status') { const opts=(Array.isArray(c.options)&&c.options.length?c.options:['✓','✗','NL','']); return `<button class="srrc-state${c.statusVariant==='rangeScale'?' srrc-state-range':''}" data-srrc-cycle="${esc(c.id)}" data-options="${esc(opts.join('|'))}" data-variant="${esc(c.statusVariant||'default')}" type="button">${esc(v)}</button>`; }
    if (c.type === 'checkbox') return `<label class="srrc-check"><input type="checkbox" data-srrc-check="${esc(c.id)}" ${v === false ? '' : 'checked'}><span>✓</span></label>`;
    if (c.type === 'trafficLight') return `<div class="srrc-traffic" data-srrc-traffic="${esc(c.id)}">${['verde','amarillo','rojo'].map(x => `<button type="button" data-value="${x}" class="${v === x ? 'active' : ''} ${x}"></button>`).join('')}</div>`;
    if (c.type === 'date') return `<input class="srrc-inline-input" type="date" data-srrc-input="${esc(c.id)}" value="${esc(v)}">`;
    if (c.type === 'email') return `<input class="srrc-inline-input" type="email" data-srrc-input="${esc(c.id)}" value="${esc(v)}" placeholder="nombre@dominio.com">`;
    if (c.type === 'tel') return `<input class="srrc-inline-input" type="tel" pattern="[0-9+() -]{7,25}" data-srrc-input="${esc(c.id)}" value="${esc(v)}" placeholder="+52 222 000 0000">`;
    if (c.type === 'code') { const opts=(c.options||[]); return `<select class="srrc-inline-input" data-srrc-input="${esc(c.id)}"><option value="">Seleccionar código…</option>${opts.map(x=>`<option value="${esc(x)}" ${String(v)===String(x)?'selected':''}>${esc(x)}</option>`).join('')}</select>`; }
    if (c.type === 'dynamicTemplate') return `<textarea class="srrc-inline-textarea srrc-dynamic-template" data-srrc-input="${esc(c.id)}">${esc(v)}</textarea>`;
    const long = String(c.initial || '').length > 80;
    return long ? `<textarea class="srrc-inline-textarea" data-srrc-input="${esc(c.id)}">${esc(v)}</textarea>` : `<input class="srrc-inline-input" data-srrc-input="${esc(c.id)}" value="${esc(v)}">`;
  }
  function renderSheet(s, pageIndex) {
    const top = {}, covered = new Set(), controls = {};
    for (const merge of s.merges) {
      const x = parseRange(merge);
      top[cellRef(x.r1,x.c1)] = {rowspan:x.r2-x.r1+1, colspan:x.c2-x.c1+1};
      for (let r=x.r1;r<=x.r2;r++) for (let c=x.c1;c<=x.c2;c++) if (r!==x.r1 || c!==x.c1) covered.add(cellRef(r,c));
    }
    for (const c of sheetControlsWithLogo(s)) {
      const x = parseRange(c.range);
      controls[cellRef(x.r1,x.c1)] = c;
      top[cellRef(x.r1,x.c1)] = {rowspan:x.r2-x.r1+1, colspan:x.c2-x.c1+1};
      for (let r=x.r1;r<=x.r2;r++) for (let cc=x.c1;cc<=x.c2;cc++) if (r!==x.r1 || cc!==x.c1) covered.add(cellRef(r,cc));
    }
    const page = s.pages && s.pages[pageIndex||0];
    const cStart=page?page.c1:1,cEnd=page?page.c2:s.maxCol;
    let h = '<div class="srrc-sheet-scroll"><table class="srrc-excel-table"><colgroup>';
    for (let c=cStart;c<=cEnd;c++) h += `<col style="width:${Math.max(45,Math.min(180,(s.cols[c]||10)*7))}px">`;
    h += '</colgroup><tbody>';
    for (let r=1;r<=s.maxRow;r++) {
      h += `<tr style="height:${Math.max(20,s.rows[r]||20)}px">`;
      for (let c=cStart;c<=cEnd;c++) {
        const ref = cellRef(r,c);
        if (covered.has(ref)) continue;
        const md = top[ref] || {};
        const d = s.cells[ref] || ['',0];
        const css = s.styles[d[1]] || '';
        h += `<td data-cell="${ref}" rowspan="${md.rowspan||1}" colspan="${md.colspan||1}" style="${css}">${controls[ref] ? controlHtml(controls[ref]) : esc(resolveHeaderFormula(d[0]))}</td>`;
      }
      h += '</tr>';
    }
    return h + '</tbody></table></div>';
  }
  function bind(root) {
    root.querySelectorAll('[data-srrc-input]').forEach((e) => e.oninput = () => { values[e.dataset.srrcInput] = e.value; save(); });
    root.querySelectorAll('[data-srrc-check]').forEach((e) => e.onchange = () => { values[e.dataset.srrcCheck] = e.checked; save(); });
    root.querySelectorAll('[data-srrc-cycle]').forEach((e) => e.onclick = () => {
      const a = e.dataset.options.split('|');
      const i = a.indexOf(e.textContent);
      e.textContent = a[(i + 1) % a.length];
      values[e.dataset.srrcCycle] = e.textContent;
      save();
    });
    root.querySelectorAll('[data-srrc-traffic] button').forEach((b) => b.onclick = () => {
      const p = b.parentElement;
      p.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      values[p.dataset.srrcTraffic] = b.dataset.value;
      save();
    });
    root.querySelectorAll('[data-srrc-upload-trigger]').forEach(btn=>btn.addEventListener('click',()=>{const input=root.querySelector(`[data-srrc-image="${CSS.escape(btn.dataset.srrcUploadTrigger)}"]`);if(input)input.click();}));
    root.querySelectorAll('[data-srrc-image]').forEach((e) => e.onchange = async () => {
      const f = e.files[0];
      if (!f) return;
      const url = galleryEndpoint();
      if (!url) return alert('Configura la URL de Apps Script en Administración.');
      e.disabled = true;
      try {
        const payload = { action:'uploadImage', fileName:f.name, mimeType:f.type || 'image/jpeg', base64:await fileToBase64(f), module:e.dataset.srrcImage.split('.')[0], field:e.dataset.srrcImage };
        const response = await fetch(url, { method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify(payload) });
        const result = await response.json();
        if (!result.ok) throw new Error(result.error || 'No se pudo subir');
        values[e.dataset.srrcImage] = result;
        save();
        const container = root.closest('[data-srrc-module]');
        openStructuredModule(Number(container.dataset.srrcModule));
      } catch (err) {
        alert(err.message);
      } finally {
        e.disabled = false;
      }
    });
  }
  window.openStructuredModule = function(n) {
    const m = SRRC_MODULES.find(x => x.module === n);
    const detail = document.getElementById('moduleDetail');
    detail.hidden = false;
    detail.dataset.srrcModule = n;
    detail.innerHTML = `<div class="module-detail-head"><div><h2>Módulo ${n} · ${esc(m.title)}</h2><p>Documento vivo: contenido original con zonas de captura incrustadas.</p></div><div><button class="primary-button" data-export-module="${n}">Generar Excel</button> <button class="ghost-button" data-close-module>Cerrar</button></div></div><div class="module-document-list">${m.sheets.map((s,i) => `<article class="excel-sheet-card"><div class="excel-sheet-row"><button class="excel-sheet-head" data-generic-toggle="${i}"><span class="sheet-index">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(s.name)}</strong><small>${s.controls.length} zonas de captura</small></span><span>⌄</span></button><label class="director-release"><input type="checkbox" data-director-release="M${n}|${esc(s.name)}" ${isDirectorReleased(`M${n}|${s.name}`)?'checked':''}><span>Liberado por Director</span></label></div><div class="excel-sheet-body" data-generic-body="${i}" hidden>${s.pages?`<div class="srrc-page-tabs">${s.pages.map((p,pi)=>`<button type="button" data-page-sheet="${i}" data-page-index="${pi}" class="${pi===0?'active':''}">${esc(p.label)}</button>`).join('')}</div><div data-page-host="${i}">${renderSheet(s,0)}</div>`:renderSheet(s)}</div></article>`).join('')}</div>`;
    detail.querySelector('[data-close-module]').onclick = () => detail.hidden = true;
    detail.querySelectorAll('[data-director-release]').forEach(c=>c.onchange=()=>{setDirectorReleased(c.dataset.directorRelease,c.checked);if(window.renderModules)window.renderModules();if(window.renderDashboard)window.renderDashboard();});
    detail.querySelectorAll('[data-generic-toggle]').forEach((b) => b.onclick = () => {
      const x = detail.querySelector(`[data-generic-body="${b.dataset.genericToggle}"]`);
      x.hidden = !x.hidden;
      if (!x.hidden) bind(x);
    });
    detail.querySelectorAll('[data-page-sheet]').forEach((b)=>b.onclick=()=>{ const si=Number(b.dataset.pageSheet),pi=Number(b.dataset.pageIndex),s=m.sheets[si],host=detail.querySelector(`[data-page-host="${si}"]`); b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b)); host.innerHTML=renderSheet(s,pi); bind(host); });
    detail.querySelector('[data-export-module]').onclick = () => exportModule(n);
    detail.scrollIntoView({behavior:'smooth',block:'start'});
  };
  async function exportModule(n) {
    const m = SRRC_MODULES.find(x => x.module === n);
    const button = document.querySelector(`[data-export-module="${n}"]`);
    const originalText = button?.textContent || 'Generar Excel';
    if (button) { button.disabled = true; button.textContent = 'Generando Excel…'; }
    try {
      if (typeof XlsxPopulate === 'undefined') throw new Error('No se cargó el motor de Excel.');
      if (typeof m2InsertImages !== 'function') throw new Error('No se cargó el motor de imágenes de Excel.');
      const response = await fetch(m.template);
      if (!response.ok) throw new Error('No se encontró la plantilla.');
      const templateBuffer = await response.arrayBuffer();
      const wb = await XlsxPopulate.fromDataAsync(templateBuffer.slice(0));
      applyGenericHeaders(wb,n);
      for (const s of m.sheets) {
        const sh = wb.sheet(s.name) || wb.sheets().find(x => String(x.name()).trim() === String(s.name).trim());
        if (!sh) continue;
        for (const c of s.controls) {
          const target = moduleReference(n,c.id,c.range).split(':')[0];
          if (!target) continue;
          const v = values[c.id] ?? c.initial ?? '';
          if (c.type === 'masterData') sh.cell(target).value(master(c.field) || '');
          else if (isHeaderLogoControl(c)) {
            // El logo se inserta como imagen después de guardar los valores del libro.
          } else if (c.type === 'image') {
            const o = typeof v === 'object' ? v : null;
            if (o?.url) sh.cell(target).formula(`HYPERLINK("${String(o.url).replace(/"/g,'""')}","Abrir evidencia fotográfica")`);
          } else if (c.type === 'checkbox') sh.cell(target).value(v === false ? '' : '✓');
          else if (c.type === 'trafficLight') {
            sh.cell(target).value(v ? String(v).toUpperCase() : '');
            if (v) sh.cell(target).style('fill', v === 'verde' ? '00B050' : v === 'amarillo' ? 'FFFF00' : 'FF0000');
          } else if (c.type === 'date' && v) {
            const [y,mo,d] = String(v).split('-');
            sh.cell(target).value(`${d}/${mo}/${y}`);
          } else sh.cell(target).value(v || '');
        }
      }
      const generatedBlob = await wb.outputAsync();
      let finalBuffer = await generatedBlob.arrayBuffer();
      const logoImage = await corporateLogoImage();
      const logo = corporateLogo();
      const insertions = [];
      for (const s of m.sheets) {
        const logoControls = sheetControlsWithLogo(s).filter(isHeaderLogoControl);
        for (const logoControl of logoControls) {
          const range = logoControl.id && !String(logoControl.id).startsWith('AUTO.')
            ? moduleReference(n,logoControl.id,logoControl.range)
            : logoControl.range;
          if (range) insertions.push({sheetName:s.name,range,image:logoImage,name:logo.name});
        }
      }
      if (insertions.length) finalBuffer = await m2InsertImages(finalBuffer,insertions);
      const blob = new Blob([finalBuffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MODULO ${n} LISTO PARA IMPRIMIR.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (error) {
      alert('No se pudo generar el Excel: ' + error.message);
    } finally {
      if (button) { button.disabled = false; button.textContent = originalText; }
    }
  }
  window.SRRC_RUNTIME = {modules:SRRC_MODULES, values};
})();
