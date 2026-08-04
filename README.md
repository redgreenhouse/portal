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

## Cambios de la versión 1.50A

| Descripción del cambio | Archivo afectado |
|---|---|
| Se reemplazó el encabezado dividido del Home por un Hero continuo a todo lo ancho. | `index.html`, `styles.css` |
| Se integró el saludo y el objetivo próximo dentro del mismo banner. | `index.html`, `styles.css` |
| Se preparó y recortó una imagen específica para la proporción horizontal del Dashboard. | `assets/images/dashboard-banner.png` |
| Se agregó degradado para mejorar la lectura sin ocultar la fotografía. | `styles.css` |
