/// <reference types="cypress" />

describe('Registrar Gastos Financieros - Casos Exitosos', () => {
    beforeEach(() => {
        cy.fixture('investigador_login.json').as('usuarioInvestigador')
        cy.fixture('gastos_validos.json').as('gastosValidos')
        
        // Interceptar llamadas API
        cy.intercept('POST', 'http://localhost:8080/auth/login').as('postLogin')
        cy.intercept('GET', 'http://localhost:8080/api/investigador/proyectos-principal').as('getProyectos')
        cy.intercept('GET', 'http://localhost:8080/api/investigador/fecha-actual').as('getFechaActual')
        cy.intercept('POST', 'http://localhost:8080/api/investigador/registrar-gasto').as('postRegistrarGasto')
        
        // Mock de respuestas exitosas
        cy.intercept('GET', 'http://localhost:8080/api/investigador/proyectos-principal', {
            statusCode: 200,
            body: [
                {
                    idProyecto: 1,
                    nombre: "Sistema de Gestión de Investigación",
                    codigoProyecto: "PROJ-001",
                    fechaInicio: "2025-01-01",
                    estado: "Activo"
                },
                {
                    idProyecto: 2,
                    nombre: "Proyecto de Prueba para Investigador",
                    codigoProyecto: "PROJ-002",
                    fechaInicio: "2025-02-01",
                    estado: "Activo"
                }
            ]
        }).as('mockProyectos')
        
        
        cy.intercept('GET', 'http://localhost:8080/api/investigador/fecha-actual', {
            statusCode: 200,
            body: { fecha: '2025-10-13' }
        }).as('mockFechaActual')
        
        // Mock para presupuesto de proyectos
        cy.intercept('GET', 'http://localhost:8080/api/investigador/presupuesto/*', {
            statusCode: 200,
            body: {
                presupuestoDisponible: 50000.00,
                presupuestoTotal: 100000.00,
                gastosEjecutados: 50000.00
            }
        }).as('mockPresupuesto')
        
        // Mock para validar gasto
        cy.intercept('POST', 'http://localhost:8080/api/investigador/validar-gasto', {
            statusCode: 200,
            body: {
                valido: true,
                mensaje: "Gasto válido"
            }
        }).as('mockValidarGasto')
    })

    it('debe permitir registrar un gasto exitosamente', function () {
        const usuario = this.usuarioInvestigador[0]
        const gasto = this.gastosValidos[0]
        
        // 1. Login como investigador
        cy.loginInvestigador(usuario.usuario, usuario.contrasena)
        
        // 2. Navegar a Registrar Gastos
        cy.irARegistrarGastos()
        
        // 3. Verificar que la página se carga correctamente
        cy.get('h1').should('contain', 'Registrar Gastos Financieros')
        
        // 4. Llenar formulario de gasto
        cy.llenarFormularioGasto(gasto)
        
        // 5. Mock de respuesta exitosa del registro
        cy.intercept('POST', 'http://localhost:8080/api/investigador/registrar-gasto', {
            statusCode: 200,
            body: {
                exito: true,
                mensaje: "Gasto registrado exitosamente"
            }
        }).as('mockRegistroExitoso')
        
        // 6. Enviar formulario
        cy.get('button[type="submit"]').click()
        
        // 7. Verificar respuesta exitosa
        cy.wait('@mockRegistroExitoso')
        
        // 8. Verificar que el formulario se resetea después del registro exitoso
        cy.get('select[name="proyecto"]').should('have.value', '')
        cy.get('input[name="monto"]').should('have.value', '')
        cy.get('textarea[name="descripcion"]').should('have.value', '')
        
        // 9. Verificar que aparece el botón de "Ver Último Gasto Registrado"
        cy.get('.btn-ultimo-gasto').should('be.visible')
        cy.get('.btn-ultimo-gasto').should('contain', 'Ver Último Gasto Registrado')
    })

    it('debe registrar múltiples gastos válidos', function () {
        const usuario = this.usuarioInvestigador[0]
        
        // Login
        cy.visit('http://localhost:5173/')
        cy.wait(2000)
        
        cy.get('input[name="username"]').clear().type(usuario.usuario)
        cy.get('input[name="password"]').clear().type(usuario.contrasena)
        cy.get('button[type="submit"]').click()
        cy.wait('@postLogin')
        
        // Probar cada gasto válido
        cy.wrap(this.gastosValidos).each((gasto) => {
            cy.visit('http://localhost:5173/registrar-gastos')
            cy.wait('@mockProyectos')
            
            // Llenar formulario
            cy.get('select[name="proyecto"]').select(gasto.idProyecto.toString())
            cy.get('input[name="monto"]').clear().type(gasto.monto)
            cy.get('input[name="fecha"]').clear().type(gasto.fechaGasto)
            cy.get('select[name="categoria"]').select(gasto.categoriaGasto)
            cy.get('textarea[name="descripcion"]').clear().type(gasto.descripcion)
            
            // Mock respuesta exitosa
            cy.intercept('POST', 'http://localhost:8080/api/investigador/registrar-gasto', {
                statusCode: 200,
                body: { exito: true, mensaje: "Gasto registrado exitosamente" }
            }).as('mockRegistro')
            
            // Enviar y verificar
            cy.get('button[type="submit"]').click()
            cy.wait('@mockRegistro')
            
            // Verificar que el registro fue exitoso (formulario se resetea)
            cy.get('select[name="proyecto"]').should('have.value', '')
            cy.get('input[name="monto"]').should('have.value', '')
            cy.get('textarea[name="descripcion"]').should('have.value', '')
            
            // Verificar que aparece el botón de último gasto
            cy.get('.btn-ultimo-gasto').should('be.visible')
            
            // Hacer click en el botón para ver el último gasto registrado
            cy.get('.btn-ultimo-gasto').click()
            
            // Verificar que aparece el popup con los detalles del gasto registrado
            cy.get('.popup-detalle').should('be.visible')
            cy.get('.titulo.anterior').should('contain', 'Último Gasto Registrado')
            cy.get('.popup-detalle').should('contain', gasto.monto)
            
            // Cerrar el popup
            cy.get('.btn-cerrar').click()
        })
    })

    it('debe mostrar el último gasto registrado', function () {
        const usuario = this.usuarioInvestigador[0]
        const gasto = this.gastosValidos[0]
        
        // Login y registro de un gasto
        cy.visit('http://localhost:5173/')
        cy.wait(2000)
        
        cy.get('input[name="username"]').clear().type(usuario.usuario)
        cy.get('input[name="password"]').clear().type(usuario.contrasena)
        cy.get('button[type="submit"]').click()
        cy.wait('@postLogin')
        
        cy.visit('http://localhost:5173/registrar-gastos')
        cy.wait('@mockProyectos')
        
        // Registrar un gasto primero
        cy.get('select[name="proyecto"]').select(gasto.idProyecto.toString())
        cy.get('input[name="monto"]').clear().type(gasto.monto)
        cy.get('input[name="fecha"]').clear().type(gasto.fechaGasto)
        cy.get('select[name="categoria"]').select(gasto.categoriaGasto)
        cy.get('textarea[name="descripcion"]').clear().type(gasto.descripcion)
        
        cy.intercept('POST', 'http://localhost:8080/api/investigador/registrar-gasto', {
            statusCode: 200,
            body: { exito: true, mensaje: "Gasto registrado exitosamente" }
        })
        
        cy.get('button[type="submit"]').click()
        
        // Verificar que el registro fue exitoso (formulario se resetea)
        cy.get('select[name="proyecto"]').should('have.value', '')
        cy.get('input[name="monto"]').should('have.value', '')
        cy.get('textarea[name="descripcion"]').should('have.value', '')
        
        // Verificar que aparece el botón para ver último gasto
        cy.get('.btn-ultimo-gasto').should('be.visible')
        cy.get('.btn-ultimo-gasto').should('contain', 'Ver Último Gasto Registrado')
        
        // Hacer clic para ver último gasto
        cy.get('.btn-ultimo-gasto').click()
        
        // Verificar que se muestra el detalle del gasto anterior
        cy.get('.popup-detalle.anterior').should('be.visible')
        cy.get('.titulo.anterior').should('contain', 'Último Gasto Registrado')
        cy.get('.popup-detalle').should('contain', gasto.monto)
    })
})
