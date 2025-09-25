/// <reference types="cypress" />
/* eslint-env mocha */

describe('Registro Investigador - inválidos', () => {
    let postCalls = 0

    beforeEach(() => {
        postCalls = 0
        cy.fixture('investigador_invalido.json').as('d')
        cy.visit('http://localhost:5173/registro')
        cy.intercept('POST', 'http://localhost:8080/api/usuarios/registro', () => {
            postCalls++
        }).as('postRegistro')
    })

    it('bloquea por correo inválido y luego por contraseñas', function () {
        const d = this.d

        // Form principal (datos inválidos)
        cy.get('input[name="nombre"]').type(d.nombreCompleto)
        cy.get('input[name="nacionalidad"]').type(d.nacionalidad)
        cy.get('select[name="tipoIdentificacion"]').select(d.tipoIdentificacion)
        cy.get('input[name="identificacion"]').type(d.numeroIdentificacion)
        cy.get('input[name="telefono"]').type(d.telefono)
        cy.get('input[name="correo"]').type(d.correo) // no @ucr.ac.cr
        cy.get('input[name="contrasena"]').type(d.contrasena) // corta
        cy.get('input[name="confirmarContrasena"]').type(d.confirmarContrasena) // no coincide

        // Modal investigador → falta fecha
        cy.contains('Investigador').click()
        cy.get('input[name="institucion"]').type(d.institucionOrigen)
        cy.get('input[name="unidadAcademica"]').type(d.unidadAcademica)
        cy.get('select[name="gradoAcademico"]').select('Licenciatura')
        cy.get('input[placeholder="Nombre de la certificación"]').type(d.certificacionNombre)
        cy.get('.rows-group .row select').first().select('LICENCIA PROFESIONAL')
        cy.get('.btn-confirm').click()
        cy.contains('Falta la fecha de expiración en una certificación.').should('be.visible')
        cy.get('.btn-cancel').click()

        // Enviar → valida correo primero, no debe haber POST
        cy.get('button[type="submit"]').click()
        cy.contains('El correo debe terminar en @ucr.ac.cr').should('be.visible')
        cy.then(() => {
            expect(postCalls, 'POSTs tras correo inválido').to.eq(0)
        })

        // Corregir correo → ahora valida contraseñas, tampoco POST
        cy.get('input[name="correo"]').clear().type('prueba@ucr.ac.cr')
        cy.get('button[type="submit"]').click()
        cy.contains('Las contraseñas no coinciden', { timeout: 4000 }).should('be.visible')
        cy.then(() => {
            expect(postCalls, 'POSTs tras contraseñas inválidas').to.eq(0)
        })
    })
})
