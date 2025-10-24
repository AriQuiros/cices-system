/// <reference types="cypress" />

describe('Registro de Proyectos', () => {
    beforeEach(() => {
        cy.fixture('registrarProyecto.json').as('proyecto')
        cy.visit('/RegistroProyecto') // ruta de registro de proyectos
    })

    it('registrar un proyecto con todos los datos del JSON con fechas de informes', function () {
        const data = this.proyecto

        // --- Formulario principal ---
        cy.get('input[name="codigo"]').clear().type(data.codigo)
        cy.get('input[name="nombre"]').clear().type(data.nombre)
        cy.get('input[name="unidadOrigen"]').clear().type(data.unidadOrigen)
        cy.get('select[name="estado"]').select(data.estado)
        cy.get('select[name="tipo"]').select(data.tipo)
        cy.get('input[name="lineaInvestigacion"]').clear().type(data.lineaInvestigacion)
        cy.get('textarea[name="descripcion"]').clear().type(data.descripcion)
        cy.get('textarea[name="objetivoGeneral"]').clear().type(data.objetivoGeneral)

        // --- Objetivos específicos ---
        data.objetivosEspecificos.forEach((objetivo, idxObj) => {
            if (idxObj > 0) {
                cy.get('fieldset#input-project-group button').contains('➕').click()
            }
            cy.get(`input[name="categoriaObjetivo"]`).eq(idxObj).clear().type(objetivo.categoria)
            cy.get(`textarea[name="descripcionObjetivo"]`).eq(idxObj).clear().type(objetivo.descripcion)

            objetivo.metas.forEach((meta, idxMeta) => {
                if (idxMeta > 0) {
                    cy.get('fieldset#input-project-group button').contains('➕').eq(idxObj).click()
                }
                cy.get(`select[name="tipoMeta"]`).eq(idxMeta).select(meta.tipo)
                if (meta.tipo === 'CUANTITATIVA') {
                    cy.get(`input[name="cantidadMeta"]`).eq(idxMeta).clear().type(meta.cantidad)
                }
                cy.get(`textarea[name="descripcionMeta"]`).eq(idxMeta).clear().type(meta.descripcion)
                meta.indicadores.forEach((indicador, idxInd) => {
                    if (idxInd > 0) {
                        cy.get('button').contains('➕').click()
                    }
                    cy.get('input[name="indicador"]').eq(idxInd).clear().type(indicador.indicador || indicador)
                })
            })
        })

        // --- Entidades vinculadas ---
        data.institucionesParticipantes.forEach((inst, idxInst) => {
            cy.get('input[name="nombreInstitucion"]').eq(idxInst).clear().type(inst.institucion)
            inst.unidadesParticipante.forEach((unidad, idxUnidad) => {
                cy.get('input[name="nombreUnidad"]').eq(idxUnidad).clear().type(unidad.unidad)
            })
        })

        // --- Fechas ---
        cy.get('input[name="fechaInicio"]').clear().type(data.fechaInicio)
        cy.get('input[name="fechaFinalizacion"]').clear().type(data.fechaFinalizacion)

        // --- Fechas de informes (si aplica) ---
        if (data.presentacionesInformes?.length) {
            cy.get('input[type="checkbox"]').check()
            data.presentacionesInformes.forEach((informe, idxInforme) => {
                if (idxInforme > 0) {
                    cy.get('button').contains('➕').click()
                }
                cy.get('input[name="descripcionInforme"]').eq(idxInforme).clear().type(informe.descripcion)
                cy.get('input[name="fechaInforme"]').eq(idxInforme).clear().type(informe.fechaPresentacion)
            })
        }

        // --- Archivos ---
        data.documentos.forEach((doc) => {
            cy.get('input[name="documento"]').attachFile(doc.ruta)
        })

        // --- Presupuesto ---
        //cy.get('button[name="btnEstablecerPresupuesto"]').click()
        // Aquí se puede agregar la lógica para completar el modal de presupuesto si lo deseas

        // --- Submit ---
        cy.get('button[name="btnRegistrarProyecto"]').click()
    })
})
