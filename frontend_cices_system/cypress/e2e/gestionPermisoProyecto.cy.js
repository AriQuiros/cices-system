/// <reference types="cypress" />

describe('Gestión de permiso de proyecto', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/')

        cy.get('#login-username', { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type('derby.munoz@ucr.ac.cr')

        cy.get('#login-password', { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type('12345678')

        cy.get('#login-submit').click()

        // Espera a que desaparezca el formulario de login
        cy.get('#login-submit', { timeout: 15000 }).should('not.exist')

        // Entrar a la pantalla de gestión de permisos
        cy.visit('http://localhost:5173/gestion-permiso-proyecto')

        cy.contains('Gestión de Permisos de Proyecto', { timeout: 10000 })
            .should('be.visible')
    })

    it('debe permitir otorgar un permiso a un investigador en un proyecto', () => {
        cy.intercept('GET', '**/api/reports/proyectos/codigo-nombre-fechas*').as('getProyectos')
        cy.intercept('GET', '**/api/reportes/investigadorProyecto/*').as('getInvestigadores')
        cy.intercept('GET', '**/api/permiso-proyecto/obtener/*').as('getPermisos')
        cy.intercept('POST', '**/api/permiso-proyecto/otorgar').as('postPermiso')

        // Seleccionar proyecto
        cy.get('.buscador-select input[id*="react-select"][id$="-input"]', { timeout: 10000 })
            .first()
            .click({ force: true })

        cy.get('.buscador__option, [id*="-option"]', { timeout: 10000 })
            .should('have.length.greaterThan', 0)
            .first()
            .click({ force: true })

        // Esperar carga de investigadores y permisos del proyecto
        cy.wait('@getInvestigadores', { timeout: 15000 })
        cy.wait('@getPermisos', { timeout: 15000 })

        // Seleccionar investigador
        cy.contains('label', 'Investigador')
            .parent()
            .find('input[id*="react-select"][id$="-input"]', { timeout: 10000 })
            .click({ force: true })

        cy.get('.select__option, [id*="-option"]', { timeout: 10000 })
            .should('have.length.greaterThan', 0)
            .first()
            .click({ force: true })

        // Ingresar fecha fin válida
        cy.get('input[name="fechaFin"]', { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type('2026-12-31', { force: true })

        // Otorgar permiso
        cy.contains('button', 'Otorgar permiso')
            .should('be.visible')
            .click({ force: true })

        // Validar request y mensaje de éxito
        cy.wait('@postPermiso', { timeout: 15000 }).then(({ response }) => {
            expect(response.statusCode).to.be.oneOf([200, 201])
        })

        cy.contains('Permiso otorgado correctamente', { timeout: 10000 })
            .should('be.visible')
    })
})