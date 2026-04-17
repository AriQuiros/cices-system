/// <reference types="cypress" />

describe('Notificaciones', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/')

        cy.get('#login-username', { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type('karla.martorell@ucr.ac.cr')

        cy.get('#login-password', { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type('12345678')

        cy.get('#login-submit').click()

        // Espera a que desaparezca el login
        cy.get('#login-submit', { timeout: 15000 }).should('not.exist')

        // Entrar a la pantalla de notificaciones
        cy.visit('http://localhost:5173/notificaciones')

        // Verificar que cargó la vista
        cy.get('#filtro-tipo-notificacion', { timeout: 10000 }).should('be.visible')
        cy.get('#filtro-estado-notificacion').should('be.visible')
        cy.get('#orden-fecha-notificacion').should('be.visible')
    })

    it('debe marcar como leida la primera notificacion no leida disponible', () => {
        cy.intercept('GET', '**/api/reports/notificaciones/usuario/*/detalladas').as('getNotificaciones')
        cy.intercept('PUT', '**/api/reports/notificaciones/usuario/*/*/leido').as('marcarLeida')

        cy.visit('http://localhost:5173/notificaciones')

        cy.wait('@getNotificaciones', { timeout: 15000 })

        // Mostrar primero las más recientes
        cy.get('#orden-fecha-notificacion')
            .select('MAS_RECIENTE')


    })
})