RED Greenhouse Portal v1.86

# RED Greenhouse Portal V1.86

Respaldo completo del portal con el Módulo 3 cerrado y validado.

Cambios acumulados recientes:

- FRENTE DOC 3.3 con cuatro estados: ✓, !, X, NL y vacío.
- Textos editables conservando valores precargados.
- ANALISIS DE PELIGRO FRENTE 3.0 con textos amarillos editables y checkboxes.
- ANALISIS DE PEL ATRAS 3.0 con campos editables y columnas restauradas.
- BIT HIIENE INST B 06 ATRAS con VERIFICÓ como texto normal.
- Referencias Excel sincronizadas con la definición vigente del M3.
- Versión visible y caché actualizadas a 1.86.
## Coordenadas oficiales congeladas

- Se integraron 7,655 referencias exportadas desde el navegador el 2026-08-07.
- `config/excel-reference-defaults.json` conserva el respaldo legible.
- `config/excel-reference-defaults.js` alimenta la exportación cuando no existe un mapa local.
- `config/field-map.json` fue sobrescrito con estas coordenadas.
- “Restaurar originales” conserva el mapa congelado y las nuevas referencias de v1.83.

## Ajuste v1.77
- Eliminado el campo duplicado de nombre de la unidad en PORTADA de M8 y M9.
- Retirado también del mapa de referencias y del respaldo congelado.
- M8 y M9 quedan con 7 zonas de captura en PORTADA.


## Ajuste v1.78 · M9
- Hoja 9.0: contenido amarillo precargado como texto editable.
- Hoja 9.0: Probabilidad y Severidad con 90 checkboxes.
- Hoja 9.0: columna MÉTODO completa con 30 campos editables.


## Ajuste v1.80 · M14
- Hoja 14.1: 65 controles booleanos convertidos a checkbox real.
- Hoja 14.2: 84 checkboxes agregados en Materia Prima y Transporte.
- Hoja 14.2: Aceptación y Rechazo convertidos a checkbox real.
- Se conserva el ZIP base del usuario con sus templates limpios actualizados.


## Ajuste v1.81 · M15
- Eliminados los cuatro campos extra del pie de la hoja 15.0 (AN69, AO69:AX69, AN70 y AO70:AX70).
- Versión visible y caché actualizadas a 1.81.

## Ajuste v1.82 · M12 hoja 12.0
- Las 72 celdas de Probabilidad y Severidad ahora son checkbox X/vacío.
- Se conservan los mismos IDs y coordenadas del mapa de referencias.
- Los valores anteriores X se interpretan como marcados; vacío permanece desmarcado.

## Ajuste v1.83 · respaldo de coordenadas
- Se congelaron 7,655 referencias Excel exportadas el 2026-08-07.
- “Restaurar originales” vuelve ahora a este mapa de coordenadas.


## Ajuste v1.84 · M12 hoja 12.0
- La columna FASE del análisis de peligro quedó editable en sus cuatro bloques.
- Se conservaron los textos actuales como valores precargados.
- Los nuevos campos exportan a D11:E16, D17:E22, D23:E28 y D29:E34.
- El respaldo de coordenadas v1.83 permanece intacto como punto seguro de recuperación.

## Ajuste v1.85 · M12 hoja 12.0 · segunda parte

- Se añadieron como texto editable las 4 celdas combinadas de la columna FASE en la sección de tratamiento / plan de acción.
- Rangos: B53:C58, B59:C64, B65:C70 y B71:C76.
- Se conservaron los textos originales precargados y las referencias Excel.
- No se modificó la plantilla Excel.
## Ajuste v1.86 · M12 hoja 12.1 · agroquímicos jitomate USA
- Hoja 12.1 precargada con 13 agroquímicos evaluados para jitomate destinado a exportación a Estados Unidos.
- Se incorporan RSCO, vigencia, referencia eCFR, PPM USA, intervalos y categoría toxicológica como campos editables en LIVE.
- La segunda parte se precarga con 5 formuladores/distribuidores principales, evitando duplicados por producto.
- Se conserva intacto el respaldo de coordenadas `referencias-excel-v1.83-respaldo.json`.

