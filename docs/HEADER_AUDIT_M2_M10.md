# Auditoría de cabeceras M2–M10

La exportación usa Datos Maestros y corrige el campo por la etiqueta visible (Folio SENASICA, Emisión, Vigencia, Versión y Domicilio). Los dibujos originales de cada plantilla, incluido el logotipo, se restauran después de escribir los datos.

| Módulo | Hojas | Hojas con logo en plantilla | Hojas con controles de cabecera |
|---:|---:|---:|---:|
| 2 | 12 | 12 (rangos configurados) | 12 (mapeo explícito) |
| 3 | 19 | 18 | 18 |
| 4 | 5 | 5 | 5 |
| 5 | 4 | 3 | 3 |
| 6 | 4 | 4 | 4 |
| 7 | 4 | 4 | 4 |
| 8 | 5 | 0 | 1 |
| 9 | 4 | 0 | 2 |
| 10 | 4 | 0 | 2 |

## Cambios de esta versión

- Configuración separada para las carpetas **Images** y **plantillas**.
- Las imágenes de cada módulo se guardan automáticamente en una subcarpeta M2, M3… dentro de Images.
- La exportación de M3–M10 resuelve campos de cabecera por la etiqueta visible, aun cuando el mapeo coloreado tuviera una clasificación incorrecta.
- Se restauran los dibujos originales de las plantillas después de la exportación para conservar el logotipo.
- El M2 omite de forma segura archivos XML internos inexistentes, evitando el error `Cannot read properties of null (reading async)`.

La validación definitiva debe hacerse descargando al menos una hoja de cada módulo en Microsoft Excel.