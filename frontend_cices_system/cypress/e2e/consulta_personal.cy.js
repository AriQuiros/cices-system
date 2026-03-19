describe("FUNCIONAL - HU-010 y HU-012 Consulta Personal", () => {
    beforeEach(() => {
        cy.intercept(
            {
                method: "GET",
                url: "**/api/reports/personas/empleados*",
            },
            {
                statusCode: 200,
                body: [
                    {
                        nombreCompleto: "Alejandro Alvarez",
                        identificacion: "1",
                        pais: "Costa Rica",
                        correo: "alejandro@gmail.com",
                        numeroTelefono: "88888888",
                        gradoAcademico: "Licenciatura",
                        roles: ["ASISTENTE"],
                    },
                    {
                        nombreCompleto: "Maria Gomez",
                        identificacion: "2",
                        pais: "Costa Rica",
                        correo: "maria@gmail.com",
                        numeroTelefono: "77777777",
                        gradoAcademico: "Maestría",
                        roles: ["ADMINISTRATIVO"],
                    },
                    {
                        nombreCompleto: "Alejandra Rojas",
                        identificacion: "3",
                        pais: "Costa Rica",
                        correo: "alejandra@gmail.com",
                        numeroTelefono: "66666666",
                        gradoAcademico: "Doctorado",
                        roles: ["ASISTENTE"],
                    },
                ],
            }
        ).as("getPersonal");

        cy.intercept(
            {
                method: "GET",
                url: "**/api/catalogos/grados_academicos*",
            },
            {
                statusCode: 200,
                body: ["Licenciatura", "Maestría", "Doctorado"],
            }
        ).as("getGrados");

        cy.visit("http://localhost:5173/consulta-personal");
    });

    it("HU10_debeMostrarListaDePersonal", () => {
        cy.contains("Alejandro Alvarez", { timeout: 10000 }).should("be.visible");
        cy.contains("Maria Gomez").should("be.visible");
        cy.contains("Alejandra Rojas").should("be.visible");
    });

    it("HU10_debeMostrarDatosYRoles", () => {
        cy.contains("alejandro@gmail.com", { timeout: 10000 }).should("be.visible");
        cy.contains("88888888").should("be.visible");
        cy.contains("Licenciatura").should("be.visible");
        cy.contains("ASISTENTE").should("be.visible");
        cy.contains("ADMINISTRATIVO").should("be.visible");
    });

    it("HU12_debeFiltrarPorNombre", () => {
        cy.get('input[placeholder="Buscar por ..."]', { timeout: 10000 }).type("Maria");

        cy.contains("Maria Gomez").should("be.visible");
        cy.contains("Alejandro Alvarez").should("not.exist");
        cy.contains("Alejandra Rojas").should("not.exist");
    });

    it("HU12_debeFiltrarPorRol", () => {
        cy.get(".lp-filter-select", { timeout: 10000 }).select("ADMINISTRATIVO");

        cy.contains("Maria Gomez").should("be.visible");
        cy.contains("Alejandro Alvarez").should("not.exist");
        cy.contains("Alejandra Rojas").should("not.exist");
    });

    it("HU12_debeMostrarMensajeSinResultados", () => {
        cy.get('input[placeholder="Buscar por ..."]', { timeout: 10000 }).type("Pedro");

        cy.contains("No se encontraron resultados").should("be.visible");
    });
});