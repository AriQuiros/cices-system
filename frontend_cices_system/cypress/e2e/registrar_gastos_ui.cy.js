/// <reference types="cypress" />

describe('Registrar Gastos Financieros - Validaciones UI', () => {
    beforeEach(() => {
        cy.fixture('investigador_login.json').as('usuarioInvestigador')
        
        // Interceptar llamadas API
        cy.intercept('POST', 'http://localhost:8080/auth/login').as('postLogin')
        
        // Mock de proyectos
        cy.intercept('GET', 'http://localhost:8080/api/investigador/proyectos-principal', {
            statusCode: 200,
            body: [
                {
                    idProyecto: 1,
                    nombre: "Sistema de Gestión de Investigación",
                    codigoProyecto: "PROJ-001"
                },
                {
                    idProyecto: 2,
                    nombre: "Proyecto de Prueba para Investigador",
                    codigoProyecto: "PROJ-002"
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

    it('debe cargar la interfaz correctamente', function () {
        const usuario = this.usuarioInvestigador[0]
        
        // Login
        cy.visit('http://localhost:5173/')
        cy.wait(2000)
        
        cy.get('input[name="username"]').clear().type(usuario.usuario)
        cy.get('input[name="password"]').clear().type(usuario.contrasena)
        cy.get('button[type="submit"]').click()
        cy.wait('@postLogin')
        
        // Navegar a registrar gastos
        cy.visit('http://localhost:5173/registrar-gastos')
        cy.wait('@mockProyectos')
        cy.wait('@mockFechaActual')
        
        // Verificar elementos de la interfaz
        cy.get('h1').should('contain', 'Registrar Gastos Financieros')
        
        // Verificar campos del formulario
        cy.get('select[name="proyecto"]').should('be.visible')
        cy.get('input[name="monto"]').should('be.visible')
        cy.get('input[name="fecha"]').should('be.visible')
        cy.get('select[name="categoria"]').should('be.visible')
        cy.get('textarea[name="descripcion"]').should('be.visible')
        cy.get('button[type="submit"]').should('be.visible')
        
        // Verificar que los proyectos se cargan en el select
        cy.get('select[name="proyecto"] option').should('have.length.greaterThan', 1)
        cy.get('select[name="proyecto"]').should('contain', 'Sistema de Gestión de Investigación')
        cy.get('select[name="proyecto"]').should('contain', 'Proyecto de Prueba para Investigador')
        
        // Verificar categorías disponibles
        cy.get('select[name="categoria"] option').should('have.length.greaterThan', 1)
        cy.get('select[name="categoria"]').should('contain', 'Materiales')
        cy.get('select[name="categoria"]').should('contain', 'Transporte')
        cy.get('select[name="categoria"]').should('contain', 'Equipo')
        cy.get('select[name="categoria"]').should('contain', 'Servicios')
    })

    it('debe validar el formato del monto', function () {
        const usuario = this.usuarioInvestigador[0]
        
        // Login y navegar
        cy.visit('http://localhost:5173/')
        cy.wait(2000)
        
        cy.get('input[name="username"]').clear().type(usuario.usuario)
        cy.get('input[name="password"]').clear().type(usuario.contrasena)
        cy.get('button[type="submit"]').click()
        cy.wait('@postLogin')
        
        cy.visit('http://localhost:5173/registrar-gastos')
        cy.wait('@mockProyectos')
        
        // Probar diferentes formatos de monto
        const montosValidos = ['1500.00', '999.99', '1000', '0.01']
        const montosInvalidos = ['abc', '-100', '', '1500,00']
        
        // Probar montos válidos
        cy.wrap(montosValidos).each((monto) => {
            cy.get('input[name="monto"]').clear().type(monto)
            cy.get('input[name="monto"]').should('have.value', monto)
            cy.get('.error-monto').should('not.exist')
        })
        
        // Probar montos inválidos
        cy.wrap(montosInvalidos).each((monto) => {
            cy.get('input[name="monto"]').clear().type(monto)
            cy.get('input[name="monto"]').blur() // Trigger validation
            
            if (monto === 'abc') {
                // Campo numérico debería rechazar texto
                cy.get('input[name="monto"]').should('have.value', '')
            } else if (monto === '-100') {
                // Debería mostrar error por monto negativo
                cy.get('.validation-error').should('be.visible')
            }
        })
    })

    it('debe manejar la funcionalidad de categoría personalizada', function () {
        const usuario = this.usuarioInvestigador[0]
        
        // Login y navegar
        cy.visit('http://localhost:5173/')
        cy.wait(2000)
        
        cy.get('input[name="username"]').clear().type(usuario.usuario)
        cy.get('input[name="password"]').clear().type(usuario.contrasena)
        cy.get('button[type="submit"]').click()
        cy.wait('@postLogin')
        
        cy.visit('http://localhost:5173/registrar-gastos')
        cy.wait('@mockProyectos')
        
        // Verificar que inicialmente no se muestra el campo personalizado
        cy.get('#categoriaPersonalizada').should('not.exist')
        
        // Seleccionar "Otros" en categoría
        cy.get('select[name="categoria"]').select('otros')
        
        // Verificar que aparece el campo personalizado
        cy.get('#categoriaPersonalizada').should('be.visible')
        cy.get('#categoriaPersonalizada').should('have.attr', 'placeholder')
        
        // Ingresar categoría personalizada
        cy.get('#categoriaPersonalizada').type('Servicios profesionales')
        cy.get('#categoriaPersonalizada').should('have.value', 'Servicios profesionales')
        
        // Cambiar a otra categoría predefinida
        cy.get('select[name="categoria"]').select('equipo')
        
        // Verificar que se oculta el campo personalizado
        cy.get('#categoriaPersonalizada').should('not.be.visible')
    })

    it('debe validar las fechas correctamente', function () {
        const usuario = this.usuarioInvestigador[0]
        
        // Login y navegar
        cy.visit('http://localhost:5173/')
        cy.wait(2000)
        
        cy.get('input[name="username"]').clear().type(usuario.usuario)
        cy.get('input[name="password"]').clear().type(usuario.contrasena)
        cy.get('button[type="submit"]').click()
        cy.wait('@postLogin')
        
        cy.visit('http://localhost:5173/registrar-gastos')
        cy.wait('@mockProyectos')
        cy.wait('@mockFechaActual')
        
        // Verificar que el campo fecha tiene fecha máxima establecida
        cy.get('input[name="fecha"]').should('have.attr', 'max', '2025-10-13')
        cy.get('input[name="fecha"]').should('have.attr', 'type', 'date')
        
        // Probar fecha válida (hoy)
        cy.get('input[name="fecha"]').clear().type('2025-10-13')
        cy.get('input[name="fecha"]').should('have.value', '2025-10-13')
        
        // Probar fecha válida (pasada)
        cy.get('input[name="fecha"]').clear().type('2025-10-01')
        cy.get('input[name="fecha"]').should('have.value', '2025-10-01')
    })

    it('debe mostrar loading states apropiadamente', function () {
        const usuario = this.usuarioInvestigador[0]
        
        // Login
        cy.visit('http://localhost:5173/')
        cy.wait(2000)
        
        cy.get('input[name="username"]').clear().type(usuario.usuario)
        cy.get('input[name="password"]').clear().type(usuario.contrasena)
        cy.get('button[type="submit"]').click()
        cy.wait('@postLogin')
        
        // Interceptar con delay para ver loading
        cy.intercept('GET', 'http://localhost:8080/api/investigador/proyectos-principal', {
            statusCode: 200,
            body: [{ idProyecto: 1, nombreProyecto: "Test" }],
            delay: 2000
        }).as('mockProyectosDelay')
        
        cy.visit('http://localhost:5173/registrar-gastos')
        
        // Verificar que se muestra loading mientras cargan proyectos
        cy.get('.loading', { timeout: 1000 }).should('be.visible')
        
        cy.wait('@mockProyectosDelay')
        
        // Verificar que desaparece el loading
        cy.get('.loading').should('not.exist')
        cy.get('select[name="proyecto"]').should('be.visible')
    })

    it('debe manejar el botón de último gasto', function () {
        const usuario = this.usuarioInvestigador[0]
        
        // Login
        cy.visit('http://localhost:5173/')
        cy.wait(2000)
        
        cy.get('input[name="username"]').clear().type(usuario.usuario)
        cy.get('input[name="password"]').clear().type(usuario.contrasena)
        cy.get('button[type="submit"]').click()
        cy.wait('@postLogin')
        
        cy.visit('http://localhost:5173/registrar-gastos')
        cy.wait('@mockProyectos')
        
        // Simular que hay un gasto anterior en localStorage
        cy.window().then((win) => {
            const gastoAnterior = {
                idProyecto: 1,
                monto: '1500.00',
                fechaGasto: '2025-10-12',
                categoriaGasto: 'Equipos',
                descripcion: 'Gasto anterior de prueba'
            }
            win.localStorage.setItem(`ultimoGastoRegistrado_${usuario.id || 'test'}`, JSON.stringify(gastoAnterior))
        })
        
        // Recargar para que detecte el localStorage
        cy.reload()
        cy.wait('@mockProyectos')
        
        // Verificar que aparece el botón
        cy.get('.btn-ultimo-gasto').should('be.visible')
        cy.get('.btn-ultimo-gasto').should('contain', '📋 Ver Último Gasto Registrado')
        
        // Hacer clic en el botón
        cy.get('.btn-ultimo-gasto').click()
        
        // Verificar que se muestra el detalle del gasto
        cy.get('.popup-detalle.anterior').should('be.visible')
        cy.get('.popup-detalle').should('contain', '1500.00')
        cy.get('.popup-detalle').should('contain', 'equipo')
        cy.get('.popup-detalle').should('contain', 'Gasto anterior de prueba')
    })

    it('debe resetear el formulario después de un registro exitoso', function () {
        const usuario = this.usuarioInvestigador[0]
        
        // Login
        cy.visit('http://localhost:5173/')
        cy.wait(2000)
        
        cy.get('input[name="username"]').clear().type(usuario.usuario)
        cy.get('input[name="password"]').clear().type(usuario.contrasena)
        cy.get('button[type="submit"]').click()
        cy.wait('@postLogin')
        
        cy.visit('http://localhost:5173/registrar-gastos')
        cy.wait('@mockProyectos')
        
        // Llenar formulario
        cy.get('select[name="proyecto"]').select('1')
        cy.get('input[name="monto"]').clear().type('1500.00')
        cy.get('input[name="fecha"]').clear().type('2025-10-13')
        cy.get('select[name="categoria"]').select('equipo')
        cy.get('textarea[name="descripcion"]').clear().type('Test descripción')
        
        // Mock respuesta exitosa
        cy.intercept('POST', 'http://localhost:8080/api/investigador/registrar-gasto', {
            statusCode: 200,
            body: { exito: true, mensaje: "Gasto registrado exitosamente" }
        })
        
        // Enviar formulario
        cy.get('button[type="submit"]').click()
        
        // Verificar que aparece popup de éxito
        cy.get('.popup-detalle').should('be.visible')
        cy.get('.btn-continuar').click()
        
        // Verificar campos vacíos
        cy.get('select[name="proyecto"]').should('have.value', '')
        cy.get('input[name="monto"]').should('have.value', '')
        cy.get('input[name="fecha"]').should('have.value', '')
        cy.get('select[name="categoria"]').should('have.value', '')
        cy.get('textarea[name="descripcion"]').should('have.value', '')
    })
})
