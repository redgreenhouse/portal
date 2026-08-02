(function () {
  const STORE = 'redGreenhouseModuleCaptureV128';
  let values = JSON.parse(localStorage.getItem(STORE) || '{}');
  const save = () => localStorage.setItem(STORE, JSON.stringify(values));
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

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
  function master(field) {
    const map = {
      unidadProduccion:'Nombre de la unidad de producción', domicilio:'Domicilio de la unidad',
      folioSenasica:'Folio SENASICA', directorGeneral:'Alta Dirección',
      responsableInocuidad:'Responsable de inocuidad', responsableTecnico:'Responsable técnico',
      auxiliarSRRC:'Auxiliar SRRC', versionDocumento:'Versión', fechaEmision:'Fecha de emisión',
      vigenciaDocumento:'Vigencia'
    };
    return (typeof masterValues !== 'undefined' && typeof masterKey !== 'undefined') ? (masterValues[masterKey(map[field] || field)] || '') : '';
  }
  function controlHtml(c) {
    const v = values[c.id] ?? c.initial ?? '';
    if (c.type === 'masterData') {
      return `<div class="srrc-master-control" title="Dato maestro"><b>${esc(master(c.field) || 'Pendiente en Datos Maestros')}</b><small>${esc(c.field)}</small></div>`;
    }
    if (c.type === 'image') {
      const obj = typeof v === 'object' ? v : null;
      return `<div class="srrc-image-control">${obj?.imageUrl ? `<img src="${esc(obj.imageUrl)}"><a href="${esc(obj.url)}" target="_blank">Abrir evidencia</a>` : ''}<div class="srrc-image-upload-row"><label><input type="file" accept="image/*" data-srrc-image="${esc(c.id)}"><span>${obj ? 'Elegir otra imagen' : 'Elegir imagen'}</span></label><button type="button" class="primary-button" data-srrc-upload="${esc(c.id)}" disabled>Subir a Google Drive</button></div><small>${esc(c.range)}</small></div>`;
    }
    if (c.type === 'status') return `<button class="srrc-state" data-srrc-cycle="${esc(c.id)}" data-options="✓|✗|NL|" type="button">${esc(v)}</button>`;
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
    for (const c of s.controls) {
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
        h += `<td data-cell="${ref}" rowspan="${md.rowspan||1}" colspan="${md.colspan||1}" style="${css}">${controls[ref] ? controlHtml(controls[ref]) : esc(d[0])}</td>`;
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
    const pendingImages = new Map();
    root.querySelectorAll('[data-srrc-image]').forEach((e) => e.onchange = () => {
      const f=e.files[0],button=root.querySelector(`[data-srrc-upload="${CSS.escape(e.dataset.srrcImage)}"]`);if(!f){pendingImages.delete(e.dataset.srrcImage);if(button)button.disabled=true;return;}pendingImages.set(e.dataset.srrcImage,f);if(button)button.disabled=false;
    });
    root.querySelectorAll('[data-srrc-upload]').forEach((button)=>button.onclick=async()=>{
      const id=button.dataset.srrcUpload,f=pendingImages.get(id);if(!f)return alert('Primero selecciona una imagen.');const url=galleryEndpoint();if(!url)return alert('Configura la URL de Apps Script en Administración.');button.disabled=true;button.textContent='Subiendo…';
      try{const payload={action:'uploadImage',fileName:f.name,mimeType:f.type||'image/jpeg',base64:await fileToBase64(f),module:id.split('.')[0],field:id};const response=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});const result=await response.json();if(!result.ok)throw new Error(result.error||'No se pudo subir');values[id]=result;save();const container=root.closest('[data-srrc-module]');openStructuredModule(Number(container.dataset.srrcModule));}catch(err){alert(err.message);}finally{button.disabled=false;button.textContent='Subir a Google Drive';}
    });
  }
  window.openStructuredModule = function(n) {
    const m = SRRC_MODULES.find(x => x.module === n);
    const detail = document.getElementById('moduleDetail');
    detail.hidden = false;
    detail.dataset.srrcModule = n;
    detail.innerHTML = `<div class="module-detail-head"><div><h2>Módulo ${n} · ${esc(m.title)}</h2><p>Documento vivo: contenido original con zonas de captura incrustadas.</p></div><div><button class="primary-button" data-export-module="${n}">Generar Excel</button> <button class="ghost-button" data-close-module>Cerrar</button></div></div><div class="module-document-list">${m.sheets.map((s,i) => `<article class="excel-sheet-card"><button class="excel-sheet-head" data-generic-toggle="${i}"><span class="sheet-index">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(s.name)}</strong><small>${s.controls.length} zonas de captura</small></span><span class="sheet-head-actions">${typeof releaseControl==='function'?releaseControl(n,s.name):''}<span>⌄</span></span></button><div class="excel-sheet-body" data-generic-body="${i}" hidden>${s.pages?`<div class="srrc-page-tabs">${s.pages.map((p,pi)=>`<button type="button" data-page-sheet="${i}" data-page-index="${pi}" class="${pi===0?'active':''}">${esc(p.label)}</button>`).join('')}</div><div data-page-host="${i}">${renderSheet(s,0)}</div>`:renderSheet(s)}</div></article>`).join('')}</div>`;
    detail.querySelector('[data-close-module]').onclick = () => detail.hidden = true;if(typeof bindDirectorRelease==='function')bindDirectorRelease(detail);
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
    if (typeof XlsxPopulate === 'undefined') return alert('No se cargó el motor de Excel.');
    const response = await fetch(m.template);
    if (!response.ok) return alert('No se encontró la plantilla.');
    const wb = await XlsxPopulate.fromDataAsync(await response.arrayBuffer());
    for (const s of m.sheets) {
      const sh = wb.sheet(s.name) || wb.sheets().find(x => String(x.name()).trim() === String(s.name).trim());
      if (!sh) continue;
      for (const c of s.controls) {
        const target = c.range.split(':')[0];
        const v = values[c.id] ?? c.initial ?? '';
        if (c.type === 'masterData') sh.cell(target).value(master(c.field) || '');
        else if (c.type === 'image') {
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
    const blob = await wb.outputAsync();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MODULO ${n} LISTO PARA IMPRIMIR.xlsx`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  window.SRRC_RUNTIME = {modules:SRRC_MODULES, values};
})();
