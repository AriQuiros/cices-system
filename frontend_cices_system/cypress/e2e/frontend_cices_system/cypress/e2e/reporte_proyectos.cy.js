/// <reference types="cypress" />

const API = Cypress.env("apiUrl") || "http://localhost:8080";

const crearJwtFalso = () => {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;
    const payload = btoa(JSON.stringify({ exp }));

    return {
        token: `x.${payload}.y`,
        exp,
    };
};

const authDirector = () => {
    const { token, exp } = crearJwtFalso();

    return {
        user: {
            id: 1,
            nombre: "Director Cypress",
            correo: "director.cypress@ucr.ac.cr",
            roles: ["DIRECTOR"],
        },
        token,
        exp,
    };
};

const proyectosPagina1 = {
    content: [
        {
            codigoProyecto: "CICES-001",
            nombreProyecto: "Sistema de gestión de proyectos CICES",
            tipoProyecto: "Investigación",
            lineaInvestigacion: "Salud Pública",
            estado: "En ejecución",
            fechaInicio: "2026-01-15",
            fechaFinalizacion: "2026-12-15",
        },
        {
            codigoProyecto: "CICES-002",
            nombreProyecto: "Prevención comunitaria",
            tipoProyecto: "Acción social",
            lineaInvestigacion: "Enfermería",
            estado: "Formulado",
            fechaInicio: "2026-02-01",
            fechaFinalizacion: "2026-11-30",
        },
    ],
    totalElements: 10,
    totalPages: 2,
    number: 0,
    size: 8,
};

const proyectosPagina2 = {
    content: [
        {
            codigoProyecto: "CICES-009",
            nombreProyecto: "Seguimiento epidemiológico regional",
            tipoProyecto: "Investigación",
            lineaInvestigacion: "Epidemiología",
            estado: "Finalizado",
            fechaInicio: "2025-03-10",
            fechaFinalizacion: "2025-12-10",
        },
    ],
    totalElements: 10,
    totalPages: 2,
    number: 1,
    size: 8,
};

const proyectosFiltrados = {
    content: [
        {
            codigoProyecto: "CICES-777",
            nombreProyecto: "Oncología comunitaria",
            tipoProyecto: "Investigación",
            lineaInvestigacion: "Salud Pública",
            estado: "En ejecución",
            fechaInicio: "2026-05-01",
            fechaFinalizacion: "2026-12-20",
        },
    ],
    totalElements: 1,
    totalPages: 1,
    number: 0,
    size: 8,
};

