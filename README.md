# Expediente del Alumno · EPOANT

Paquete listo para publicar en GitHub Pages y usar el subdominio `expediente.edupsic.com`.

## Estructura
- `index.html` — interfaz del estudiante.
- `styles.css` — diseño responsive.
- `forms.js` — instrumentos y reactivos.
- `app.js` — login, sesión, panel, progreso y formularios.
- `config.js` — URL del Apps Script.
- `CNAME` — dominio personalizado.
- `backend/Code.gs` — backend de Apps Script.
- `backend/Bridge.html` — puente seguro entre GitHub Pages y Apps Script.
- `backend/appsscript.json` — manifiesto.

## 1. Backend en Google Apps Script
1. Abre el proyecto de Apps Script asociado al expediente (o crea uno nuevo).
2. Pega `backend/Code.gs` en `Code.gs`.
3. Crea un archivo HTML llamado exactamente `Bridge` y pega `backend/Bridge.html`.
4. En **Configuración del proyecto**, habilita la visualización del archivo de manifiesto y sustituye su contenido por `backend/appsscript.json` si deseas fijar explícitamente zona horaria y scopes.
5. Ejecuta una función manual (por ejemplo `apiDashboard` no funciona sin token; basta con guardar y después desplegar) y autoriza acceso a Sheets y Drive cuando Google lo solicite.
6. **Implementar > Nueva implementación > Aplicación web**.
   - Ejecutar como: **tu cuenta (usuario que implementa)**.
   - Quién tiene acceso: **Cualquiera / Anyone** (para que el estudiante no requiera cuenta Google).
7. `config.js` ya está configurado para producción con la URL que termina en `/exec`.
8. En Apps Script debes crear o actualizar la implementación de tipo **Aplicación web** y confirmar que Google muestre esa misma URL `/exec`. Si Google genera un identificador distinto, reemplaza únicamente `bridgeUrl` en `config.js` por la nueva URL `/exec`.

> El frontend no hace `fetch` directo a Apps Script. Carga un iframe oculto de Bridge y se comunica por `postMessage`; Bridge usa `google.script.run`. Esto evita depender de CORS y mantiene el PIN fuera de la URL.

## 2. Base ya configurada
Este paquete apunta a:
- Google Sheets: `EPOANT - Expediente de Orientación Educativa`
- ID: `1r57hCIKx9wckOfA_ZA1uEI1IShnnqyoKFbXSXzevl8U`
- Carpeta raíz de expedientes: `1gN23FQrhmrmDRgHvOh4KtkEoSB4Fbh4p`

El login usa:
- Usuario: CURP (`LOGIN` / `CURP`)
- PIN: 6 dígitos
- Verificación: SHA-256 contra `PIN_HASH`
- Sesión: token temporal en `CacheService` (6 horas)

## 3. GitHub Pages
1. Crea un repositorio, por ejemplo `expediente-alumno`.
2. Sube **el contenido de esta carpeta** a la raíz del repositorio.
3. En GitHub abre **Settings > Pages**.
4. Publica desde la rama `main` y carpeta `/ (root)`.
5. En **Custom domain**, escribe `expediente.edupsic.com`.
6. Activa **Enforce HTTPS** cuando GitHub lo habilite.

## 4. DNS de edupsic.com
En el proveedor DNS crea un registro:
- Tipo: `CNAME`
- Host / Nombre: `expediente`
- Destino: `TU_USUARIO.github.io`
- TTL: automático o predeterminado.

No incluyas `https://` ni el nombre del repositorio en el destino del CNAME.

El archivo `CNAME` ya contiene:
`expediente.edupsic.com`

## 5. Flujo del estudiante
1. CURP + PIN.
2. Panel con nombre, grado, grupo, expediente y porcentaje.
3. Las actividades se desbloquean secuencialmente:
   1. Ficha de Identificación
   2. Ficha Biopsicosocial / Entrevista
   3. Test de Barsch
   4. Hábitos de Estudio
   5. Familiograma
   6. Estudio Socioeconómico
4. Al guardar:
   - registra en `RESPUESTAS`;
   - genera PDF;
   - registra en `DOCUMENTOS`;
   - guarda en carpeta individual de Drive;
   - ofrece enlace de WhatsApp al tutor;
   - habilita la siguiente actividad.
5. Al 100%, con `AUTO_CONSTANCIA: true`, genera la constancia y la registra en `CIERRES`.

## Seguridad
- Nunca publiques el Google Sheet con acceso público.
- El Apps Script debe ejecutarse como el propietario para que los estudiantes no necesiten permisos de Drive.
- El PIN no se guarda en GitHub ni en `localStorage`.
- El navegador conserva solo un token temporal en `sessionStorage`.
- Si cambias el PIN, vuelve a calcular `PIN_HASH` con SHA-256.
- Antes de usarlo con todos los estudiantes, prueba una cuenta completa en incógnito y desde un teléfono.

## Cambios rápidos
En `backend/Code.gs`:
- `AUTO_CONSTANCIA: true` — genera constancia automáticamente al 100%.
- Cambia a `false` si quieres habilitarla manualmente después de revisión.

En `config.js`:
- ya está configurado con la URL `/exec` para producción.
