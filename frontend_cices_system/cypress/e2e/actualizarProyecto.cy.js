/// <reference types="cypress" />

describe("Actualizar proyecto - login real", () => {
    const APP = "http://localhost:5173";
    const API = "http://localhost:8080";

    const usuario = "jennifer.gutierrez@ucr.ac.cr";
    const password = "12345678";

    beforeEach(() => {
        cy.intercept("POST", `${API}/auth/login`).as("login");
        cy.intercept("GET", `${API}/api/reports/proyectos/codigo-nombre-fechas`).as("proyectos");
        cy.intercept("GET", `${API}/api/proyectos/*`).as("proyectoDetalle");
        cy.intercept("GET", `${API}/api/proyectos/lineas-investigacion`).as("lineas");
        cy.intercept("GET", `${API}/api/entidades`).as("entidades");
        cy.intercept("POST", `${API}/api/catalogos/tipos`).as("catalogos");
        cy.intercept("POST", `${API}/api/proyectos/registro`).as("actualizarProyecto");

        cy.visit(`${APP}/`);

        cy.get('input[name="username"]', { timeout: 10000 })
            .should("be.visible")
            .clear()
            .type(usuario);

        cy.get('input[name="password"]')
            .should("be.visible")
            .clear()
            .type(password);

        cy.get('button[type="submit"]')
            .should("be.visible")
            .click();

        cy.wait("@login").its("response.statusCode").should("eq", 200);

        cy.visit(`${APP}/actualizar-proyecto`);
        cy.wait("@proyectos");
    });

    it("debe ingresar, seleccionar un proyecto y actualizar nombre y descripción", () => {
        const sufijo = Date.now();
        const nuevoNombre = `Nuevo nombre ${sufijo}`;
        const nuevaDescripcion = `Esta es la descripccion ${sufijo}`;

        cy.contains("Buscar proyecto", { timeout: 10000 }).should("be.visible");

        // abrir el react-select correcto
        cy.get(".buscador__control", { timeout: 10000 })
            .should("be.visible")
            .click({ force: true });

        // esperar el menú correcto
        cy.get(".buscador__menu", { timeout: 10000 })
            .should("be.visible");

        // elegir una opción real del buscador
        cy.get(".buscador__option", { timeout: 10000 })
            .should("have.length.at.least", 1)
            .first()
            .click({ force: true });

        // aquí sí debe dispararse la carga del proyecto
        cy.wait("@proyectoDetalle", { timeout: 10000 });
        cy.wait("@lineas", { timeout: 10000 });
        cy.wait("@entidades", { timeout: 10000 });

        // puede haber varios llamados a catalogos, con esperar uno basta
        cy.wait("@catalogos", { timeout: 10000 });

        cy.contains("Editar Proyecto", { timeout: 10000 })
            .should("be.visible");

        cy.get('input[name="nombreProyecto"]', { timeout: 10000 })
            .should("be.visible")
            .clear()
            .type(nuevoNombre);

        cy.get('textarea[name="descripcion"]', { timeout: 10000 })
            .should("be.visible")
            .clear()
            .type(nuevaDescripcion);

        cy.contains("button", "Actualizar Proyecto", { timeout: 10000 })
            .scrollIntoView()
            .should("be.visible")
            .click({ force: true });

        cy.get(".swal2-popup", { timeout: 10000 }).should("be.visible");

        cy.contains(".swal2-confirm", "Guardar", { timeout: 10000 })
            .should("be.visible")
            .click({ force: true });

        cy.wait("@actualizarProyecto").then(({ request, response }) => {
            expect(response.statusCode).to.eq(200);

        });

        cy.contains(/actualizado correctamente|Proyecto actualizado/i, { timeout: 10000 })
            .should("be.visible");
    });
});