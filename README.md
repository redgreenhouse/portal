# RED Greenhouse Portal V1.76

Respaldo completo del portal con el Módulo 3 cerrado y validado.

Cambios acumulados recientes:

- FRENTE DOC 3.3 con cuatro estados: ✓, !, X, NL y vacío.
- Textos editables conservando valores precargados.
- ANALISIS DE PELIGRO FRENTE 3.0 con textos amarillos editables y checkboxes.
- ANALISIS DE PEL ATRAS 3.0 con campos editables y columnas restauradas.
- BIT HIIENE INST B 06 ATRAS con VERIFICÓ como texto normal.
- Referencias Excel sincronizadas con la definición vigente del M3.
- Versión visible y caché actualizadas a 1.76.
## Coordenadas oficiales congeladas

- Se integraron 7,316 referencias exportadas desde el navegador el 2026-08-06.
- `config/excel-reference-defaults.json` conserva el respaldo legible.
- `config/excel-reference-defaults.js` alimenta la exportación cuando no existe un mapa local.
- `config/field-map.json` fue sobrescrito con estas coordenadas.
- “Restaurar originales” regresa ahora a este mapa corregido de v1.76.


## Ajuste v1.76
- Eliminado el campo incorrecto “Razón social / propietario” de la segunda hoja de M5, M6 y M7.
- El campo fue retirado de LIVE, exportación y mapa de referencias.
