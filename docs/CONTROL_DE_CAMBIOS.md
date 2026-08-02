# Control de cambios — V1.38

| Cambio | Archivo | Dónde buscar | Cómo verificar |
|---|---|---|---|
| Cabecera web vinculada en las 12 hojas del M2 | `module2-embedded.js` | `M2_HTML_HEADER_CELLS`, `m2ApplyLiveHeader()` | Abrir cada hoja: empresa, domicilio, folio, emisión, vigencia y versión deben venir de Datos Maestros. |
| Cabecera alternativa para mapas/croquis/organigrama sin celdas HTML | `module2-embedded.js` | `m2HeaderSummaryHtml()` | En las hojas 05, 06, 07, 08 y 11 debe aparecer la cabecera vinculada completa. |
| Logo visible cuando la réplica no contiene área de imagen | `module2-embedded.js` y `styles.css` | `m2-live-header-logo`, `m2-live-logo-fallback` | Las 12 hojas deben mostrar el logotipo. |
| Corrección de coordenadas POE | `module2-embedded.js` y `config/field-map.json` | `POE MTTO INFRAESTR` | Emisión, versión y vigencia usan `I3`, `I4`, `I5`. |
| Nombres exactos de hojas M2 | `module2-embedded.js` y `config/field-map.json` | `M2_SHEET_NAME_BY_CODE` | Polígonos y Bitácora atrás deben localizar su hoja real. |
| Versión y control de caché | `index.html` | `V1.38` y `?v=1.38` | Sitio público y privado muestran 1.38; JS/CSS se recargan. |
