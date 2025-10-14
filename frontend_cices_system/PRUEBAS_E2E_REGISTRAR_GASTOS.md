# Pruebas Funcionales E2E para RegistrarGastosFinancieros con Cypress

## 📋 Resumen

Se crearon **pruebas funcionales End-to-End** completas para la funcionalidad **RegistrarGastosFinancieros** utilizando **Cypress**, cubriendo tanto casos exitosos como de error, además de validaciones de interfaz de usuario.

## 🏗️ Estructura de Pruebas E2E

### Archivos de Configuración

#### 1. cypress.config.js
**Propósito:** Configuración principal de Cypress
- Base URL: `http://localhost:5173` (Vite dev server)
- API URL: `http://localhost:8080` (Spring Boot backend)
- Timeouts configurados para mejor estabilidad
- Screenshots automáticos en fallos

#### 2. cypress/support/commands.js
**Propósito:** Comandos personalizados reutilizables

**Comandos implementados:**
- `cy.loginInvestigador(username, password)` - Login automatizado
- `cy.irARegistrarGastos()` - Navegación con mocks de APIs
- `cy.llenarFormularioGasto(gasto)` - Llenado automático de formularios

### Fixtures (Datos de Prueba)

#### 1. investigador_login.json
```json
[
    {
        "usuario": "derby.munoz.rojas@ucr.ac.cr",
        "contrasena": "admin123",
        "rol": "investigador"
    }
]
```

#### 2. gastos_validos.json
```json
[
    {
        "idProyecto": 1,
        "monto": "1500.00",
        "fechaGasto": "2025-10-13",
        "categoriaGasto": "Equipos",
        "descripcion": "Compra de laptop para investigación de campo"
    },
    {
        "idProyecto": 2,
        "monto": "250.75",
        "fechaGasto": "2025-10-12", 
        "categoriaGasto": "Material de oficina",
        "descripcion": "Papelería y suministros para el proyecto"
    }
]
```

#### 3. gastos_invalidos.json
```json
[
    {
        "monto": "99999999.00",
        "errorEsperado": "presupuesto",
        "descripcion": "Monto que excede el presupuesto disponible"
    },
    {
        "monto": "",
        "errorEsperado": "campos_requeridos",
        "descripcion": "Prueba con campos vacíos"
    }
]
```

## 📊 Suites de Pruebas Implementadas

### 1. registrar_gastos_exitoso.cy.js
**Propósito:** Casos de éxito y flujo normal

**Casos de prueba:**
- ✅ **Registro exitoso individual** - Registra un gasto válido completamente
- ✅ **Múltiples gastos válidos** - Prueba varios gastos consecutivos
- ✅ **Mostrar último gasto** - Funcionalidad de localStorage para historial

**Validaciones:**
- Formulario se llena correctamente
- APIs mockeadas responden apropiadamente
- Popup de confirmación se muestra
- LocalStorage se actualiza correctamente
- Navegación y redirecciones funcionan

### 2. registrar_gastos_error.cy.js
**Propósito:** Casos de error y manejo de excepciones

**Casos de prueba:**
- ❌ **Gasto excede presupuesto** - Validación de límites financieros
- ❌ **Campos vacíos** - Validación de campos requeridos
- ❌ **Monto inválido** - Validación de formato numérico
- ❌ **Sin autenticación** - Redirección a login
- ❌ **Error del servidor** - Manejo de errores 500
- ❌ **Fecha futura** - Validación de fechas
- ❌ **Error de conexión** - Network failures

**Validaciones:**
- Mensajes de error apropiados
- Validaciones del lado cliente
- Manejo de respuestas HTTP de error
- Estados de loading durante errores
- Recuperación graceful de fallos

### 3. registrar_gastos_ui.cy.js
**Propósito:** Validaciones de interfaz de usuario

**Casos de prueba:**
- 🎨 **Carga de interfaz** - Elementos visuales presentes
- 🎨 **Validación de montos** - Formato decimal, negativos
- 🎨 **Categoría personalizada** - Show/hide campos condicionales
- 🎨 **Validación de fechas** - Límites de fecha máxima
- 🎨 **Estados de loading** - Indicadores visuales
- 🎨 **Botón último gasto** - Interacción con localStorage
- 🎨 **Reset de formulario** - Limpieza después del éxito

**Validaciones:**
- Elementos DOM presentes y visibles
- Interacciones de usuario naturales
- Estados visuales apropiados
- Campos condicionales funcionan
- Validaciones en tiempo real

## 🔧 Tecnologías y Patrones

