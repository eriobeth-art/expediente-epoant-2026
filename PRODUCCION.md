# Publicación real del Expediente del Alumno

## Apps Script
1. En el proyecto de Apps Script: **Implementar > Nueva implementación**.
2. Tipo: **Aplicación web**.
3. Ejecutar como: **Yo**.
4. Quién tiene acceso: **Cualquiera**.
5. Implementar y autorizar.
6. Copiar la URL terminada en `/exec`.
7. Confirmar que coincida con `config.js`. Si Google entrega otra URL, sustituir `bridgeUrl`.

## GitHub Pages
1. Subir a la raíz del repositorio: `index.html`, `styles.css`, `app.js`, `forms.js`, `config.js`, `CNAME`.
2. Activar Pages desde `main` / raíz.
3. Custom domain: `expediente.edupsic.com`.
4. Activar HTTPS.

## DNS
Crear CNAME: `expediente` -> `TU_USUARIO.github.io`.

URL final esperada: `https://expediente.edupsic.com`


## Endpoint de producción confirmado

`https://script.google.com/macros/s/AKfycbyWDG7dnYQ6VgNLXG4UCInoFr0b9WxZtLVUVJE3tnQdp8A0I222vV4j1TgEPPvTlag/exec`
