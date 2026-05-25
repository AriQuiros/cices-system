# Backend - backend_cices_system

Aplicación backend basada en Spring Boot (Java 21). Este README muestra cómo ejecutar la aplicación de forma local para desarrollo (sin crear un JAR ni usar Docker).

Requisitos locales:

- Java 21 instalado (si no usa el wrapper de Maven)
- Maven (opcional, puede usar el wrapper `mvnw`/`mvnw.cmd` incluido)

Ejecución para desarrollo (Windows PowerShell):

1) Desde la raíz del repositorio:

```powershell
cd backend_cices_system
```

2) Ejecutar con el wrapper de Maven (método recomendado durante el desarrollo):

```powershell
.\mvnw.cmd spring-boot:run
```

3) Alternativa (si tiene Maven instalado):

```powershell
mvn spring-boot:run
```

Comportamiento y parada:

- La aplicación arrancará en el puerto 8080 por defecto (ver `application.properties` o la configuración de su proyecto).
- Para detenerla en la terminal presione Ctrl+C.

Variables de entorno y configuración:

- Durante el desarrollo puede definir propiedades en `src/main/resources/application.properties` o usar variables de entorno.
- Si utiliza `docker-compose` en producción/local con contenedores, el archivo `docker-compose.yaml` referencia un `.env.local` por defecto, pero para desarrollo local no es obligatorio.

Ver logs en la consola donde ejecutó `spring-boot:run` para información y posibles errores.

Si quieres, puedo añadir ejemplos de variables de entorno mínimas necesarias o un archivo `.env.example`.
