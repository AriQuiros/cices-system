/// <reference types="cypress" />

describe('VincularInvestigador – evita duplicados en segundo guardado', () => {
    const APP_URL = 'http://localhost:5173/AsignarInvestigador';
    const API = 'http://localhost:8080/api';
    const proyecto = {
        id: 1,
        codigo: '2024-001',
        nombre: 'Sistema de Gestión',
        estado: 'ACTIVO',
        linea: 'TI',
        periodo: { ini: '2025-01-01', fin: '2025-12-31' },
    };

    beforeEach(() => {
        // Auth falso
        const exp = Math.floor(Date.now() / 1000) + 3600;
        const jwt = `x.${btoa(JSON.stringify({ exp }))}.y`;
        const auth = { user: { id: 1, nombre: 'tester' }, token: jwt, exp };
        cy.window().then(w => w.sessionStorage.setItem('auth', JSON.stringify(auth)));

        // Endpoints usados por AppProvider
        cy.intercept('GET', `${API}/catalogos/roles-proyecto*`, [
            { id: 1, nombre: 'COLABORADOR' },
            { id: 2, nombre: 'INVESTIGADOR_PRINCIPAL' },
        ]).as('roles');

        cy.intercept('GET', `${API}/investigador/investigadores*`, [
            { id: 12, nombre: 'Eiliana Montero Rojas', unidad: 'Unidad de Investigación' },
        ]).as('investigadores');

        cy.intercept('GET', `${API}/proyectos/suggest*`, [
            { id: 1, codigo: proyecto.codigo, nombre: proyecto.nombre },
        ]).as('sugerir');

        cy.intercept('GET', `${API}/proyectos/search*`, {
            id: proyecto.id,
            codigo: proyecto.codigo,
            nombre: proyecto.nombre,
            estado: proyecto.estado,
            linea: proyecto.linea,
            ini: proyecto.periodo.ini,
            fin: proyecto.periodo.fin,
            horas_planificadas: 300,
            asignados_cnt: 0,
            horas_comprometidas: 0,
        }).as('buscar');

        // Mantén asignados vacío para que el duplicado lo detecte el servidor (409)
        cy.intercept('GET', `${API}/proyectos/${proyecto.id}/asignados*`, []).as('asignados');

        // Primer POST ok, segundo 409
        let count = 0;
        cy.intercept('POST', `${API}/proyectos/${proyecto.id}/asignaciones`, req => {
            count += 1;
            if (count === 1) req.reply({ statusCode: 200, body: { ok: true } });
            else req.reply({ statusCode: 409, body: { message: 'El investigador ya está asignado a este proyecto' } });
        }).as('postAsign');

        cy.visit(APP_URL);
        cy.wait('@roles');
    });

    it('primer guardado OK y segundo falla con 409 por duplicado', () => {
        // Seleccionar investigadora
        cy.get('.aix__available__head input[placeholder="Nombre"]').type('Eiliana');
        cy.wait('@investigadores');
        cy.contains('.aix__list li', 'Eiliana Montero Rojas')
            .within(() => cy.contains('Seleccionar').click());

        // Seleccionar proyecto
        cy.get('.aix__projectsearch__input input[placeholder="Código o Nombre"]').type('2024-001');
        cy.wait('@sugerir');
        cy.get('.aix__projectsearch button').click();
        cy.wait(['@buscar', '@asignados']);

        // Rol
        cy.get('select').select('COLABORADOR');

        // Primer guardado
        cy.get('.aix__actions .btn--blue').click();      // Agregar
        cy.get('.aix__stickybar .btn--blue').click();    // Guardar
        cy.wait('@postAsign').its('response.statusCode').should('be.oneOf', [200, 201]);

        // Re-seleccionar y volver a agregar para habilitar Guardar
        cy.get('.aix__available__head input[placeholder="Nombre"]').clear().type('Eiliana');
        cy.wait('@investigadores');
        cy.contains('.aix__list li', 'Eiliana Montero Rojas')
            .within(() => cy.contains('Seleccionar').click());
        cy.get('select').select('COLABORADOR');
        cy.get('.aix__actions .btn--blue').click();

        // Segundo guardado → 409
        cy.get('.aix__stickybar .btn--blue').click();
    });
});
