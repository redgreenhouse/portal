# v1.33 · Drive y cabeceras M2–M10

## Portal
- Configuración independiente para las carpetas **Images** y **plantillas** de Google Drive.
- El Módulo 2 muestra un botón explícito **Subir a Google Drive** después de elegir una imagen.
- Las imágenes se organizan automáticamente por módulo dentro de `Images`.
- Se corrigió la protección visual del Excel para ignorar archivos XML internos inexistentes.
- M3–M10 resuelven Folio SENASICA, Emisión, Vigencia, Versión y Domicilio por la etiqueta visible del formato, no sólo por la clasificación original del color.
- La exportación restaura dibujos originales de la plantilla, incluido el logotipo, después de escribir los datos.

## Apps Script
Actualizar `AppsScript/Code.gs` y publicar una versión nueva del despliegue existente.
La URL `/exec` no cambia.

## Validación pendiente en Microsoft Excel
Esta versión fue validada sintácticamente. La revisión visual definitiva debe realizarse descargando una hoja de cada módulo M2–M10.
