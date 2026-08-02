# CONTROL DE CAMBIOS V1.36

| Cambio | Archivo | Función o sección | Cómo verificar |
|---|---|---|---|
| Cabeceras M3–M7 en Excel | `srrc-runtime.js` | `GENERIC_HEADER_MAP` y `applyGenericHeaders()` | Descargar un Excel de M3–M7 y revisar Folio, Emisión, Vigencia y Versión. |
| Datos Maestros en vista web M3–M7 | `srrc-runtime.js` | `resolveHeaderFormula()` y `renderSheet()` | Abrir una hoja con fórmula externa; ya no debe mostrarse `='[1]1.1'!...`. |
| Cabeceras M2 protegidas | `module2-embedded.js` | `m2RestoreTemplateFormulas()` | Descargar M2; la restauración de fórmulas no debe borrar cabeceras, firmas ni vínculos. |
| Error de dibujos M2 | `module2-embedded.js` | `m2RestoreTemplateDrawings()` | Generar M2; no debe aparecer el error `reading 'async'`. |
| Versión visible | `index.html` | Botón público y estado privado | Debe decir `Acceso Portal V1.36` y `Versión activa 1.36`. |
