describe('HU-024 - Actualizar asignación de investigadores', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/asignar-investigadores')
    })

    it('debe editar un investigador vinculado, actualizar la actividad y guardar', () => {
        // 1. Debe estar en la pantalla correcta
        cy.url().should('include', '/asignar-investigadores')

        // 2. Seleccionar el primer proyecto que se despliega
        // Ajusta el selector según tu componente real
        cy.get('input').first().click({ force: true })
        cy.get('[class*="option"], [id*="option"]').first().click({ force: true })

        // 3. Esperar a que aparezcan investigadores vinculados
        cy.contains('Editar', { timeout: 10000 }).should('be.visible')

        // 4. Darle editar a algún investigador ya vinculado
        cy.contains('button', 'Editar').first().click({ force: true })

        // 5. Modificar la actividad en proyecto
        // Ajusta este selector si tu input tiene otro name, id o placeholder
        cy.get('input[name*="actividad"], textarea[name*="actividad"]', { timeout: 10000 })
            .first()
            .clear()
            .type('Nueva actividad de prueba')

        // 6. Darle actualizar
        cy.contains('button', 'Actualizar').click({ force: true })

        // 7. Guardar cambios finales
        cy.contains('button', 'Guardar').click({ force: true })

        // 8. Validación básica visible
        cy.contains('Nueva actividad de prueba').should('exist')
    })
})