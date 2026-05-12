describe('HU-056 - Certificaciones', () => {
    const paginaMock = {
        content: [
            {
                identificacionInvestigador: '111',
                nombreInvestigador: 'Ana Perez',
                nombre: 'Licencia Investigador',
                institucion: 'UNA',
                tipo: 'Licencia',
                estado: 'Activa',
                fecha: '2026-05-10'
            },
            {
                identificacionInvestigador: '111',
                nombreInvestigador: 'Ana Perez',
                nombre: 'Acreditación Científica',
                institucion: 'CONICIT',
                tipo: 'Acreditación',
                estado: 'Vencida',
                fecha: '2025-08-20'
            },
            {
                identificacionInvestigador: '222',
                nombreInvestigador: 'Luis Mora',
                nombre: 'Licencia de Bioética',
                institucion: 'TEC',
                tipo: 'Licencia',
                estado: 'Activa',
                fecha: '2027-01-15'
            }
        ],
        totalPages: 2,
        totalElements: 3
    };

    beforeEach(() => {
        cy.intercept('POST', '/api/reports/certificaciones/filtrar?page=0&size=12', {
            statusCode: 200,
            body: paginaMock
        }).as('filtrarCertificaciones');

        cy.intercept('POST', '/api/reports/certificaciones/reporte?formato=pdf', {
            statusCode: 200,
            body: 'PDF-MOCK'
        }).as('exportarPdf');

        cy.intercept('POST', '/api/reports/certificaciones/reporte?formato=xlsx', {
            statusCode: 200,
            body: 'XLSX-MOCK'
        }).as('exportarExcel');

        cy.intercept('POST', '/api/reports/certificaciones/reporte?formato=docx', {
            statusCode: 200,
            body: 'DOCX-MOCK'
        }).as('exportarWord');

        cy.visit('/reporte-certificaciones');
        cy.wait('@filtrarCertificaciones');
    });

    it('carga y muestra certificaciones', () => {
        cy.contains('Certificaciones').should('be.visible');
        cy.contains('Ana Perez').should('be.visible');
        cy.contains('Luis Mora').should('be.visible');
        cy.contains('Licencia Investigador').should('be.visible');
        cy.contains('Acreditación Científica').should('be.visible');
    });

    it('filtra por nombre de investigador', () => {
        cy.intercept('POST', '/api/reports/certificaciones/filtrar?page=0&size=12', (req) => {
            expect(req.body.nombre).to.eq('Ana');
            req.reply({
                statusCode: 200,
                body: {
                    content: [paginaMock.content[0], paginaMock.content[1]],
                    totalPages: 1,
                    totalElements: 2
                }
            });
        }).as('filtrarPorNombre');

        cy.get('input[placeholder="Nombre..."]').clear().type('Ana');
        cy.wait('@filtrarPorNombre');

        cy.contains('Ana Perez').should('be.visible');
    });

    it('cambia el orden por fecha', () => {
        cy.intercept('POST', '/api/reports/certificaciones/filtrar?page=0&size=12', (req) => {
            expect(req.body.ordenFecha).to.eq('desc');
            req.reply({
                statusCode: 200,
                body: paginaMock
            });
        }).as('ordenDesc');

        cy.contains('label', 'Orden por fecha:')
            .parent()
            .find('select')
            .select('Más recientes primero');

        cy.wait('@ordenDesc');
    });

    it('permite agrupar por investigador', () => {
        cy.get('input[type="checkbox"]').check();
        cy.contains('Ana Perez').should('be.visible');
        cy.contains('Luis Mora').should('be.visible');
    });

    it('muestra mensaje cuando no hay resultados', () => {
        cy.intercept('POST', '/api/reports/certificaciones/filtrar?page=0&size=12', {
            statusCode: 200,
            body: {
                content: [],
                totalPages: 0,
                totalElements: 0
            }
        }).as('sinResultados');

        cy.reload();
        cy.wait('@sinResultados');

        cy.contains('No se encontraron resultados').should('be.visible');
    });

    it('exporta reporte en pdf', () => {
        cy.get('.cert-export select').select('PDF');
        cy.contains('button', 'Exportar').click();

        cy.wait('@exportarPdf');
    });

    it('exporta reporte en excel', () => {
        cy.get('.cert-export select').select('Excel');
        cy.contains('button', 'Exportar').click();

        cy.wait('@exportarExcel');
    });

    it('exporta reporte en word', () => {
        cy.get('.cert-export select').select('Word');
        cy.contains('button', 'Exportar').click();

        cy.wait('@exportarWord');
    });

    it('permite navegar entre páginas', () => {
        cy.intercept('POST', '/api/reports/certificaciones/filtrar?page=1&size=12', {
            statusCode: 200,
            body: {
                content: [paginaMock.content[2]],
                totalPages: 2,
                totalElements: 3
            }
        }).as('pagina2');

        cy.contains('button', 'Siguiente →').click();
        cy.wait('@pagina2');
        cy.contains('Página 2 de 2').should('be.visible');
    });
});