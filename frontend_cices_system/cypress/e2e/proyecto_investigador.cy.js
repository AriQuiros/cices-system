// cypress/e2e/proyecto_investigador.cy.ts
const API = '**/api/investigador/mis-proyectos';

const proyectos = [
    { idProyecto:1, nombreProyecto:'Clima Urbano', codigoProyecto:'P-001', fechaInicio:'2024-01-01', fechaFinalizacion:'2024-12-31', lineaInvestigacion:'Cambio Climático' },
    { idProyecto:2, nombreProyecto:'Minería de Datos', codigoProyecto:'P-002', fechaInicio:'2024-02-01', fechaFinalizacion:'2024-11-30', lineaInvestigacion:'IA' },
    { idProyecto:3, nombreProyecto:'Agro Inteligente', codigoProyecto:'P-003', fechaInicio:'2024-03-10', fechaFinalizacion:'2025-03-10', lineaInvestigacion:'Agronomía' },
];

describe('ProyectoInvestigador – filtros en UI', () => {
    beforeEach(() => {
        // 1) Intercepta ANTES de visitar
        cy.intercept('GET', '**/api/investigador/mis-proyectos', {
            statusCode: 200,
            body: proyectos,
        }).as('misProyectos');

        // 2) Visita la ruta REAL donde se monta el componente
        cy.visit('http://localhost:5173/investigador', { // <-- cámbialo a tu path real
            onBeforeLoad(win) {
                // Tu componente usa `${API}/api/...`
                win.API = 'http://localhost:8080';        // <-- define API
                // Tu componente exige token desde el AppContext
                win.localStorage.setItem('token', 'e2e'); // <-- si tu AppContext lo lee de localStorage
                // Si tu app verifica roles:
                win.localStorage.setItem('roles', '["INVESTIGADOR"]');
            },
        });

        // 3) Espera a la llamada de datos
        cy.wait('@misProyectos');
        cy.contains('Mis proyectos'); // smoke de que montó
    });



    it('filtra por nombre', () => {
        cy.get('select.filtro').select('nombre');
        cy.get('input.buscador').clear().type('minería');
        cy.contains('Minería de Datos').should('exist');
        cy.contains('Clima Urbano').should('not.exist');
        cy.contains('Agro Inteligente').should('not.exist');
    });

    it('filtra por código', () => {
        cy.get('select.filtro').select('codigo');
        cy.get('input.buscador').clear().type('P-003');
        cy.contains('Agro Inteligente').should('exist');
        cy.contains('Clima Urbano').should('not.exist');
        cy.contains('Minería de Datos').should('not.exist');
    });

    it('filtra por línea de investigación', () => {
        cy.get('select.filtro').select('lineaInvestigacion');
        cy.get('input.buscador').clear().type('ia');
        cy.contains('Minería de Datos').should('exist');
        cy.contains('Clima Urbano').should('not.exist');
        cy.contains('Agro Inteligente').should('not.exist');
    });

    it('filtro "Todos los campos" busca también por fechas', () => {
        // valor por defecto: "varios"
        cy.get('select.filtro').should('have.value', 'varios');
        cy.get('input.buscador').clear().type('2024-01-01');
        cy.contains('Clima Urbano').should('exist');
        cy.contains('Minería de Datos').should('not.exist');
    });

    it('limpiar filtros restaura la lista completa', () => {
        cy.get('select.filtro').select('nombre');
        cy.get('input.buscador').clear().type('clima');
        cy.contains('Clima Urbano').should('exist');
        cy.contains('Minería de Datos').should('not.exist');

        cy.get('button.boton-limpiar').click();
        cy.contains('Clima Urbano').should('exist');
        cy.contains('Minería de Datos').should('exist');
        cy.contains('Agro Inteligente').should('exist');
    });

    it('sin coincidencias muestra mensaje de lista vacía', () => {
        cy.get('select.filtro').select('nombre');
        cy.get('input.buscador').clear().type('no existe');
        cy.contains('No tienes proyectos asignados.').should('exist');
    });

    it('paginación con 13 ítems muestra 6 por página y navega', () => {
        const grande = Array.from({ length: 13 }, (_, i) => ({
            idProyecto: i+1, nombreProyecto:`Proyecto ${i+1}`, codigoProyecto:`P-${String(i+1).padStart(3,'0')}`,
            fechaInicio:'2024-01-01', fechaFinalizacion:'2024-12-31', lineaInvestigacion:'X'
        }));
        cy.intercept('GET', API, { statusCode: 200, body: grande }).as('misProyectos2');
        cy.reload();
        cy.wait('@misProyectos2');

        cy.contains(/Mostrando 6 de 13 proyectos/i).should('exist');
        cy.get('button.numero-pagina').contains('2').click();
        cy.contains(/Página 2 de 3/i).should('exist');
        cy.get('button.boton-paginacion').contains('Siguiente').click();
        cy.contains(/Página 3 de 3/i).should('exist');
    });
});
