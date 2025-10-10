/// <reference types="cypress" />

describe('Login Inválido', () => {
    beforeEach(() => {
        cy.fixture('unvalidlogin.json').as('usuariosInvalidos')
        cy.fixture('unvalidloginpassword.json').as('usuarioPasswordInvalida')
        cy.intercept('POST', 'http://localhost:8080/auth/login').as('postLogin')
        cy.visit('http://localhost:5173/')
        // Esperar a que la página cargue completamente
        cy.wait(2000)
    })

    it('rechaza login con usuario inválido del JSON', function () {
        cy.wrap(this.usuariosInvalidos).each((data) => {
            // Esperar a que aparezcan los elementos del login
            cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible')
            cy.get('input[name="password"]', { timeout: 10000 }).should('be.visible')
            
            // Llenar formulario con credenciales inválidas
            cy.get('input[name="username"]').clear().type(data.usuario)
            cy.get('input[name="password"]').clear().type(data.contrasena)
            
            // Hacer clic en el botón de login
            cy.get('button[type="submit"]').click()
            
            // Esperar la respuesta del servidor (debería ser 401)
            cy.wait('@postLogin').its('response.statusCode').should('eq', 401)
            
            // Verificar que se muestra mensaje de error
            cy.get('[role="alert"], .error', { timeout: 5000 }).should('be.visible')
            
            // Verificar que permanece en la página de login
            cy.url().should('include', '/')
            
            // Limpiar formulario para la siguiente iteración
            cy.get('input[name="username"]').clear()
            cy.get('input[name="password"]').clear()
        })
    })

    it('rechaza login con contraseña inválida del JSON', function () {
        // Usar el fixture de contraseña inválida
        const data = this.usuarioPasswordInvalida
        
        // Esperar a que aparezcan los elementos del login
        cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible')
        cy.get('input[name="password"]', { timeout: 10000 }).should('be.visible')
        
        // Llenar formulario con contraseña incorrecta
        cy.get('input[name="username"]').clear().type(data.usuario)
        cy.get('input[name="password"]').clear().type(data.contrasena)
        
        // Hacer clic en el botón de login
        cy.get('button[type="submit"]').click()
        
        // Esperar la respuesta del servidor (debería ser 401)
        cy.wait('@postLogin').its('response.statusCode').should('eq', 401)
        
        // Verificar que se muestra mensaje de error
        cy.get('[role="alert"], .error', { timeout: 5000 }).should('be.visible')
        
        // Verificar que permanece en la página de login
        cy.url().should('include', '/')
    })
})