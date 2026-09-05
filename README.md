# EPOANT · Expediente de Orientación Educativa V2.0.2

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
