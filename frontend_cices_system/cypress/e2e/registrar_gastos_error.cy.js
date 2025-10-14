/// <reference types="cypress" />

describe('Registrar Gastos Financieros - Casos de Error', () => {
    beforeEach(() => {
        cy.fixture('investigador_login.json').as('usuarioInvestigador')
        cy.fixture('gastos_invalidos.json').as('gastosInvalidos')
        
        // Interceptar llamadas API
        cy.intercept('POST', 'http://localhost:8080/auth/login').as('postLogin')
        cy.intercept('GET', 'http://localhost:8080/api/investigador/proyectos-principal').as('getProyectos')
        cy.intercept('GET', 'http://localhost:8080/api/investigador/fecha-actual').as('getFechaActual')
        
        // Mock de respuestas para datos base
        cy.intercept('GET', 'http://localhost:8080/api/investigador/proyectos-principal', {
            statusCode: 200,
            body: [
                {
                    idProyecto: 1,
                    nombre: "Sistema de Gestión de Investigación",
                    codigoProyecto: "PROJ-001",
                    fechaInicio: "2025-01-01",
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
        
        // Mock para validar gasto (por defecto exitoso, se sobrescribe en tests específicos)
        cy.intercept('POST', 'http://localhost:8080/api/investigador/validar-gasto', {
            statusCode: 200,
            body: {
                valido: true,
                mensaje: "Gasto válido"
            }
        }).as('mockValidarGasto')
    })

    it('debe mostrar error cuando el gasto excede el presupuesto', function () {
        const usuario = this.usuarioInvestigador[0]
        const gastoExcedente = this.gastosInvalidos.find(g => g.errorEsperado === 'presupuesto')
        
        // Login
        cy.visit('http://localhost:5173/')
        cy.wait(2000)
        
        cy.get('input[name="username"]').clear().type(usuario.usuario)
        cy.get('input[name="password"]').clear().type(usuario.contrasena)
        cy.get('button[type="submit"]').click()
        cy.wait('@postLogin')
        
        // Ir a registrar gastos
        cy.visit('http://localhost:5173/registrar-gastos')
        cy.wait('@mockProyectos')
        
        // Llenar formulario con monto que excede presupuesto
        cy.get('select[name="proyecto"]').select(gastoExcedente.idProyecto.toString())
        cy.get('input[name="monto"]').clear().type(gastoExcedente.monto)
        cy.get('input[name="fecha"]').clear().type(gastoExcedente.fechaGasto)
        cy.get('select[name="categoria"]').select(gastoExcedente.categoriaGasto)
        cy.get('textarea[name="descripcion"]').clear().type(gastoExcedente.descripcion)
        
        // Mock de respuesta de error por presupuesto excedido
        cy.intercept('POST', 'http://localhost:8080/api/investigador/registrar-gasto', {
            statusCode: 400,
            body: {
                exito: false,
                mensaje: "No se pudo registrar el gasto. Verifique que el monto no exceda el presupuesto disponible."
            }
        }).as('mockErrorPresupuesto')
        
        // Enviar formulario
        cy.get('button[type="submit"]').click()
        cy.wait('@mockErrorPresupuesto')
        
        // Verificar mensaje de error en el popup
        cy.get('.popup-error', { timeout: 10000 }).should('be.visible')
        cy.get('.popup-error .mensaje').should('contain', 'presupuesto disponible')
    })

  
})
