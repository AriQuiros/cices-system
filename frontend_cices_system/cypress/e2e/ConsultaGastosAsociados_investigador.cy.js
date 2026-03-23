describe('HU - Consulta de gastos (flujo simple)', () => {

    beforeEach(() => {

        cy.visit('http://localhost:5173/consulta-gastos', {
            onBeforeLoad(win) {
                win.localStorage.setItem('token', 'fake-token');
                win.localStorage.setItem('user', JSON.stringify({
                    email: 'prueba1@ucr.ac.cr',
                    roles: ['INVESTIGADOR']
                }));
            }
        });

    });

    it('Debe seleccionar proyecto y mostrar gastos', () => {

        // 1. Validar pantalla
        cy.url().should('include', '/consulta-gastos');
        cy.contains('Consulta de gastos').should('exist');

        // 2. Abrir selector (igual que tu otro test)
        cy.get('input').first().click({ force: true })
        cy.get('input').first().click({ force: true })
        cy.get('[class*="option"], [id*="option"]').first().click({ force: true })
        cy.get('input').first().click({ force: true })

        cy.get('[class*="option"], [id*="option"]').first().click({ force: true })

        // 4. Esperar que aparezca el resumen
        cy.contains('Resumen del proyecto', { timeout: 10000 })
            .should('be.visible');

        // 5. Validar datos principales
        cy.contains('Total presupuestos').should('exist');
        cy.contains('Total gastos registrados').should('exist');

        // 6. Validar tabla
        cy.get('.consulta-gastos-table', { timeout: 10000 })
            .should('exist');

    });

});