/// <reference types="cypress" />

describe('Registro Investigadores', () => {
    beforeEach(() => {
        cy.fixture('investigadores_registro.json').as('investigadores')
        cy.intercept('POST', 'http://localhost:8080/api/usuarios/registro').as('postRegistro')
        cy.visit('http://localhost:5173/registro')
    })

    it('registra todos los investigadores del JSON', function () {
        cy.wrap(this.investigadores).each((data) => {
            // Formulario principal
            cy.get('input[name="nombre"]').clear().type(data.nombreCompleto)
            cy.get('input[name="nacionalidad"]').clear().type(data.nacionalidad)
            cy.get('select[name="tipoIdentificacion"]').select(data.tipoIdentificacion)
            cy.get('input[name="identificacion"]').clear().type(data.numeroIdentificacion)
            cy.get('input[name="telefono"]').clear().type(data.telefono)
            cy.get('input[name="correo"]').clear().type(data.correo)
            cy.get('input[name="contrasena"]').clear().type(data.contrasena)
            cy.get('input[name="confirmarContrasena"]').clear().type(data.confirmarContrasena)

            // Modal investigador
            cy.contains('Investigador').click()
            cy.get('input[name="institucion"]').clear().type(data.institucionOrigen)
            cy.get('input[name="unidadAcademica"]').clear().type(data.unidadAcademica)
            cy.get('select[name="gradoAcademico"]').select('Licenciatura')
            cy.get('input[placeholder="Nombre de la certificación"]').clear().type(data.certificacionNombre)
            cy.get('.rows-group .row select').first().select('LICENCIA PROFESIONAL')
            cy.get('.rows-group .row input[type="date"]').type(data.certificacionExpiracion)
            cy.get('.btn-confirm').click()

            // Enviar
            cy.get('button[type="submit"]').click()

            // Espera de request y aserción sin encadenar sobre el subject
            cy.wait('@postRegistro').its('response.statusCode').then((status) => {
                expect(status).to.be.oneOf([200, 201])
            })

            // Popup de éxito
            cy.contains('Usuario registrado exitosamente', { timeout: 8000 }).should('be.visible')

            // Cerrar popup si existe y continuar
            cy.get('body').then(($body) => {
                if ($body.find('button, .btn-close, .btn-ok').length) {
                    // intenta por texto primero
                    const cerrar = $body.find('button').filter((_, b) => b.textContent?.includes('Cerrar'))
                    if (cerrar.length) {
                        cy.wrap(cerrar[0]).click()
                    } else if ($body.find('.btn-close').length) {
                        cy.get('.btn-close').first().click()
                    } else if ($body.find('.btn-ok').length) {
                        cy.get('.btn-ok').first().click()
                    }
                }
            })

            cy.contains('Usuario registrado exitosamente').should('not.exist')

            // Reset de estado de la página antes del siguiente registro
            cy.reload()
        })
    })
})
