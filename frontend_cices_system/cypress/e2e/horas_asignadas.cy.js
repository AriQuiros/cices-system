describe("HorasAsignadas", () => {
    const seleccionarProyecto = () => {
        cy.get("input").first().clear().type("TEST001{enter}");

        cy.wait("@getPresupuestos");
        cy.wait("@getInvestigadores");
    };

    beforeEach(() => {
        cy.intercept("GET", "**/api/reports/proyectos/codigo-nombre-fechas", {
            statusCode: 200,
            body: [
                {
                    codigoProyecto: "TEST001",
                    nombreProyecto: "Proyecto de Prueba CICES",
                    fechaInicio: "2025-01-01",
                    fechaFinalizacion: "2025-12-31",
                },
            ],
        }).as("getBuscadorProyectos");

        cy.intercept("GET", "**/api/reportes/presupuesto-horas/TEST001", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    categoria: "Horas Becarias",
                    descripcion: "Desc",
                    fechaAsignacion: "2025-12-20",
                    cantidadHoras: 30,
                    cantidadMeses: 5,
                    horas: [
                        {
                            investigador: { id: 2 },
                            cantidadHorasMes: 15,
                            cantidadMeses: 4,
                        },
                    ],
                },
            ],
        }).as("getPresupuestos");

        cy.intercept("GET", "**/api/reportes/investigadorProyecto/TEST001", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    identificacionInvestigador: "110270978",
                    nombreInvestigador: "Vivian Vilchez Barboza",
                    rolProyecto: { nombreRolProyecto: "PRINCIPAL" },
                    fechaInicio: "2025-01-01",
                    fechaFin: "2025-12-31",
                },
                {
                    id: 2,
                    identificacionInvestigador: "118910801",
                    nombreInvestigador: "Alejandro Investigador",
                    rolProyecto: { nombreRolProyecto: "COLABORADOR" },
                    fechaInicio: "2025-01-01",
                    fechaFin: "2025-12-31",
                },
                {
                    id: 3,
                    identificacionInvestigador: "108660046",
                    nombreInvestigador: "Ingrid Gomez Duarte",
                    rolProyecto: { nombreRolProyecto: "COLABORADOR" },
                    fechaInicio: "2025-01-01",
                    fechaFin: "2025-12-31",
                },
            ],
        }).as("getInvestigadores");

        cy.visit("http://localhost:5173/horas-asignadas");
        cy.wait("@getBuscadorProyectos");
    });

    it("debeMostrarPantallaDeConsulta", () => {
        cy.contains("Consulta de presupuestos").should("be.visible");
    });

    it("debeCargarDatosAlSeleccionarProyecto", () => {
        seleccionarProyecto();

        cy.contains("Informacion del presupuesto - horas").should("be.visible");
        cy.contains("Horas Becarias").should("be.visible");
        cy.contains("Desc").should("be.visible");
    });

    it("debeMostrarResumenDelPresupuesto", () => {
        seleccionarProyecto();

        cy.contains("Fecha asignacion:").should("be.visible");
        cy.contains("2025-12-20").should("be.visible");

        cy.contains("Horas por mes:").should("be.visible");
        cy.contains("30").should("exist");

        cy.contains("Meses:").should("be.visible");
        cy.contains("5").should("exist");

        cy.contains("Total horas presupuesto:").should("be.visible");
        cy.contains("150").should("be.visible");

        cy.contains("Horas asignadas:").should("be.visible");
        cy.contains("60").should("exist");

        cy.contains("Horas restantes:").should("be.visible");
        cy.contains("90").should("be.visible");
    });

    it("debeMostrarTablaDeInvestigadores", () => {
        seleccionarProyecto();

        cy.contains("Horas asignadas a investigadores").should("be.visible");
        cy.contains("Vivian Vilchez Barboza").should("be.visible");
        cy.contains("Alejandro Investigador").should("be.visible");
        cy.contains("Ingrid Gomez Duarte").should("be.visible");
        cy.contains("PRINCIPAL").should("be.visible");
        cy.contains("COLABORADOR").should("be.visible");
    });

    it("debeMostrarCerosParaInvestigadoresSinHoras", () => {
        seleccionarProyecto();

        cy.contains("Ingrid Gomez Duarte")
            .closest("tr")
            .within(() => {
                cy.contains("0").should("exist");
            });
    });

    it("debePermitirOrdenarPorFecha", () => {
        seleccionarProyecto();

        cy.get("select").eq(0).select("Más antiguo");
        cy.get("select").eq(0).should("have.value", "antiguo");
    });

    it("debePermitirOrdenarPorMonto", () => {
        seleccionarProyecto();

        cy.get("select").eq(1).select("Mayor a menor");
        cy.get("select").eq(1).should("have.value", "mayor");
    });

    it("debePermitirOrdenarPorHorasAsignadas", () => {
        seleccionarProyecto();

        cy.get("select").eq(2).select("Mayor a menor");
        cy.get("select").eq(2).should("have.value", "mayor");
    });

    it("debeMostrarErrorSiFallaLaCarga", () => {
        cy.intercept("GET", "**/api/reportes/presupuesto-horas/TEST001", {
            statusCode: 500,
            body: {},
        }).as("getPresupuestosError");

        cy.get("input")
            .first()
            .should("be.visible")
            .clear()
            .type("TEST001{enter}");

        cy.wait("@getPresupuestosError");
        cy.contains("Error cargando datos").should("exist");
    });
});