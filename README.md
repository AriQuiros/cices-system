# Proyecto CICES System

Este repositorio contiene el backend (Spring Boot en Java) y el frontend (React + Vite) del proyecto CICES System, además de un archivo `docker-compose.yaml` en la raíz para ejecutar ambos servicios en contenedores.

Resumen de carpetas relevantes:

- `backend_cices_system/` - Aplicación backend (Spring Boot, Java 21). Contiene `Dockerfile`, `mvnw` y `pom.xml`.
- `frontend_cices_system/` - Aplicación frontend (React + Vite). Contiene `Dockerfile` y `package.json`.
- `docker-compose.yaml` - Orquesta los contenedores `backend` y `frontend`.

Requisitos locales (opcionales si usa Docker):

- Java 21 (si ejecuta el backend sin Docker)
- Maven (o use `mvnw` incluido)
- Node.js 20+ y npm (si ejecuta el frontend sin Docker)
- Docker y Docker Compose (recomendado para ejecución integrada)

Uso con Docker Compose (recomendado)

1. Construir y levantar los contenedores:

```powershell
# Desde la raíz del proyecto
docker compose up --build -d

# O para ver con logs en tiempo real (sin -d):
docker compose up --build

```

2. Ver registros:

```powershell
docker compose logs -f
# O por servicio
docker logs -f cices-backend
docker logs -f cices-frontend
```

3. Detener y eliminar los contenedores:

```powershell
docker compose down
```

4. Para reconstruir/levantar sólo un servicio (por ejemplo backend):

```powershell
docker compose up --build -d backend
```

Notas:

- El `docker-compose.yaml` expone el backend en el puerto 8080 y el frontend en el puerto 80 (mapeados como `8080:8080` y `80:80`).
- El backend lee variables de entorno desde el archivo indicado por la variable `COMPOSE_ENV_FILE` o `.env.local` por defecto (ver `env_file` en `docker-compose.yaml`).

Notas:

- El `docker-compose.yaml` expone:
    - Backend: `http://localhost:8080`
    - Frontend: `http://localhost`

- El backend corre internamente en el puerto `8080`.
- El frontend (Nginx + React) se publica en el puerto `80`.

- Para probar el sistema en navegador:
    - Frontend: `http://localhost`
    - API backend: `http://localhost:8080`

- El backend lee variables de entorno desde el archivo indicado por la variable `COMPOSE_ENV_FILE` o `.env.local` por defecto (ver `env_file` en `docker-compose.yaml`).


# Variables de entorno

Antes de ejecutar el sistema, debe existir un archivo (no debe subirse al repositorio):

```text
backend_cices_system/.env.local
```

Ejemplo:

```env
# Base de datos Oracle local
DB_URL=jdbc:oracle:thin:@host.docker.internal:1521:XE
DB_USERNAME=usuario
DB_PASSWORD=contrasena

# JWT — cambiar por una cadena larga y segura
JWT_SECRET=secret-key
JWT_EXPIRATION=8

# Brevo
BREVO_API_KEY=tu_api_key
BREVO_SENDER_EMAIL=correo@ejemplo.com
BREVO_SENDER_NAME=NOMBRE_API
```

## Importante

En el archivo `docker-compose.yaml` debe existir:

```env
COMPOSE_ENV_FILE=.env.local
```

Esto indica que Docker Compose utilizará el archivo:

```text
backend_cices_system/.env.local
```

para cargar las variables de entorno del backend.

## Notas

* `JWT_SECRET` es obligatorio.
* Si falta alguna variable requerida, el backend no iniciará correctamente.
* Para despliegue en otros entornos (servidor virtual, producción, etc.), se recomienda usar un archivo `.env` diferente con credenciales reales.


Enlaces rápidos a README específicos:

- `backend_cices_system/README.md` - instrucciones sobre compilación y ejecución del backend.
- `frontend_cices_system/README.md` - instrucciones sobre compilación y ejecución del frontend.


