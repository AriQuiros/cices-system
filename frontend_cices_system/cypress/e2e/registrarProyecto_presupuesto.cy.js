/// <reference types="cypress" />

describe('Registro de Proyectos con Presupuesto', () => {
    beforeEach(() => {
        cy.fixture('registrarProyecto_presupuesto.json').as('proyecto')
        cy.visit('/RegistroProyecto') // ruta de registro de proyectos
    })

    it('registrar un proyecto con presupuesto y fechas de informes', function () {
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
            if (idxObj > 0) cy.get('fieldset#input-project-group button').contains('➕').click()
            cy.get(`input[name="categoriaObjetivo"]`).eq(idxObj).clear().type(objetivo.categoria)
            cy.get(`textarea[name="descripcionObjetivo"]`).eq(idxObj).clear().type(objetivo.descripcion)

            objetivo.metas.forEach((meta, idxMeta) => {
                if (idxMeta > 0) cy.get('fieldset#input-project-group button').contains('➕').eq(idxObj).click()
                cy.get(`select[name="tipoMeta"]`).eq(idxMeta).select(meta.tipo)
                if (meta.tipo === 'CUANTITATIVA') cy.get(`input[name="cantidadMeta"]`).eq(idxMeta).clear().type(meta.cantidad)
                cy.get(`textarea[name="descripcionMeta"]`).eq(idxMeta).clear().type(meta.descripcion)
                meta.indicadores.forEach((indicador, idxInd) => {
                    if (idxInd > 0) cy.get('button').contains('➕').click()
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

        // --- Fechas de informes ---
        if (data.presentacionesInformes?.length) {
            cy.get('input[type="checkbox"]').check()
            data.presentacionesInformes.forEach((informe, idxInforme) => {
                if (idxInforme > 0) cy.get('button').contains('➕').click()
                cy.get('input[name="descripcionInforme"]').eq(idxInforme).clear().type(informe.descripcion)
                cy.get('input[name="fechaInforme"]').eq(idxInforme).clear().type(informe.fechaPresentacion)
            })
        }

        // --- Archivos ---
        data.documentos.forEach((doc) => {
            cy.get('input[name="documento"]').attachFile(doc.ruta)
        })

        // --- Presupuesto ---
        data.presupuestos.forEach((presupuesto, idx) => {
            if (idx === 0) {
                cy.get('button[name="btnEstablecerPresupuesto"]').click()
            }
            // Marcar el checkbox correcto según el tipo de presupuesto (usa minúsculas)
            const tipo = presupuesto.tipoPresupuesto.toLowerCase();
            cy.get(`input[type="checkbox"][name="tipo"][value="${tipo}"]`).check({ force: true });

            // --- Llenar los campos correspondientes ---
            if (tipo === 'financiero') {
                cy.get('input[name="descripcion"]').eq(0).clear().type(presupuesto.descripcion)
                cy.get('input[name="monto"]').clear().type(presupuesto.monto)
                cy.get('select[name="fuenteFinanciamiento"]').select(presupuesto.fuenteFinanciamiento)
                cy.get('input[name="fechaAsignacion"]').eq(0).clear().type(presupuesto.fechaAsignacion)
            }

            if (tipo === 'horas') {
                cy.get('input[name="descripcion"]').eq(1).clear().type(presupuesto.descripcion)
                cy.get('input[name="cantidadHorasMes"]').clear().type(presupuesto.cantidadHorasMes)
                cy.get('input[name="cantidadMeses"]').clear().type(presupuesto.cantidadMeses)
                cy.get('input[name="fechaAsignacion"]').eq(1).clear().type(presupuesto.fechaAsignacion)
            }

        });

// Guardar presupuesto
        cy.get('button').contains('Confirmar').click();


        // --- Submit ---
        cy.get('button[name="btnRegistrarProyecto"]').click()

    })
})
