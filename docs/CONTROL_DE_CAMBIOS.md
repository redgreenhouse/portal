# Control de cambios — V1.39

| Cambio | Archivo | Dónde buscar | Cómo verificar |
|---|---|---|---|
| Fecha de emisión con calendario | `app.js` | `masterDateInputValue()`, `masterInputHtml()` | En Datos Maestros > Control documental, Fecha de emisión debe mostrar selector de calendario. |
| Fechas documentales legibles | `module2-embedded.js` | `m2DisplayDate()`, `m2HeaderMasterValues()` | Una fecha guardada como AAAA-MM-DD debe mostrarse como DD/MM/AAAA en las cabeceras del M2. |
| Eliminación del logotipo flotante duplicado | `module2-embedded.js` | `m2ApplyLiveHeader()` | En las hojas 01–03 no debe aparecer un logotipo adicional por encima de la cuadrícula. |
| Un solo logotipo en cabeceras alternativas | `module2-embedded.js` | `m2AddImages()` | Mapas y croquis con cabecera resumida no deben duplicar el logotipo. |
| Evidencia de Drive como hipervínculo real en Excel | `module2-embedded.js` | `m2GenerateExcel()` | La celda destino debe decir “Abrir evidencia fotográfica” y abrir la URL de Drive. |
| Versión y caché | `index.html` | `V1.39`, `?v=1.39` | Portal público y privado deben mostrar 1.39. |
