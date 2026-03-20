describe('Gestión de horas - registrar horas', () => {
    it('debe registrar horas en régimen por tiempo', () => {
        cy.visit('http://localhost:5173/gestion-horas')

        cy.url().should('include', '/gestion-horas')

        // Proyecto: react-select, segundo proyecto
        cy.get('input[id*="react-select"][id$="-input"]')
            .first()
            .click({ force: true })

        cy.get('[id*="react-select"][id*="-option"]')
            .eq(1)
            .click({ force: true })

        // Presupuesto: select nativo, primer presupuesto real
        cy.get('select.gestion-horas-select')
            .should('be.visible')
            .select(1)

        // Investigador: react-select, primer investigador
        cy.get('input[id*="react-select"][id$="-input"]')
            .eq(1)
            .click({ force: true })

        cy.get('[id*="react-select"][id*="-option"]')
            .first()
            .click({ force: true })

        // Modalidad: react-select
        cy.get('input[id*="react-select"][id$="-input"]')
            .eq(2)
            .click({ force: true })
            .type('tiempo', { force: true })

        cy.contains('[id*="-option"]', /tiempo/i)
            .click({ force: true })

        // Horas por mes
        cy.get('input[name="horasMes-0"]')
            .clear()
            .type('20')

        // Cantidad de meses
        cy.get('input[name="meses-0"]')
            .clear()
            .type('2')

        // Guardar
        cy.contains('button', 'Guardar horas')
            .click({ force: true })
    })
})