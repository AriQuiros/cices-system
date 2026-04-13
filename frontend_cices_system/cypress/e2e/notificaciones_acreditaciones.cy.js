/// <reference types="cypress" />

describe("HU - Notificaciones de vencimiento de certificaciones", () => {
    const usuario = "cristobal.chingalvarez@ucr.ac.cr";
    const password = "12345678";

    beforeEach(() => {
        cy.intercept("POST", "http://localhost:8080/auth/login").as("login");

        cy.intercept(
            "GET",
            "**/api/reports/notificaciones/usuario/**/detalladas"
        ).as("getNotificaciones");

        cy.visit("http://localhost:5173/");

        cy.get('input[name="username"]', { timeout: 10000 })
            .should("be.visible")
            .clear()
            .type(usuario);

        cy.get('input[name="password"]')
            .should("be.visible")
            .clear()
            .type(password);

        cy.get('button[type="submit"]').click();

        cy.wait("@login")
            .its("response.statusCode")
            .should("eq", 200);

        cy.visit("http://localhost:5173/notificaciones");

        cy.wait("@getNotificaciones");
    });

    it("debe mostrar notificaciones de vencimiento de acreditaciones o licencias", () => {
        cy.url().should("include", "/notificaciones");

        cy.contains("Filtrar por tipo").should("be.visible");
        cy.contains("Filtrar por estado").should("be.visible");
        cy.contains("Orden por fecha").should("be.visible");

        cy.contains("Acreditacion o licencia").should("be.visible");
        cy.contains("Nombre de la acreditacion o licencia").should("be.visible");
        cy.contains("Fecha de expiracion").should("be.visible");
        cy.contains("Nombre del investigador").should("be.visible");

        cy.contains("Cristóbal Ching Álvarez").should("be.visible");

        cy.contains(/Resultados\s*:\s*[1-9]/).should("be.visible");
    });

    it("debe filtrar las notificaciones por acreditación o licencia y por no leídas", () => {
        cy.get("#filtro-tipo-notificacion")
            .should("be.visible")
            .select("Acreditacion o licencia");

        cy.get("#filtro-estado-notificacion")
            .should("be.visible")
            .select("NO_LEIDAS");

        cy.contains("Acreditacion o licencia").should("be.visible");
        cy.contains("No leida").should("be.visible");
        cy.contains(/Resultados\s*:\s*[1-9]/).should("be.visible");
    });

    it("debe permitir marcar una notificación como leída", () => {
        cy.intercept(
            "PUT",
            "**/api/reports/notificaciones/usuario/**/leido"
        ).as("marcarLeida");

        cy.contains("tr", "Acreditacion o licencia")
            .first()
            .within(() => {
                cy.contains("No leida").should("be.visible");
                cy.contains("button", "Marcar leida")
                    .should("be.enabled")
                    .click();
            });

        cy.wait("@marcarLeida")
            .its("response.statusCode")
            .should("be.oneOf", [200, 204]);

        cy.contains("tr", "Acreditacion o licencia")
            .first()
            .within(() => {
                cy.contains("Leida").should("be.visible");
            });
    });
});