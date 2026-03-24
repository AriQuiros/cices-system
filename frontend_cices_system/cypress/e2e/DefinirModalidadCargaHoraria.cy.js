describe('HU-024 - Actualizar asignación de investigadores', () => {
    beforeEach(() => {
        const exp = Math.floor(Date.now() / 1000) + 3600
        const fakeJwt = `x.${btoa(JSON.stringify({ exp }))}.y`

        const auth = {
            user: {
                id: 1,
                nombre: 'Admin Test',
                roles: ['ADMINISTRADOR']
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

        // Seleccionar proyecto
        cy.get('.buscador-select input[id*="react-select"][id$="-input"]', { timeout: 10000 })
            .click({ force: true })

        cy.get('.buscador__option, [id*="-option"]', { timeout: 10000 })
            .first()
            .click({ force: true })

        // Esperar la sección de abajo
        cy.contains(/investigadores vinculados/i, { timeout: 15000 })
            .should('be.visible')
            .scrollIntoView()

        // Esperar que exista al menos un botón Editar en la lista inferior
        cy.contains('button', 'Editar', { timeout: 15000 })
            .should('exist')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true })

        // Cambiar actividad
        cy.get('input[name="actividad-0"]', { timeout: 10000 })
            .scrollIntoView()
            .should('be.visible')
            .clear()
            .type('Nueva actividad de prueba')

        // Actualizar
        cy.contains('button', 'Actualizar')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true })

        // Confirmación
        cy.get('.swal2-confirm', { timeout: 10000 })
            .should('be.visible')
            .click({ force: true })

        // Validación final
        cy.get('body').should('contain.text', 'Nueva actividad de prueba')
    })
})