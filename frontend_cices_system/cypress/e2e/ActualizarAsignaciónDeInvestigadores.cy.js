describe('HU-024 - Actualizar asignación de investigadores', () => {
    beforeEach(() => {
        const exp = Math.floor(Date.now() / 1000) + 3600
        const fakeJwt = `x.${btoa(JSON.stringify({ exp }))}.y`

        const auth = {
            user: {
                id: 1,
                nombre: 'Director Test',
                roles: ['DIRECTOR']
            },
            token: fakeJwt,
            exp
        }

        cy.visit('http://localhost:5173/asignar-investigadores', {
            onBeforeLoad(win) {
                win.sessionStorage.setItem('auth', JSON.stringify(auth))
                win.localStorage.setItem('auth', JSON.stringify(auth))
            }
        })
    })

    it('debe editar un investigador vinculado, actualizar la actividad y guardar', () => {
        cy.url().should('include', '/asignar-investigadores')

        cy.contains('Buscar proyecto').should('be.visible')

        cy.get('.buscador-select input[id*="react-select"][id$="-input"]', { timeout: 10000 })
            .click({ force: true })

        cy.get('.buscador__option, [id*="-option"]', { timeout: 10000 })
            .first()
            .click({ force: true })

        cy.contains('button', 'Editar', { timeout: 10000 }).should('be.visible')
        cy.contains('button', 'Editar').first().click({ force: true })

        cy.get('input[name="actividad-0"]', { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type('Nueva actividad de prueba')

        cy.contains('button', 'Actualizar').click({ force: true })

        cy.get('.swal2-confirm, button')
            .contains(/guardar/i)
            .click({ force: true })

        cy.get('body').should('contain.text', 'Nueva actividad de prueba')
    })
})