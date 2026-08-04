# RED Greenhouse Portal V1.55

| Cambio realizado | Archivos afectados |
|---|---|
| Las zonas de logotipo de todas las hojas activas M2–M7 usan automáticamente el Logo corporativo de Datos Maestros; si no existe, muestran el logo incluido en el portal | `srrc-runtime.js`, `styles.css` |
| Las zonas de logotipo ya no muestran “Subir al Drive” ni escriben hipervínculos al exportar; el Excel conserva el logo existente de la plantilla | `srrc-runtime.js` |
| Se detectan automáticamente las dos hojas sin zona de logo configurada: M3 “HIIGIENE ALAMCEN 3.1.” y M5 “PORTADA” | `srrc-runtime.js` |
| Versión y caché actualizadas | `config.js`, `index.html` |
