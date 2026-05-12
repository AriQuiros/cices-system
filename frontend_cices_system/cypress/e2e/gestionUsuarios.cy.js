describe('HU-051 - Gestión de Usuarios', () => {
    const usuariosIniciales = [
        {
            id: 1,
            nombreCompleto: 'Ana Perez',
            nombreUsuario: 'aperez',
            activo: true,
            roles: ['DIRECTOR']
        },
        {
            id: 2,
            nombreCompleto: 'Luis Mora',
            nombreUsuario: 'lmora',
            activo: false,
            roles: ['ASISTENTE']
        },
        {
            id: 3,
            nombreCompleto: 'Maria Solis',
            nombreUsuario: 'msolis',
            activo: true,
            roles: ['ADMINISTRATIVO', 'ASISTENTE']
        }
    ];

    const rolesMock = [
        { id: 1, nombreRol: 'DIRECTOR' },
        { id: 2, nombreRol: 'ASISTENTE' },
        { id: 3, nombreRol: 'ADMINISTRATIVO' }
    ];

    beforeEach(() => {
        cy.intercept('GET', '/api/reports/personas/usuarios', {
            statusCode: 200,
            body: usuariosIniciales
        }).as('getUsuarios');

        cy.intercept('GET', '/api/rol-sistema', {
            statusCode: 200,
            body: rolesMock
        }).as('getRoles');

        cy.visit('/gestion-usuarios');

        cy.wait('@getUsuarios');
        cy.wait('@getRoles');
    });

    it('carga y muestra la lista de usuarios', () => {
        cy.contains('Gestión de Usuarios').should('be.visible');

        cy.get('table').should('be.visible');
        cy.contains('Ana Perez').should('be.visible');
        cy.contains('Luis Mora').should('be.visible');
        cy.contains('Maria Solis').should('be.visible');

        cy.contains('aperez').should('be.visible');
        cy.contains('lmora').should('be.visible');
        cy.contains('msolis').should('be.visible');
    });

    it('filtra usuarios por nombre', () => {
        cy.get('input[placeholder="Buscar por nombre"]').type('Ana');

        cy.contains('Ana Perez').should('be.visible');
        cy.contains('Luis Mora').should('not.exist');
        cy.contains('Maria Solis').should('not.exist');
    });

    it('filtra usuarios por estado activo', () => {
        cy.get('select').select('Activo');

        cy.contains('Ana Perez').should('be.visible');
        cy.contains('Maria Solis').should('be.visible');
        cy.contains('Luis Mora').should('not.exist');
    });

    it('filtra usuarios por estado inactivo', () => {
        cy.get('select').select('Inactivo');

        cy.contains('Luis Mora').should('be.visible');
        cy.contains('Ana Perez').should('not.exist');
        cy.contains('Maria Solis').should('not.exist');
    });

    it('filtra usuarios por rol', () => {
        cy.get('.gu-select__control').click();
        cy.contains('.gu-select__option', 'ASISTENTE').click();
        cy.get('body').click(0, 0);

        cy.contains('Luis Mora').should('be.visible');
        cy.contains('Maria Solis').should('be.visible');
        cy.contains('Ana Perez').should('not.exist');
    });

    it('aplica filtros combinados por nombre y estado', () => {
        cy.get('input[placeholder="Buscar por nombre"]').type('Maria');
        cy.get('select').select('Activo');

        cy.contains('Maria Solis').should('be.visible');
        cy.contains('Ana Perez').should('not.exist');
        cy.contains('Luis Mora').should('not.exist');
    });

    it('muestra mensaje cuando no hay resultados', () => {
        cy.get('input[placeholder="Buscar por nombre"]').type('ZZZ');

        cy.contains('No se encontraron resultados').should('be.visible');
    });

    it('desactiva un usuario activo', () => {
        cy.intercept('PUT', '/api/usuarios/1/estado', {
            statusCode: 200,
            body: {}
        }).as('putDesactivar');

        cy.contains('tr', 'Ana Perez').within(() => {
            cy.contains('Desactivar').click();
        });

        cy.contains('¿Desea desactivar este usuario?').should('be.visible');
        cy.get('.swal2-confirm').click();

        cy.wait('@putDesactivar')
            .its('request.body')
            .should('deep.equal', { activo: false });
    });

    it('activa un usuario inactivo', () => {
        cy.intercept('PUT', '/api/usuarios/2/estado', {
            statusCode: 200,
            body: {}
        }).as('putActivar');

        cy.contains('tr', 'Luis Mora').within(() => {
            cy.contains('Activar').click();
        });

        cy.contains('¿Desea activar este usuario?').should('be.visible');
        cy.get('.swal2-confirm').click();

        cy.wait('@putActivar')
            .its('request.body')
            .should('deep.equal', { activo: true });
    });

    it('recarga la lista después de cambiar estado', () => {
        let usuarioDesactivado = false;

        cy.intercept('GET', '/api/reports/personas/usuarios', (req) => {
            if (!usuarioDesactivado) {
                req.reply({
                    statusCode: 200,
                    body: [
                        {
                            id: 1,
                            nombreCompleto: 'Ana Perez',
                            nombreUsuario: 'aperez',
                            activo: true,
                            roles: ['DIRECTOR']
                        }
                    ]
                });
            } else {
                req.reply({
                    statusCode: 200,
                    body: [
                        {
                            id: 1,
                            nombreCompleto: 'Ana Perez',
                            nombreUsuario: 'aperez',
                            activo: false,
                            roles: ['DIRECTOR']
                        }
                    ]
                });
            }
        }).as('getUsuariosDinamico');

        cy.intercept('GET', '/api/rol-sistema', {
            statusCode: 200,
            body: [{ id: 1, nombreRol: 'DIRECTOR' }]
        }).as('getRolesRecarga');

        cy.intercept('PUT', '/api/usuarios/1/estado', (req) => {
            usuarioDesactivado = true;
            req.reply({
                statusCode: 200,
                body: {}
            });
        }).as('putEstado');

        cy.visit('/gestion-usuarios');

        cy.wait('@getUsuariosDinamico');
        cy.wait('@getRolesRecarga');

        cy.contains('tr', 'Ana Perez').within(() => {
            cy.contains('button', 'Desactivar').should('be.visible').click({ force: true });
        });

        cy.get('.swal2-confirm').click();

        cy.wait('@putEstado');
        cy.wait('@getUsuariosDinamico');

        cy.contains('tr', 'Ana Perez').within(() => {
            cy.contains('Inactivo').should('be.visible');
            cy.contains('button', 'Activar').should('be.visible');
        });
    });
});