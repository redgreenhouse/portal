# RED Greenhouse Portal V1.57

| Cambio realizado | Archivos afectados |
|---|---|
| Se procesaron las 13 hojas faltantes de los módulos 8, 9 y 10 | `srrc-modules.js`, `config/field-map.json` |
| Las referencias guardadas ahora gobiernan la exportación de todos los módulos M3–M10 | `srrc-runtime.js` |
| Se reconstruyeron las cabeceras de M8–M10 para usar Datos Maestros y se agregaron zonas de logo en cada bloque imprimible | `srrc-modules.js` |
| Referencias Excel y Captura SRRC ahora incluyen M2–M10 | `config/field-map.json`, `capture.js` |
| Versión y caché actualizadas | `config.js`, `index.html` |

## Prueba recomendada

Generar un Excel de M8, M9 y M10. Si una celda requiere ajuste, modificarla en **Referencias Excel**, pulsar **Guardar referencias** y volver a generar el módulo.
