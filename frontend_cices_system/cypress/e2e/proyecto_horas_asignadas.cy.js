describe("ProyectoHorasAsignadas", () => {
    beforeEach(() => {
        cy.intercept("GET", "**/api/proyectos/1/horas-asignadas", {
            statusCode: 200,
            body: {
                proyectoNombre: "Proyecto CICES",
                totalHorasAsignadas: 80,
                totalHorasDisponibles: 20,
                investigadores: [
                    {
                        idInvestigador: 1,
                        nombreCompleto: "Alejandro Alvarez",
                        tipoHoras: "Carga académica",
                        horasMesAsignadas: 10,
                        mesesTotales: 6
                    },
                    {
                        idInvestigador: 2,
                        nombreCompleto: "Maria Gomez",
                        tipoHoras: "Asistente",
                        horasMesAsignadas: 5,
                        mesesTotales: 4
                    }
                ]
            }
        }).as("getHorasAsignadas");
    });

    it("HU_debeMostrarResumenHorasAsignadasProyecto", () => {
        cy.visit("http://localhost:5173/proyectos/1/horas-asignadas", {
            onBeforeLoad(win) {
                win.localStorage.setItem("token", "fake-token");
            }
        });

        cy.wait("@getHorasAsignadas");

        cy.contains("Horas asignadas — Proyecto Proyecto CICES").should("be.visible");

        cy.contains("Total de horas asignadas").should("be.visible");
        cy.contains("80").should("be.visible");

        cy.contains("Total de horas disponibles").should("be.visible");
        cy.contains("20").should("be.visible");

        cy.contains("Investigadores totales").should("be.visible");
        cy.contains("2").should("be.visible");

        cy.contains("Alejandro Alvarez").should("be.visible");
        cy.contains("Maria Gomez").should("be.visible");
        cy.contains("Carga académica").should("be.visible");
        cy.contains("Asistente").should("be.visible");

        cy.contains("60").should("be.visible"); // 10 * 6
        cy.contains("20").should("be.visible"); // 5 * 4
    });

    it("HU_debeMostrarMensajeSiNoHayHorasAsignadas", () => {
        cy.intercept("GET", "**/api/proyectos/1/horas-asignadas", {
            statusCode: 200,
            body: {
                proyectoNombre: "Proyecto vacío",
                totalHorasAsignadas: 0,
                totalHorasDisponibles: 50,
                investigadores: []
            }
        }).as("getHorasVacias");

        cy.visit("http://localhost:5173/proyectos/1/horas-asignadas", {
            onBeforeLoad(win) {
                win.localStorage.setItem("token", "fake-token");
            }
        });

        cy.wait("@getHorasVacias");

        cy.contains("Horas asignadas — Proyecto Proyecto vacío").should("be.visible");
        cy.contains("No hay horas asignadas para este proyecto.").should("be.visible");
        cy.contains("0").should("be.visible");
        cy.contains("50").should("be.visible");
    });

    it("HU_debeMostrarErrorSiFallaEndpoint", () => {
        cy.intercept("GET", "**/api/proyectos/1/horas-asignadas", {
            statusCode: 500,
            body: {}
        }).as("getHorasError");

        cy.visit("http://localhost:5173/proyectos/1/horas-asignadas", {
            onBeforeLoad(win) {
                win.localStorage.setItem("token", "fake-token");
            }
        });

        cy.wait("@getHorasError");

        cy.contains("Error:").should("be.visible");
        cy.contains("HTTP 500").should("be.visible");
        cy.contains("← Volver").should("be.visible");
    });

    it("HU_debeMostrarCargandoAntesDeResponder", () => {
        cy.intercept("GET", "**/api/proyectos/1/horas-asignadas", {
            statusCode: 200,
            delay: 1000,
            body: {
                proyectoNombre: "Proyecto CICES",
                totalHorasAsignadas: 80,
                totalHorasDisponibles: 20,
                investigadores: []
            }
        }).as("getHorasDelay");

        cy.visit("http://localhost:5173/proyectos/1/horas-asignadas", {
            onBeforeLoad(win) {
                win.localStorage.setItem("token", "fake-token");
            }
        });

        cy.contains("Cargando…").should("be.visible");
        cy.wait("@getHorasDelay");
        cy.contains("Horas asignadas — Proyecto Proyecto CICES").should("be.visible");
    });

});