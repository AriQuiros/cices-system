describe('Actualizar proyecto (FIX REAL)', () => {

    beforeEach(() => {
        cy.visit('http://localhost:5173/actualizar-proyecto', {
            onBeforeLoad(win) {
                win.localStorage.setItem('token', 'fake-token');
                win.localStorage.setItem('user', JSON.stringify({
                    email: 'prueba2@ucr.ac.cr',
                    roles: ['DIRECCION']
                }));
            }
        });
    });

    it('Debe editar detalles y guardar', () => {

        cy.contains('Buscar proyecto').should('exist');

        // 🔥 Abrir select CORRECTO
        cy.get('.buscador-select').click({ force: true });

        // 🔥 Esperar menú real
        cy.get('.buscador__menu', { timeout: 10000 })
            .should('be.visible');

        // 🔥 Seleccionar opción REAL
        cy.get('.buscador__option')
            .first()
            .click({ force: true });

        // 🔥 Esperar formulario
        cy.contains('Editar Proyecto', { timeout: 10000 })
            .should('be.visible');

        // 🔥 Editar textarea
        cy.get('textarea', { timeout: 10000 })
            .first()
            .clear()
            .type('Actualizacion prueba funcional');

        // 🔥 Guardar
        cy.contains('Actualizar Proyecto').click({ force: true });

        // 🔥 Validar
        cy.contains('Proyecto actualizado correctamente', { timeout: 10000 })
            .should('exist');

    });

});