describe("Reporte de proyectos", () => {
    beforeEach(() => {
        cy.intercept("POST", `${API}/api/catalogos/tipos`, (req) => {
            expect(req.body).to.deep.eq(["ESTADO_PROYECTO", "TIPO_PROYECTO"]);

            req.reply({
                statusCode: 200,
                body: {
                    ESTADO_PROYECTO: [
                        { id: "FORMULADO", despliegue: "Formulado" },
                        { id: "EJECUCION", despliegue: "En ejecución" },
                        { id: "FINALIZADO", despliegue: "Finalizado" },
                    ],
                    TIPO_PROYECTO: [
                        { id: "INVESTIGACION", despliegue: "Investigación" },
                        { id: "ACCION_SOCIAL", despliegue: "Acción social" },
                    ],
                },
            });
        }).as("catalogos");

        cy.intercept("GET", `${API}/api/proyectos/lineas-investigacion`, {
            statusCode: 200,
            body: ["Salud Pública", "Enfermería", "Epidemiología"],
        }).as("lineas");

        cy.intercept("GET", `${API}/api/proyectos/listar*`, (req) => {
            const url = new URL(req.url);
            const texto = url.searchParams.get("texto") || "";
            const page = Number(url.searchParams.get("page") || 0);
            const estado = url.searchParams.get("estado") || "";

            if (texto.toLowerCase() === "oncologia") {
                req.alias = "buscarOncologia";
                req.reply({ statusCode: 200, body: proyectosFiltrados });
                return;
            }

            if (estado === "EJECUCION") {
                req.alias = "filtrarEstado";
                req.reply({ statusCode: 200, body: proyectosFiltrados });
                return;
            }

            if (page === 1) {
                req.alias = "listarPagina2";
                req.reply({ statusCode: 200, body: proyectosPagina2 });
                return;
            }

            req.reply({ statusCode: 200, body: proyectosPagina1 });
        }).as("listarProyectos");

        cy.intercept("POST", `${API}/api/reports/proyectos/exportar*`, (req) => {
            req.reply({
                statusCode: 200,
                headers: {
                    "content-type": "application/pdf",
                    "content-disposition": "attachment; filename=reporte_proyectos.pdf",
                },
                body: "reporte falso generado por Cypress",
            });
        }).as("exportarReporte");

        cy.visit("/reporte-proyectos", {
            onBeforeLoad(win) {
                const auth = authDirector();

                win.sessionStorage.setItem("auth", JSON.stringify(auth));
                win.localStorage.setItem("auth", JSON.stringify(auth));
            },
        });

        cy.wait("@catalogos");
        cy.wait("@lineas");
        cy.wait("@listarProyectos");
    });

    it("muestra el reporte de proyectos con listado, total y paginación", () => {
        cy.url().should("include", "/reporte-proyectos");
        cy.contains("h2", "Reportes de proyectos").should("be.visible");

        cy.contains("Total de proyectos: 10").should("be.visible");
        cy.contains("CICES-001").should("be.visible");
        cy.contains("Sistema de gestión de proyectos CICES").should("be.visible");
        cy.contains("CICES-002").should("be.visible");

        cy.contains("Página 1 de 2").should("be.visible");
        cy.contains("button", "Anterior").should("be.disabled");
        cy.contains("button", "Siguiente").should("not.be.disabled");
    });

    it("filtra proyectos por texto y luego limpia los filtros", () => {
        cy.get("input.buscador")
            .should("be.visible")
            .clear()
            .type("oncologia");

        cy.wait("@buscarOncologia").then(({ request }) => {
            const url = new URL(request.url);
            expect(url.searchParams.get("texto")).to.eq("oncologia");
        });

        cy.contains("Total de proyectos: 1").should("be.visible");
        cy.contains("CICES-777").should("be.visible");
        cy.contains("Oncología comunitaria").should("be.visible");
        cy.contains("CICES-001").should("not.exist");

        cy.contains("button", "Limpiar").click();
        cy.wait("@listarProyectos");

        cy.contains("Total de proyectos: 10").should("be.visible");
        cy.contains("CICES-001").should("be.visible");
    });

    it("filtra proyectos por estado", () => {
        cy.get("select.filtro").first().select("EJECUCION");

        cy.wait("@filtrarEstado").then(({ request }) => {
            const url = new URL(request.url);
            expect(url.searchParams.get("estado")).to.eq("EJECUCION");
        });

        cy.contains("Total de proyectos: 1").should("be.visible");
        cy.contains("CICES-777").should("be.visible");
        cy.contains("En ejecución").should("be.visible");
    });

    it("navega a la página siguiente del listado", () => {
        cy.contains("button", "Siguiente").click();

        cy.wait("@listarPagina2").then(({ request }) => {
            const url = new URL(request.url);
            expect(url.searchParams.get("page")).to.eq("1");
            expect(url.searchParams.get("size")).to.eq("8");
        });

        cy.contains("Página 2 de 2").should("be.visible");
        cy.contains("CICES-009").should("be.visible");
        cy.contains("button", "Siguiente").should("be.disabled");
        cy.contains("button", "Anterior").should("not.be.disabled");
    });

    it("exporta el reporte en el formato seleccionado", () => {
        cy.get(".exportar-container select").select("xlsx");
        cy.contains("button", "Exportar").click();

        cy.wait("@exportarReporte").then(({ request, response }) => {
            const url = new URL(request.url);

            expect(url.searchParams.get("formato")).to.eq("xlsx");
            expect(request.headers.authorization).to.match(/^Bearer\s.+/);

            expect(request.body).to.include({
                texto: "",
                estado: "",
                institucion: "",
            });

            expect(response.statusCode).to.eq(200);
        });
    });
});