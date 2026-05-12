/// <reference types="cypress" />

describe('Exportación de reporte de presupuestos', () => {

    it('debe permitir generar un reporte de presupuestos', () => {

        // LOGIN
        cy.visit('http://localhost:5173/')

        cy.get('#login-username', { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type('derby.munoz@ucr.ac.cr')

        cy.get('#login-password')
            .should('be.visible')
            .clear()
            .type('12345678')

        cy.get('#login-submit')
            .click()

        // Esperar finalización login
        cy.get('#login-submit', { timeout: 15000 })
            .should('not.exist')

        // Abrir menú Reportes
        cy.contains('Reportes', { timeout: 10000 })
            .should('be.visible')
            .click()

        // Entrar a Presupuestos
        cy.contains('Presupuestos', { timeout: 10000 })
            .should('be.visible')
            .click()

        // Validar pantalla
        cy.contains('Reporte de Presupuestos', { timeout: 10000 })
            .should('be.visible')

        // Intercept exportación
        cy.intercept(
            'GET',
            '**/api/exportar/reporte-presupuestos*'
        ).as('exportarReporte')

        // Exportar directamente
        cy.get('[data-testid="btn-exportar"]', { timeout: 10000 })
            .should('be.visible')
            .click()

        // Validar request exitosa
        cy.wait('@exportarReporte', { timeout: 20000 })
            .then(({ response }) => {

                expect(response.statusCode)
                    .to.be.oneOf([200, 201])

            })

    })

})