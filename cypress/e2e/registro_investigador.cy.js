/// <reference types="cypress" />

describe('Registro Investigadores', () => {
    beforeEach(() => {
        cy.fixture('investigadores_registro.json').as('investigadores')
        cy.visit('http://localhost:5173/registro')
    })

    it('debería registrar a todos los investigadores del JSON', function () {
        this.investigadores.forEach((data, index) => {
            // --- Formulario principal ---
            cy.get('input[name="nombre"]').clear().type(data.nombreCompleto)
            cy.get('input[name="nacionalidad"]').clear().type(data.nacionalidad)
            cy.get('select[name="tipoIdentificacion"]').select(data.tipoIdentificacion)
            cy.get('input[name="identificacion"]').clear().type(data.numeroIdentificacion)
            cy.get('input[name="telefono"]').clear().type(data.telefono)
            cy.get('input[name="correo"]').clear().type(data.correo)
            cy.get('input[name="contrasena"]').clear().type(data.contrasena)
            cy.get('input[name="confirmarContrasena"]').clear().type(data.confirmarContrasena)

            // Rol investigador (abre modal)
            cy.contains('Investigador').click()

            // --- Modal investigador ---
            cy.get('input[name="institucion"]').clear().type(data.institucionOrigen)
            cy.get('input[name="unidadAcademica"]').clear().type(data.unidadAcademica)

            // Grado académico
            cy.get('select[name="gradoAcademico"]').select('Licenciatura')

            // Certificación
            cy.get('input[placeholder="Nombre de la certificación"]').clear().type(data.certificacionNombre)
            cy.get('.rows-group .row select').first().select('LICENCIA PROFESIONAL')
            cy.get('.rows-group .row input[type="date"]').type(data.certificacionExpiracion)

            // Confirmar modal
            cy.get('.btn-confirm').click()

            // Confirmar formulario principal
            cy.get('button[type="submit"]').click()

            // Validar popup de éxito
            cy.contains('Usuario registrado exitosamente', { timeout: 6000 }).should('be.visible')

            // Cierra el popup antes de pasar al siguiente
            cy.wait(1000)
            cy.reload()
        })
    })
})
