# CONTROL DE CAMBIOS

## Versión 1.40

| Cambio | Archivo | Cómo verificar | Estado |
|---|---|---|---|
| Campo maestro **Vigencia** tipo fecha | `app.js` | Datos Maestros → Control documental | Implementado |
| Campo maestro **Logo corporativo** tipo imagen | `app.js` | Datos Maestros → Identidad | Implementado |
| Subida del logo mediante el endpoint existente de Drive | `app.js` | Subir imagen y volver a abrir Datos Maestros | Implementado; requiere Apps Script ya desplegado |
| Nombre y vínculo de la imagen maestra | `app.js` | Debe aparecer nombre y enlace **Ver imagen** | Implementado |
| Logo maestro en cabeceras visibles del M2 | `module2-embedded.js` | Abrir hojas 1–12 del M2 | Implementado con fallback al logo local |
| Número de versión 1.40 y caché de recursos | `index.html` | Público y privado deben mostrar 1.40 | Implementado |
| Logo de Drive incrustado físicamente en el Excel | — | Descargar Excel | Pendiente; no se declara implementado |
