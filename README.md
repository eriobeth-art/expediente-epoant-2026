# EPOANT · Expediente de Orientación Educativa V2

Versión de producción con dos módulos:

- Portal del estudiante: CURP + PIN.
- Panel administrador: acceso independiente protegido en Google Apps Script.

## Publicación en GitHub
Sube a GitHub Pages:
- index.html
- styles.css
- app.js
- admin.js
- forms.js
- config.js
- CNAME

NO es necesario subir la carpeta `backend` a GitHub.

## Actualización de Google Apps Script
Sustituye en tu proyecto:
- Code.gs
- Bridge.html
- appsscript.json (solo si deseas mantener el manifiesto incluido)

Después:
1. Guarda.
2. Ejecuta una sola vez `instalarAccesoAdministrador()`.
3. Autoriza si Google lo solicita.
4. Abre **Registro de ejecución** y copia el usuario y la contraseña temporal.
5. Ve a **Implementar > Administrar implementaciones > Editar > Nueva versión > Implementar**.
6. Conserva la misma URL `/exec` si actualizas la implementación existente.

### Acceso administrador
El usuario inicial es `eriobeth`.
La contraseña temporal se genera de forma aleatoria al ejecutar `instalarAccesoAdministrador()`.
No queda escrita en GitHub, Google Sheets ni en el HTML.

Al ingresar al panel usa **Cambiar contraseña** para establecer una contraseña propia.

## Funciones del panel administrador
- Indicadores generales.
- Búsqueda y filtros por grado, grupo y avance.
- Avance individual.
- Documentos PDF.
- Diagnóstico integral.
- Seguimiento conductual.
- Validación de cierre académico y conductual.
- Generación/habilitación de constancia.
- Recordatorio por WhatsApp.
- Sincronización desde la base maestra de Datos de Identificación sin borrar historial.
