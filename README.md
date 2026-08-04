Versión actual: 1.35

# RED Greenhouse Portal v1.29

Incluye sitio público, intranet, galería en Drive y documentos vivos para los módulos 2 a 7.

## Plantillas
Las plantillas limpias están en `/templates`. El Módulo 5 usa provisionalmente el archivo original como plantilla hasta recibir una versión limpia.

## Apps Script
Actualiza el proyecto con `apps-script/Code.gs` y publica una nueva versión del despliegue.


## Galería v1.29

La administración de la galería permite editar título y descripción, ocultar/mostrar una foto y eliminarla. Al eliminar una fotografía de Google Drive, el Apps Script la envía a la papelera y elimina su registro de la galería.

Después de copiar el nuevo `apps-script/Code.gs`, publique una **nueva versión del despliegue existente**. La URL `/exec` permanece igual.


## v1.30 preliminar
- Módulos 8, 9 y 10 integrados desde original/coloreado/plantilla.
- Plantilla dinámica (morado), Código (rosa mexicano), correo y teléfono.
- Navegación por páginas horizontales en M8 hoja 8.3.
- Galería: refresco y retiro de tarjeta local al eliminar.
- Rutas de logo unificadas.


## v1.31
- Módulo 2: selección de imagen sube directamente a Google Drive y muestra miniatura persistente.
- Excel M2: restaura logos/dibujos originales de la plantilla.
- Excel M2: llena Folio SENASICA, emisión, vigencia y versión en todas las cabeceras mapeadas.
- Evidencias: se exportan como hipervínculo Abrir evidencia fotográfica.

## Cambios de la versión 1.50

| Descripción del cambio | Archivo(s) afectado(s) |
|---|---|
| Centralización del número de versión para el portal público y privado. | `config.js`, `index.html`, `app.js` |
| Sustitución del logotipo construido con HTML por la imagen oficial. | `index.html`, `styles.css`, `assets/images/logo-redgreenhouse.png` |
| Limpieza de la barra lateral y reducción a las áreas funcionales. | `index.html`, `styles.css` |
| Nuevo Dashboard ejecutivo con hero fotográfico, indicadores, dona, barras y estado de módulos. | `index.html`, `app.js`, `styles.css`, `assets/images/dashboard-banner.png` |
| Creación de la página Certificaciones con acceso a Inocuidad, Módulos y Referencias Excel. | `index.html`, `app.js`, `styles.css` |
| Simplificación de Datos Maestros sin modificar ni eliminar la información almacenada. | `index.html`, `app.js`, `styles.css` |
| Eliminación visual de nivel de certeza, matriz de utilización, etiquetas de módulos e impacto. | `index.html`, `app.js`, `styles.css` |
| Eliminación de la columna “Destino confirmado” en capturas estructuradas. | `app.js` |
| Simplificación de las tarjetas de módulos para mostrar hojas y liberaciones del Director. | `app.js`, `styles.css` |
| Conservación intacta del motor de exportación, plantillas y mapeos del Módulo 2. | Sin cambios en `module2-embedded.js`, `capture.js`, `templates/` y `config/` |
