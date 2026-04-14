/// <reference types="cypress" />

describe("Reporte participantes - descargar reporte", () => {
    const user = "derby.munoz@ucr.ac.cr";
    const pass = "12345678";

    beforeEach(() => {
        cy.intercept("POST", "http://localhost:8080/auth/login").as("login");

        // Intercept genérico para cualquier descarga de reportes (ajusta si conoces el endpoint exacto)
        cy.intercept("GET", "**/api/reports/**").as("downloadReport");
        cy.intercept("POST", "**/api/reports/**").as("downloadReportPost");

        cy.visit("http://localhost:5173/");

        cy.get('input[name="username"]', { timeout: 10000 }).should("be.visible").clear().type(user);
        cy.get('input[name="password"]').should("be.visible").clear().type(pass);
        cy.get('button[type="submit"]').click();

        cy.wait("@login").its("response.statusCode").should("eq", 200);

        cy.visit("http://localhost:5173/reporte-participantes");
        cy.url().should("include", "/reporte-participantes");
    });

    it("selecciona un proyecto y descarga el reporte", () => {
        // 1) Seleccionar proyecto
        // Caso A: el selector es un react-select (muy común en tu proyecto)
        cy.get('input[id*="react-select"][id$="-input"]', { timeout: 10000 })
            .first()
            .click({ force: true });

        // Selecciona la primera opción disponible
        cy.get('[id*="-option-"], .buscador__option', { timeout: 10000 })
            .first()
            .click({ force: true });

        // 2) Click en "Descargar reporte"
        cy.contains("button", /descargar reporte/i, { timeout: 10000 })
            .should("be.visible")
            .click({ force: true });

        // 3) Validar que se disparó una descarga (GET o POST según implementación)
        cy.wait(["@downloadReport", "@downloadReportPost"], { timeout: 20000 })
            .then((interceptions) => {
                // Cypress puede devolver uno u otro dependiendo de cuál se ejecutó
                const hit = interceptions.find(Boolean);
                expect(hit.response.statusCode).to.be.oneOf([200, 201]);
            });
    });
});