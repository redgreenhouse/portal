# RED Greenhouse Portal V1.60

| Cambio realizado | Archivos afectados |
|---|---|
| Reproceso de M8, M9 y M10 usando las plantillas limpias adjuntas | `templates/MODULO-8-PLANTILLA.xlsx`, `MODULO-9-PLANTILLA.xlsx`, `MODULO-10-PLANTILLA.xlsx` |
| Página LIVE basada en el área de impresión vertical de cada hoja | `srrc-modules.js`, `config/field-map.json` |
| Conversión de los bloques horizontales de M8 y M9 a páginas una debajo de otra | `srrc-modules.js`, `config/field-map.json` |
| Integración de PORTADA y hojas verticales de M10 | `srrc-modules.js`, `config/field-map.json` |
| Limpieza automática, una sola vez, de referencias antiguas únicamente para M8–M10 | `srrc-runtime.js` |
| Versión y caché actualizadas | `config.js`, `index.html` |

## Prueba recomendada

Abrir M8 hoja 8.3, M9 hojas 9.0 y 9.1, y M10 hojas 10.0 y 10.3. Las páginas deben aparecer verticales y el Excel generado debe conservar exactamente las plantillas limpias adjuntas.
