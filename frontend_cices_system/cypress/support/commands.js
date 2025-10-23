// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// Comando personalizado para login de investigador
Cypress.Commands.add('loginInvestigador', (username, password) => {
    cy.intercept('POST', 'http://localhost:8080/auth/login').as('postLogin')
    
    cy.visit('http://localhost:5173/')
    cy.wait(2000)
    
    cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible')
    cy.get('input[name="password"]', { timeout: 10000 }).should('be.visible')
    
    cy.get('input[name="username"]').clear().type(username)
    cy.get('input[name="password"]').clear().type(password)
    cy.get('button[type="submit"]').click()
    
    cy.wait('@postLogin').its('response.statusCode').should('eq', 200)
})

// Comando personalizado para navegar a registrar gastos
Cypress.Commands.add('irARegistrarGastos', () => {
    // Mock de APIs necesarias
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
    
    cy.visit('http://localhost:5173/registrar-gastos')
    cy.wait('@mockProyectos')
    cy.wait('@mockFechaActual')
})

// Comando para llenar formulario de gasto
Cypress.Commands.add('llenarFormularioGasto', (gasto) => {
    if (gasto.idProyecto) {
        cy.get('select[name="proyecto"]').select(gasto.idProyecto.toString())
    }
    
    if (gasto.monto) {
        cy.get('input[name="monto"]').clear().type(gasto.monto)
    }
    
    if (gasto.fechaGasto) {
        cy.get('input[name="fecha"]').clear().type(gasto.fechaGasto)
    }
    
    if (gasto.categoriaGasto) {
        if (gasto.categoriaGasto === 'personalizada') {
            cy.get('select[name="categoria"]').select('otros')
            cy.get('input[name="categoriaPersonalizada"]').type(gasto.categoriaPersonalizada)
        } else {
            cy.get('select[name="categoria"]').select(gasto.categoriaGasto)
        }
    }
    
    if (gasto.descripcion) {
        cy.get('textarea[name="descripcion"]').clear().type(gasto.descripcion)
    }
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
