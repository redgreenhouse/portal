/* RED Greenhouse v1.89 · Operación mobile-first */
(() => {
  const money = n => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(Number(n)||0);
  const num = n => new Intl.NumberFormat('es-MX',{maximumFractionDigits:0}).format(Number(n)||0);
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const EVENT_TYPES = [
    {id:'GASTO',icon:'🧾',label:'Gasto',group:'Finanzas',fields:['concepto','importe','proveedor','formaPago']},
    {id:'COSECHA',icon:'🍅',label:'Cosecha',group:'Producción',fields:['tunel','clasificacion','kg','operador']},
    {id:'VENTA',icon:'💰',label:'Venta',group:'Comercial',fields:['cliente','clasificacion','kg','precioKg']},
    {id:'COBRO',icon:'💵',label:'Cobro',group:'Finanzas',fields:['cliente','importe','cuenta','referencia']},
    {id:'PAGO',icon:'💳',label:'Pago',group:'Finanzas',fields:['proveedor','importe','cuenta','referencia']},
    {id:'FUMIGACION',icon:'🧪',label:'Fumigación',group:'Producción',fields:['tunel','producto','kg','operador']},
    {id:'RIEGO',icon:'💧',label:'Riego',group:'Producción',fields:['tunel','duracion','operador']},
    {id:'LIMPIEZA',icon:'🧹',label:'Limpieza',group:'Mantenimiento',fields:['zona','operador','observaciones']},
    {id:'MANTENIMIENTO',icon:'🔧',label:'Mantenimiento',group:'Mantenimiento',fields:['zona','concepto','importe','operador']},
    {id:'COMPRA',icon:'🛒',label:'Compra',group:'Finanzas',fields:['concepto','importe','proveedor','formaPago']},
    {id:'PLANTADO',icon:'🌱',label:'Plantado',group:'Producción',fields:['tunel','variedad','cantidad','operador']},
  ];
  const history = [
    {id:'EVT-000001',date:'2026-03-01',type:'COMPRA',desc:'Compra de injertos Mufaxa 2 tallos',amount:27000,party:'Proveedor por definir'},
    {id:'EVT-000002',date:'2026-03-01',type:'COMPRA',desc:'Compra de injertos Top Maria 2 tallos',amount:24000,party:'Proveedor por definir'},
    {id:'EVT-000003',date:'2026-03-01',type:'COMPRA',desc:'Compra de injertos Prunaxx XR 2 tallos',amount:87780,party:'Proveedor por definir'},
    {id:'EVT-000004',date:'2026-03-01',type:'COMPRA',desc:'Compra de injertos Prunaxx XR 4 tallos',amount:24750,party:'Proveedor por definir'},
    {id:'EVT-000005',date:'2026-03-01',type:'COMPRA',desc:'Compra de injertos Mufaxa 4 tallos',amount:3400,party:'Proveedor por definir'},
    {id:'EVT-000006',date:'2026-03-02',type:'PLANTADO',desc:'Distribución de injertos a túneles y camas',amount:0,party:'Producción',qty:14084,unit:'tallos'},
    {id:'EVT-000022',date:'2026-07-01',type:'GASTO',desc:'Fertilizante Sulmag y MAP',amount:20080,party:'Proveedor por definir'},
    {id:'EVT-000023',date:'2026-07-05',type:'GASTO',desc:'Abejorros 2 colmenas',amount:4308,party:'Proveedor por definir'},
    {id:'EVT-000101',date:'2026-07-13',type:'VENTA',desc:'Venta de jitomate Primera',amount:3000,party:'Javier Zaca',qty:600,unit:'kg',status:'Pagado'},
    {id:'EVT-000102',date:'2026-07-23',type:'VENTA',desc:'Venta de jitomate Primera',amount:30000,party:'Gerbacio Coyote',qty:4200,unit:'kg',status:'Pagado'},
    {id:'EVT-000103',date:'2026-07-24',type:'VENTA',desc:'Venta de jitomate Primera',amount:30780,party:'Diego',qty:3420,unit:'kg',status:'Pagado'},
    {id:'EVT-000104',date:'2026-07-27',type:'VENTA',desc:'Venta de jitomate Segunda',amount:1520,party:'Paco',qty:160,unit:'kg',status:'Por cobrar'},
    {id:'EVT-000105',date:'2026-07-27',type:'VENTA',desc:'Venta de jitomate Tercera',amount:1190,party:'Paco',qty:140,unit:'kg',status:'Por cobrar'},
    {id:'EVT-000106',date:'2026-07-27',type:'VENTA',desc:'Venta de jitomate Canicas',amount:980,party:'Paco',qty:140,unit:'kg',status:'Por cobrar'},
    {id:'EVT-000107',date:'2026-07-30',type:'VENTA',desc:'Venta de jitomate Primera',amount:54150,party:'Diego',qty:3800,unit:'kg',status:'Por cobrar'},
    {id:'EVT-000108',date:'2026-07-30',type:'VENTA',desc:'Venta de jitomate Segunda',amount:150.1,party:'Diego',qty:19,unit:'kg',status:'Por cobrar'},
    {id:'EVT-000109',date:'2026-07-30',type:'VENTA',desc:'Venta de jitomate Segunda',amount:1500,party:'Javier Zaca',qty:120,unit:'kg',status:'Pagado'},
    {id:'EVT-000110',date:'2026-07-30',type:'VENTA',desc:'Venta de jitomate Tercera',amount:880,party:'Javier Zaca',qty:80,unit:'kg',status:'Pagado'},
    {id:'EVT-000111',date:'2026-08-03',type:'VENTA',desc:'Venta de jitomate Primera',amount:53337.75,party:'Diego',qty:3743,unit:'kg',status:'Pagado'},
    {id:'EVT-000112',date:'2026-08-06',type:'VENTA',desc:'Venta de jitomate Primera',amount:51442.5,party:'Diego',qty:3610,unit:'kg',status:'Por cobrar'}
  ];
  const expenseTotal = 188149.94, salesTotal=228930.35, receivable=109432.60, collected=119497.75, forecast=188931.6;
  const plans=[2000,5000,6000,7000,8000,8000,8000,8000,8000,8000,8000,8000,8000,8000,8000,8000,8000,7000,7000,7000,7000,7000,6000,6000,6000,5000,5000,4000];
  const real={1:600,2:8060,3:8218,4:4130};
  let selectedType='COSECHA';
  let customEvents=JSON.parse(localStorage.getItem('redGreenhouseOperationEvents')||'[]');
  const allEvents=()=>[...customEvents,...history];
  const typeInfo=id=>EVENT_TYPES.find(x=>x.id===id)||{icon:'•',label:id,group:'Operación',fields:[]};
  function persist(){localStorage.setItem('redGreenhouseOperationEvents',JSON.stringify(customEvents));}
  function launchGrid(){
    const el=document.getElementById('eventLaunchGrid'); if(!el)return;
    const quick=['COSECHA','VENTA','COBRO','PAGO','GASTO','RIEGO','FUMIGACION','LIMPIEZA','MANTENIMIENTO','COMPRA','PLANTADO'];
    el.innerHTML=quick.map(id=>{const t=typeInfo(id);return `<button class="event-launch" data-event-type="${id}"><span>${t.icon}</span><strong>${t.label}</strong><small>${t.group}</small></button>`}).join('');
    el.querySelectorAll('[data-event-type]').forEach(b=>b.onclick=()=>openCapture(b.dataset.eventType));
  }
  function renderRecent(){
    const el=document.getElementById('opsRecentEvents'); if(!el)return;
    el.innerHTML=allEvents().slice(0,7).map(e=>{const t=typeInfo(e.type); return `<div class="ops-event-row"><span class="ops-event-icon">${t.icon}</span><div><strong>${esc(e.desc)}</strong><small>${esc(e.party||'')} · ${e.date}</small></div><b>${e.amount?money(e.amount):(e.qty?num(e.qty)+' '+esc(e.unit):'')}</b></div>`}).join('');
  }
  function renderKPIs(){
    const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
    set('opsSalesTotal',money(salesTotal)); set('opsSalesMeta',num(21008)+' kg registrados'); set('opsReceivable',money(receivable)); set('opsExpensesTotal',money(expenseTotal)); set('opsForecastKg',num(forecast)+' kg');
    const week=4, rp=real[week], pp=plans[week-1], pct=Math.min(100,Math.round(rp/pp*100)); set('opsWeekReal',num(rp)+' kg'); set('opsWeekPlan','de '+num(pp)+' kg planeados'); const fill=document.getElementById('opsWeekFill');if(fill)fill.style.width=pct+'%';
    const profit=salesTotal-expenseTotal, cash=collected-expenseTotal; set('opsProfit',money(profit)); set('opsCashFlow',money(cash)); set('opsProfitLarge',money(profit)); set('opsCashLarge',money(cash)); set('opsReceivableLarge',money(receivable));
  }
  function formField(f){
    const map={tunel:['Túnel','select',['Túnel 1','Túnel 2','Túnel 3','Túnel 4','Túnel 5']],clasificacion:['Clasificación','select',['Primera','Segunda','Tercera','Canicas']],kg:['Kg','number'],precioKg:['Precio por kg','number'],cliente:['Cliente','text'],proveedor:['Proveedor','text'],importe:['Importe','number'],cuenta:['Cuenta','text'],referencia:['Referencia','text'],operador:['Operador','text'],producto:['Producto','text'],duracion:['Duración (min)','number'],zona:['Zona','text'],concepto:['Concepto','text'],formaPago:['Forma de pago','select',['Banco','Efectivo']],variedad:['Variedad','text'],cantidad:['Cantidad','number'],observaciones:['Observaciones','text']};
    const d=map[f]||[f,f,'text']; if(d[1]==='select')return `<label class="mobile-field"><span>${d[0]}</span><select name="${f}">${d[2].map(x=>`<option>${x}</option>`).join('')}</select></label>`;
    return `<label class="mobile-field"><span>${d[0]}</span><input name="${f}" type="${d[1]}" ${d[1]==='number'?'step="0.01" min="0"':''} placeholder="${d[0]}"></label>`;
  }
  function openCapture(type){
    selectedType=type; showView('capturar'); renderCapture();
  }
  function renderCapture(){
    const el=document.getElementById('eventCaptureApp'); if(!el)return; const t=typeInfo(selectedType);
    el.innerHTML=`<div class="mobile-page-head"><button class="back-chip" data-go="inicio">← Inicio</button><span class="eyebrow">NUEVO EVENTO</span><h1>${t.icon} ${t.label}</h1><p>Captura solo lo necesario. Fecha y hora se registran automáticamente.</p></div><div class="capture-type-strip">${EVENT_TYPES.map(x=>`<button class="type-chip ${x.id===selectedType?'active':''}" data-type="${x.id}">${x.icon} ${x.label}</button>`).join('')}</div><form class="mobile-event-form card" id="mobileEventForm"><div class="event-form-date"><strong>Hoy</strong><span>${new Intl.DateTimeFormat('es-MX',{dateStyle:'medium',timeStyle:'short'}).format(new Date())}</span></div><div class="mobile-fields">${t.fields.map(formField).join('')}</div><label class="mobile-field"><span>Observaciones</span><textarea name="observaciones" rows="3" placeholder="Opcional"></textarea></label><button class="mobile-save-button" type="submit">Guardar ${t.label}</button><p class="mobile-save-note">El evento quedará pendiente de sincronización con Google Sheets.</p></form>`;
    el.querySelectorAll('[data-type]').forEach(b=>b.onclick=()=>openCapture(b.dataset.type)); el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>showView(b.dataset.go));
    el.querySelector('#mobileEventForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target),obj={id:'EVT-'+String(Date.now()).slice(-8),date:new Date().toISOString().slice(0,10),type:selectedType,desc:t.label,amount:Number(fd.get('importe')||0),party:fd.get('cliente')||fd.get('proveedor')||'',qty:Number(fd.get('kg')||fd.get('cantidad')||0),unit:fd.get('kg')?'kg':(fd.get('cantidad')?'unidad':''),status:'Registrado',data:Object.fromEntries(fd.entries())};customEvents.unshift(obj);persist();renderAllOperation();showView('eventos');renderEvents();};
  }
  function renderEvents(){
    const el=document.getElementById('eventsHistoryApp'); if(!el)return;
    el.innerHTML=`<div class="page-heading mobile-list-heading"><div><span class="eyebrow">BITÁCORA OPERATIVA</span><h1>Eventos</h1><p>Histórico cargado + eventos capturados desde el celular.</p></div><button class="primary-button" id="newEventBtn">+ Evento</button></div><div class="event-filter-bar">${['TODOS',...EVENT_TYPES.map(x=>x.id)].map(x=>`<button class="filter ${x==='TODOS'?'active':''}" data-filter="${x}">${x==='TODOS'?'Todos':typeInfo(x).icon+' '+typeInfo(x).label}</button>`).join('')}</div><section class="card event-history-list" id="eventHistoryList"></section>`;
    const draw=(filter='TODOS')=>{const list=filter==='TODOS'?allEvents():allEvents().filter(e=>e.type===filter);document.getElementById('eventHistoryList').innerHTML=list.map(e=>{const t=typeInfo(e.type);return `<article class="event-history-row"><span class="ops-event-icon">${t.icon}</span><div><strong>${esc(e.desc)}</strong><small>${esc(e.party||'')} · ${e.date} · ${esc(e.id)}</small></div><span>${e.qty?num(e.qty)+' '+esc(e.unit):''}</span><b>${e.amount?money(e.amount):'—'}</b><em class="event-status">${esc(e.status||'Registrado')}</em></article>`}).join('')};
    draw(); el.querySelector('#newEventBtn').onclick=()=>openCapture('COSECHA'); el.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{el.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');draw(b.dataset.filter)});
  }
  function renderProduction(){
    const el=document.getElementById('productionApp'); if(!el)return; el.innerHTML=`<div class="page-heading"><div><span class="eyebrow">OPERACIÓN AGRÍCOLA</span><h1>Producción</h1><p>Seguimiento por túnel y eventos de campo.</p></div><button class="primary-button" id="prodCapture">+ Registrar</button></div><section class="tunnel-grid">${[['Túnel 1',2842,40986],['Túnel 2',2442,35218],['Túnel 3',2526,36432],['Túnel 4',2695,38861],['Túnel 5',3579,37435]].map(x=>`<article class="card tunnel-card"><span>${x[0]}</span><strong>${num(x[1])}</strong><small>tallos distribuidos</small><b>${money(x[2])}</b><small>kg pronosticados</small></article>`).join('')}</section><section class="card"><div class="section-heading"><div><span class="eyebrow">EVENTOS DE CAMPO</span><h2>Capturas recientes</h2></div></div><div class="ops-event-list">${allEvents().filter(e=>['COSECHA','RIEGO','FUMIGACION','LIMPIEZA','MANTENIMIENTO','PLANTADO'].includes(e.type)).slice(0,10).map(e=>`<div class="ops-event-row"><span class="ops-event-icon">${typeInfo(e.type).icon}</span><div><strong>${esc(e.desc)}</strong><small>${e.date}</small></div><b>${e.qty?num(e.qty)+' '+esc(e.unit):'Evento'}</b></div>`).join('')||'<div class="empty-state">Aún no hay eventos de campo capturados.</div>'}</div></section>`; el.querySelector('#prodCapture').onclick=()=>openCapture('COSECHA');
  }
  function renderCommercial(){
    const el=document.getElementById('commercialApp');if(!el)return; const sales=allEvents().filter(e=>e.type==='VENTA'); el.innerHTML=`<div class="page-heading"><div><span class="eyebrow">COMERCIAL</span><h1>Ventas y cobros</h1><p>Separa el reconocimiento de la venta del momento real del cobro.</p></div><button class="primary-button" id="saleCapture">+ Registrar venta</button></div><section class="summary-grid"><article class="summary-card"><span>Ventas</span><strong>${money(salesTotal)}</strong></article><article class="summary-card"><span>Kg vendidos</span><strong>${num(21008)}</strong></article><article class="summary-card"><span>Cobrado</span><strong>${money(collected)}</strong></article><article class="summary-card"><span>Por cobrar</span><strong>${money(receivable)}</strong></article></section><section class="card event-history-list"><div class="section-heading"><div><span class="eyebrow">HISTÓRICO</span><h2>Ventas existentes</h2></div></div>${sales.map(e=>`<article class="event-history-row"><span class="ops-event-icon">💰</span><div><strong>${esc(e.party)}</strong><small>${e.date} · ${esc(e.desc)}</small></div><span>${num(e.qty)} kg</span><b>${money(e.amount)}</b><em class="event-status">${esc(e.status)}</em></article>`).join('')}</section>`;el.querySelector('#saleCapture').onclick=()=>openCapture('VENTA');
  }
  function renderFinance(){
    const el=document.getElementById('financeApp');if(!el)return; const profit=salesTotal-expenseTotal,cash=collected-expenseTotal; el.innerHTML=`<div class="page-heading"><div><span class="eyebrow">CONTROL FINANCIERO</span><h1>Finanzas</h1><p>Vista de computadora para resultados, liquidez, bancos y efectivo.</p></div></div><section class="finance-kpi-grid"><article class="card finance-kpi"><span>Ventas</span><strong>${money(salesTotal)}</strong><small>Reconocidas</small></article><article class="card finance-kpi"><span>Gastos</span><strong>${money(expenseTotal)}</strong><small>Histórico disponible</small></article><article class="card finance-kpi"><span>Utilidad provisional</span><strong>${money(profit)}</strong><small>Ventas - gastos registrados</small></article><article class="card finance-kpi"><span>Flujo provisional</span><strong>${money(cash)}</strong><small>Cobros - salidas históricas</small></article></section><section class="finance-two-col"><article class="card financial-statement"><div class="section-heading"><div><span class="eyebrow">ESTADO DE RESULTADOS</span><h2>Resultado provisional</h2></div></div><div class="statement-row"><span>Ventas</span><b>${money(salesTotal)}</b></div><div class="statement-row"><span>(-) Gastos operativos registrados</span><b>-${money(expenseTotal)}</b></div><div class="statement-row total"><span>Utilidad / pérdida provisional</span><b>${money(profit)}</b></div><p class="statement-note">No incluye todavía depreciación, costo de ventas completo, impuestos ni ajustes contables. Se actualizará con la clasificación definitiva.</p></article><article class="card financial-statement"><div class="section-heading"><div><span class="eyebrow">LIQUIDEZ / CASH FLOW</span><h2>Flujo provisional</h2></div></div><div class="statement-row"><span>Cobros de clientes</span><b>${money(collected)}</b></div><div class="statement-row"><span>(-) Salidas históricas registradas</span><b>-${money(expenseTotal)}</b></div><div class="statement-row"><span>Saldo inicial</span><b>POR DEFINIR</b></div><div class="statement-row total"><span>Flujo neto antes de saldo inicial</span><b>${money(cash)}</b></div><p class="statement-note">Falta integrar estados de cuenta bancarios, efectivo, financiamiento y saldos iniciales.</p></article></section><section class="card evidence-panel"><div><span class="eyebrow">EVIDENCIA FINANCIERA</span><h2>Banco y efectivo</h2><p>El siguiente paso es importar estados de cuenta y registrar caja. El portal los conciliará contra eventos.</p></div><div class="evidence-actions"><button class="primary-button" data-go="configuracion">Configurar conexión</button><button class="ghost-button" id="openBankTemplate">Ver estructura bancaria</button></div></section>`;
  }
  function renderPlanning(){
    const el=document.getElementById('planningApp');if(!el)return; const rows=plans.map((p,i)=>{const w=i+1,r=real[w]||0,pct=Math.round(r/p*100);return `<tr><td>Semana ${w}</td><td>${num(p)} kg</td><td>${num(r)} kg</td><td><div class="tiny-progress"><i style="width:${Math.min(100,pct)}%"></i></div>${pct}%</td></tr>`}).join(''); el.innerHTML=`<div class="page-heading"><div><span class="eyebrow">PLANEACIÓN</span><h1>Planeación semanal</h1><p>Horizonte de planeación contra cosecha/venta real.</p></div></div><section class="card planning-head"><div><strong>Producción pronosticada</strong><span>${num(forecast)} kg</span></div><div><strong>Venta real acumulada</strong><span>${num(21008)} kg</span></div><div><strong>Brecha actual</strong><span>${num(forecast-21008)} kg</span></div></section><section class="card planning-table-wrap"><table class="planning-table"><thead><tr><th>Semana</th><th>Planeación</th><th>Real</th><th>Cumplimiento</th></tr></thead><tbody>${rows}</tbody></table></section>`;
  }
  function renderAllOperation(){launchGrid();renderRecent();renderKPIs();renderEvents();renderProduction();renderCommercial();renderFinance();renderPlanning();}
  const originalShow=window.showView;
  // app.js defines showView as a lexical function; navigation buttons still work. Bind our custom view names through existing listeners.
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(renderAllOperation,50);});
  setTimeout(renderAllOperation,100);
  setTimeout(()=>{
    const url=document.getElementById('sheetsWebAppUrl'),op=document.getElementById('sheetsOperationId'),fin=document.getElementById('sheetsFinanceId'),btn=document.getElementById('saveSheetsConfigButton'),msg=document.getElementById('sheetsMessage');
    if(!btn)return; const cfg=JSON.parse(localStorage.getItem('redGreenhouseSheetsConfig')||'{}'); if(url)url.value=cfg.url||''; if(op)op.value=cfg.operationId||''; if(fin)fin.value=cfg.financeId||'';
    btn.onclick=()=>{localStorage.setItem('redGreenhouseSheetsConfig',JSON.stringify({url:url?.value.trim()||'',operationId:op?.value.trim()||'',financeId:fin?.value.trim()||''}));if(msg){msg.textContent='Configuración guardada';setTimeout(()=>msg.textContent='',2200)}};
  },150);
})();
