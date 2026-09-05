# EPOANT · Expediente de Orientación Educativa V2.0.3

Esta versión corrige:
- “El servidor todavía no está disponible”.
- Comunicación entre GitHub Pages y Google Apps Script.
- Agrega el logo oficial EPOANT en la pantalla inicial.
- Elimina el texto sobre la validación de la contraseña administrativa.

## PASO 1 · Actualizar Google Apps Script

Del ZIP completo sustituye:
- backend/Code.gs
- backend/Bridge.html

Luego:
1. Guarda.
2. NO ejecutes de nuevo `instalarAccesoAdministrador()` si ya tienes una contraseña que deseas conservar.
3. Ve a Implementar > Administrar implementaciones.
4. Edita la implementación actual.
5. Selecciona Nueva versión.
6. Pulsa Implementar.

La contraseña administrativa guardada en Script Properties se conserva.

## PASO 2 · Actualizar GitHub

Sube los archivos del ZIP SOLO_GITHUB y reemplaza los anteriores.

Incluye:
- index.html
- styles.css
- app.js
- admin.js
- forms.js
- config.js
- CNAME
- epoant-logo.png

Después haz una recarga forzada con Cmd + Shift + R.

Dominio:
https://expediente.edupsic.com

Usuario administrador:
eriobeth


## Corrección V2.0.3
Se corrigió el diálogo "Expediente individual" del Panel Administrador:
- Ya no se recorta el texto del lado izquierdo.
- Se eliminó el desplazamiento horizontal accidental.
- CURP, expediente, nombre del tutor y teléfonos se ajustan al ancho disponible.
- En tablet/celular el detalle pasa automáticamente a una sola columna.

Esta corrección es únicamente de GitHub/frontend. No requiere actualizar Apps Script.


## V2.0.4
- Logo completo EPOANT proporcionado por el usuario.
- Logo en inicio de sesión, vista móvil, cabecera del estudiante y cabecera del administrador.
- Logo como favicon/icono del navegador.
- Corrección adicional del expediente individual: se anula el desplazamiento horizontal al abrir el diálogo.

Esta actualización es únicamente de GitHub/frontend. No requiere modificar Apps Script.


## V2.0.5
- El filtro "Todos los grados" se oculta automáticamente cuando solo existe un grado.
- Si en el futuro existen estudiantes de dos o más grados, el filtro reaparece automáticamente.
- Se conservan siempre los filtros "Todos los grupos" y "Todos los avances".

Esta actualización es únicamente de GitHub/frontend. No requiere modificar Apps Script.
