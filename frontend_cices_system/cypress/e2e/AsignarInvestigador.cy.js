/// <reference types="cypress" />

describe('AsignarInvestigador – Eiliana sin horas', () => {
    const APP_URL = 'http://localhost:5173/AsignarInvestigador';
    const API = 'http://localhost:8080/api';
    const proyecto = {
        id: 1, codigo: '2024-001', nombre: 'Sistema de Gestión',
        estado: 'ACTIVO', linea: 'TI',
        periodo: { ini: '2025-01-01', fin: '2025-12-31' },
        horasPlanificadas: 300, asignados: { count: 1, horas: 120 }
    };

    beforeEach(() => {
        // Token falso en sessionStorage para que pase el Authorization
        const fakePayload = btoa(JSON.stringify({ exp: Math.floor(Date.now()/1000)+3600 }));
        const fakeJwt = `x.${fakePayload}.y`;
        const authObj = { user: { id: 1, nombre: 'tester' }, token: fakeJwt, exp: JSON.parse(atob(fakePayload)).exp };
        cy.window().then(win => win.sessionStorage.setItem('auth', JSON.stringify(authObj)));

        // Intercepts (REGISTRAR ANTES DEL VISIT)
        cy.intercept('GET', `${API}/catalogos/roles-proyecto*`, [
            { id: 1, nombre: 'COLABORADOR' },
            { id: 2, nombre: 'INVESTIGADOR_PRINCIPAL' },
        ]).as('roles');

        cy.intercept('GET', `${API}/proyectos/suggest*`, req => {
            const q = new URL(req.url).searchParams.get('q') || '';
            req.reply(q ? [{ id: 1, codigo: proyecto.codigo, nombre: proyecto.nombre }] : []);
        }).as('sugerir');

        cy.intercept('GET', `${API}/proyectos/search*`, req => {
            const q = new URL(req.url).searchParams.get('q') || '';
            req.reply(q === proyecto.codigo ? {
                id: proyecto.id, codigo: proyecto.codigo, nombre: proyecto.nombre,
                estado: proyecto.estado, linea: proyecto.linea,
                ini: proyecto.periodo.ini, fin: proyecto.periodo.fin,
                horas_planificadas: proyecto.horasPlanificadas,
                asignados_cnt: proyecto.asignados.count, horas_comprometidas: proyecto.asignados.horas
            } : null);
        }).as('buscar');

        cy.intercept('GET', `${API}/proyectos/${proyecto.id}/asignados*`, [
            { id: 99, nombre: 'Investigador Asignado', rol: 'INVESTIGADOR_PRINCIPAL',
                periodo: { ini: '2025-01-01', fin: '2025-12-31' }, horas: 120, estado: 'Vigente' }
        ]).as('asignados');

        // OJO: ruta real es /investigador/investigadores
        cy.intercept('GET', `${API}/investigador/investigadores*`, req => {
            const q = new URL(req.url).searchParams.get('q')?.toLowerCase() || '';
            const data = [{ id: 12, nombre: 'Eiliana Montero Rojas', unidad: 'Unidad de Investigación' }];
            req.reply(q ? data.filter(i => i.nombre.toLowerCase().includes(q)) : data);
        }).as('investigadores');

        cy.intercept('POST', `${API}/proyectos/${proyecto.id}/asignaciones`, req => {
            req.reply({ ok: true });
        }).as('postAsign');

        cy.intercept('DELETE', `${API}/proyectos/${proyecto.id}/asignaciones/*`, { ok: true }).as('delAsign');

        cy.visit(APP_URL);
        cy.wait('@roles');
    });

    it('carga asignados tras seleccionar proyecto y guarda sin horas', () => {
        // Seleccionar investigadora disponible
        cy.get('.aix__available__head input[placeholder="Nombre"]').type('Eiliana');
        cy.wait('@investigadores');
        cy.contains('.aix__list li', 'Eiliana Montero Rojas')
            .within(() => cy.contains('Seleccionar').click());

        // Seleccionar proyecto
        cy.get('.aix__projectsearch__input input[placeholder="Código o Nombre"]').type('2024-001');
        cy.wait('@sugerir'); // suele disparar en el debounce
        cy.get('.aix__projectsearch button').click();

        // Espera a que se disparen ambas: search y asignados
        cy.wait('@buscar');
        cy.wait('@asignados');

        // Verifica que se cargaron asignados del servidor
        cy.get('.aix__table tbody').contains('td', 'Investigador Asignado').should('exist');

        // Elegir rol. Dejar horas/meses/fechas vacíos.
        cy.get('select').select('COLABORADOR');

        // Agregar y guardar
        cy.get('.aix__actions .btn--blue').click();
        cy.get('.aix__stickybar .btn--blue').click();

        // Validar JSON enviado por el POST
        cy.wait('@postAsign').its('request.body').then(body => {
            expect(body).to.have.keys('proyectoId','investigadorId','rolProyectoId','horasMes','meses','ini','fin');
            expect(body.proyectoId).to.eq(1);
            expect(body.investigadorId).to.eq(12);
            expect(body.rolProyectoId).to.eq(1);
            expect(body.ini).to.eq('2025-01-01');
            expect(body.fin).to.eq('2025-12-31');
        });
    });
});
