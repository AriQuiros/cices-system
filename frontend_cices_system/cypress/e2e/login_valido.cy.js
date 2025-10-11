/// <reference types="cypress" />

describe('Login Válido', () => {
    beforeEach(() => {
        cy.fixture('validlogin.json').as('usuariosValidos')
        cy.intercept('POST', 'http://localhost:8080/auth/login').as('postLogin')
        cy.visit('http://localhost:5173/')
        cy.wait(2000)
    })

    it('permite login con credenciales válidas del JSON', function () {
        cy.wrap(this.usuariosValidos).each((data) => {
            // Esperar a que aparezcan los elementos del login
            cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible')
            cy.get('input[name="password"]', { timeout: 10000 }).should('be.visible')
            
            // Llenar formulario de login
            cy.get('input[name="username"]').clear().type(data.usuario)
            cy.get('input[name="password"]').clear().type(data.contrasena)
            
            // Hacer clic en el botón de login
            cy.get('button[type="submit"]').click()
            
            // Esperar la respuesta del servidor
            cy.wait('@postLogin').its('response.statusCode').then((status) => {
                expect(status).to.be.oneOf([200, 201])
            })
            
            // Verificar que se redirige correctamente después del login exitoso
            // El login debería redirigir a una de las páginas según el rol
            cy.url().should('not.include', '/login')
            cy.url().should('match', /(\/director|\/administrador|\/investigador|\/dashboard)/)
            
            // Si hay un mensaje de bienvenida, verificarlo
            cy.get('body').then(($body) => {
                if ($body.find('[role="alert"], .toast, .success-message').length > 0) {
                    cy.contains(/bienvenid/i).should('be.visible')
                }
            })
            
            // Volver a la página de login para la siguiente iteración si hay más usuarios
            cy.visit('http://localhost:5173/')
            cy.wait(1000) // Esperar a que cargue
        })
    })

    it('muestra el formulario de login correctamente', () => {
        // Verificar que los elementos del formulario están presentes con timeout
        cy.get('h2', { timeout: 10000 }).should('contain', 'Bienvenidos')
        cy.get('h3', { timeout: 10000 }).should('contain', 'Iniciar Sesión')
        cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible')
        cy.get('input[name="password"]', { timeout: 10000 }).should('be.visible')
        cy.get('button[type="submit"]', { timeout: 10000 }).should('contain', 'Login')
        cy.get('a[href="/Registro"]', { timeout: 10000 }).should('contain', 'Click aquí')
    })

    it('valida que los campos sean requeridos', () => {
        // Esperar a que el botón aparezca
        cy.get('button[type="submit"]', { timeout: 10000 }).should('be.visible')
        
        // Intentar enviar formulario vacío
        cy.get('button[type="submit"]').click()
        
        // Verificar que los campos requeridos muestran validación
        cy.get('input[name="username"]:invalid').should('exist')
        cy.get('input[name="password"]:invalid').should('exist')
    })
})