### Herramientas Utilizadas
- **Cypress 15.3.0** - Framework E2E
- **JavaScript ES6+** - Sintaxis moderna
- **Intercept API** - Mocking de requests HTTP
- **Fixtures** - Datos de prueba estructurados
- **Custom Commands** - Reutilización de código

### Patrones Implementados
- **Page Object Model** - Comandos personalizados como páginas
- **Data-Driven Testing** - Uso extensivo de fixtures
- **Mocking Strategies** - APIs completamente mockeadas
- **Async/Await** - Manejo de operaciones asíncronas
- **Retry Logic** - Timeouts y reintentos automáticos

### Mocks de APIs
```javascript
// Mock de proyectos del investigador
cy.intercept('GET', '/api/investigador/proyectos-principal', {
    statusCode: 200,
    body: [{ idProyecto: 1, nombre: "Proyecto Test" }]
})

// Mock de registro exitoso
cy.intercept('POST', '/api/investigador/registrar-gasto', {
    statusCode: 200,  
    body: { exito: true, mensaje: "Gasto registrado exitosamente" }
})

// Mock de error de presupuesto
cy.intercept('POST', '/api/investigador/registrar-gasto', {
    statusCode: 400,
    body: { exito: false, mensaje: "Presupuesto insuficiente" }
})
```

## 🚀 Comandos de Ejecución

### Desarrollo (Interfaz Gráfica)
```bash
cd frontend_cices_system
npx cypress open
```

### CI/CD (Headless)
```bash
# Todas las pruebas de registrar gastos
npx cypress run --spec "cypress/e2e/registrar_gastos*.cy.js"

# Solo casos exitosos
npx cypress run --spec "cypress/e2e/registrar_gastos_exitoso.cy.js"

# Solo casos de error  
npx cypress run --spec "cypress/e2e/registrar_gastos_error.cy.js"

# Solo validaciones UI
npx cypress run --spec "cypress/e2e/registrar_gastos_ui.cy.js"
```

### Con Reporte
```bash
npx cypress run --spec "cypress/e2e/registrar_gastos*.cy.js" --reporter mochawesome
```

## 📈 Cobertura de Funcionalidades

### Flujos Principales ✅
- **Registro exitoso completo** - Desde login hasta confirmación
- **Validación de presupuesto** - Verificación de límites financieros
- **Manejo de errores** - Todos los casos de fallo posibles
- **Persistencia de datos** - LocalStorage para historial
- **Navegación** - Rutas protegidas y redirecciones

### Validaciones de Negocio ✅
- **Autenticación JWT** - Token válido requerido
- **Campos requeridos** - Todos los campos obligatorios
- **Formato de montos** - Decimales, negativos, límites
- **Fechas válidas** - No futuras, formato correcto
- **Categorías** - Predefinidas y personalizadas
- **Presupuesto disponible** - No exceder límites

### Interacciones UI ✅
- **Formularios dinámicos** - Campos condicionales
- **Estados de loading** - Indicadores visuales
- **Mensajes de feedback** - Éxito y error claros
- **Navegación intuitiva** - Flujo usuario natural
- **Responsive design** - Viewport configurado

## 📋 Ventajas de las Pruebas E2E

### 1. **Confianza del Sistema**
- Prueban el flujo completo usuario final
- Validan integración frontend-backend
- Detectan problemas de comunicación entre capas

### 2. **Automatización Completa**
- Ejecutables en CI/CD pipelines
- Reproducibles en cualquier entorno
- Reportes automáticos de fallos

### 3. **Cobertura Real**
- Simulan interacciones reales de usuario
- Prueban con datos realistas
- Validan experiencia de usuario completa

### 4. **Detección Temprana**
- Identifican regresiones rápidamente
- Validan nuevas funcionalidades
- Aseguran estabilidad en releases

## ✅ Conclusión

Las **pruebas funcionales E2E con Cypress** para **RegistrarGastosFinancieros** proporcionan:

- 🔒 **Confiabilidad:** Garantizan que la funcionalidad completa trabaja correctamente
- 🚀 **Automatización:** Integración perfecta en pipelines de CI/CD
- 🎯 **Cobertura:** Casos exitosos, errores y validaciones UI
- 🔄 **Mantenibilidad:** Comandos reutilizables y datos estructurados
- 📊 **Reportes:** Evidencia visual de éxitos y fallos

Estas pruebas complementan perfectamente las **pruebas unitarias del backend**, creando una suite de testing robusta que asegura la calidad del sistema de gestión de gastos financieros en CICES.