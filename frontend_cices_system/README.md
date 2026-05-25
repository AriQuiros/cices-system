# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# Frontend - frontend_cices_system (instrucciones en español)

Aplicación frontend construida con React + Vite. A continuación se indican los pasos mínimos para ejecutar el frontend en modo desarrollo (localmente, sin Docker).

Requisitos locales:

- Node.js 20+ y npm

Ejecución para desarrollo (Windows PowerShell):

1) Entrar en la carpeta del frontend:

```powershell
cd frontend_cices_system
```

2) Instalar dependencias (una sola vez o cuando se actualizan):

```powershell
npm ci
```

3) Levantar servidor de desarrollo con hot-reload:

```powershell
npm run dev
```

- Vite por defecto sirve en http://localhost:5173 (si ese puerto está ocupado te indicará otro puerto)
- Para detener el servidor presiona Ctrl+C en la terminal donde se ejecuta.

Consideraciones para desarrollo con backend:

- Asegúrate de tener el backend corriendo en http://localhost:8080 (o el puerto que uses) para que las llamadas API del frontend funcionen.
- Si hay problemas de CORS, habilita/ajusta la configuración CORS en el backend temporalmente durante el desarrollo.

Comandos auxiliares (opcional):

- Construir para producción (genera `dist/`):

```powershell
npm run build
```

- Previsualizar la build localmente:

```powershell
npm run preview
```

Si quieres que elimine las secciones relativas a Docker o añada ejemplos de configuración de CORS para desarrollo, lo hago ahora.


