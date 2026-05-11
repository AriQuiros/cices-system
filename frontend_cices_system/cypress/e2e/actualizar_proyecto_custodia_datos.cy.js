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

const authInvestigadorPrincipal = () => {
    const { token, exp } = crearJwtFalso();

    return {
        user: {
            id: 11,
            nombre: "Investigador Principal Cypress",
            username: "investigador.principal@ucr.ac.cr",
            roles: ["INVESTIGADOR"],
        },
        token,
        exp,
    };
};

const proyectoAsociado = {
    codigoProyecto: "CICES-CUST-001",
    nombreProyecto: "Proyecto custodia de datos Cypress",
    fechaInicio: "2026-01-01",
    fechaFinalizacion: "2026-12-31",
};

const proyectoCompleto = {
    id: 1001,
    codigoProyecto: "CICES-CUST-001",
    nombreProyecto: "Proyecto custodia de datos Cypress",
    descripcion: "Proyecto usado para pruebas funcionales de actualización.",
    objetivoGeneral: "Mantener actualizada la información del proyecto.",
    fechaInicio: "2026-01-01",
    fechaFinalizacion: "2026-12-31",
    lineaInvestigacion: "Salud Pública",
    detalles: "Notas iniciales del proyecto.",
    tipoProyecto: {
        id: 1,
        valor: "INVESTIGACION",
        despliegue: "Investigación",
    },
    estado: {
        id: 20,
        valor: "EN_EJECUCION",
        despliegue: "En ejecución",
    },
    objetivosEspecificos: [
        {
            id: 301,
            categoria: "",
            descripcion: "Objetivo específico inicial.",
            metas: [
                {
                    id: 401,
                    tipo: {
                        id: 10,
                        valor: "CUANTITATIVA",
                        despliegue: "Cuantitativa",
                    },
                    cantidad: 10,
                    descripcion: "Meta cuantitativa inicial.",
                    indicadores: [
                        {
                            id: 501,
                            descripcion: "Indicador cuantitativo inicial.",
                        },
                    ],
                },
                {
                    id: 402,
                    tipo: {
                        id: 11,
                        valor: "CUALITATIVA",
                        despliegue: "Cualitativa",
                    },
                    cantidad: 1,
                    descripcion: "Meta cualitativa inicial.",
                    indicadores: [
                        {
                            id: 502,
                            descripcion: "Indicador cualitativo inicial.",
                        },
                    ],
                },
            ],
        },
    ],
    entidadesVinculadas: [
        {
            id: 1,
            nombre: "Universidad de Costa Rica",
            tipo: {
                id: 90,
                valor: "INSTITUCION",
                despliegue: "Institución",
            },
        },
        {
            id: 2,
            nombre: "CICES",
            tipo: {
                id: 91,
                valor: "UNIDAD",
                despliegue: "Unidad",
            },
        },
        {
            id: 3,
            nombre: "Hospital San Juan",
            tipo: {
                id: 92,
                valor: "SITIO",
                despliegue: "Sitio",
            },
        },
    ],
    documentos: [
        {
            id: 701,
            nombreDocumento: "documento-existente.pdf",
            url: "https://cices.test/documento-existente.pdf",
        },
    ],
    presentacionesInformes: [
        {
            id: 801,
            tipoInforme: {
                id: 30,
                valor: "PARCIAL",
                despliegue: "Parcial",
            },
            fechaPresentacion: "2026-06-30",
            estado: {
                id: 40,
                valor: "PENDIENTE",
                despliegue: "Pendiente",
            },
        },
    ],
    investigadoresVinculados: [],
    presupuestos: [],
};

const catalogos = {
    TIPO_PROYECTO: [
        {
            id: 1,
            valor: "INVESTIGACION",
            despliegue: "Investigación",
        },
    ],
    TIPO_META: [
        {
            id: 10,
            valor: "CUANTITATIVA",
            despliegue: "Cuantitativa",
        },
        {
            id: 11,
            valor: "CUALITATIVA",
            despliegue: "Cualitativa",
        },
    ],
    TIPO_INFORME: [
        {
            id: 30,
            valor: "PARCIAL",
            despliegue: "Parcial",
        },
        {
            id: 31,
            valor: "FINAL",
            despliegue: "Final",
        },
    ],
};

const entidades = [
    {
        id: 1,
        nombre: "Universidad de Costa Rica",
        tipo: {
            id: 90,
            valor: "INSTITUCION",
            despliegue: "Institución",
        },
    },
    {
        id: 2,
        nombre: "CICES",
        tipo: {
            id: 91,
            valor: "UNIDAD",
            despliegue: "Unidad",
        },
    },
    {
        id: 3,
        nombre: "Hospital San Juan",
        tipo: {
            id: 92,
            valor: "SITIO",
            despliegue: "Sitio",
        },
    },
];

const iniciarSesionYVisitar = () => {
    cy.visit("/actualizar-proyecto", {
        onBeforeLoad(win) {
            const auth = authInvestigadorPrincipal();

            win.sessionStorage.setItem("auth", JSON.stringify(auth));
            win.localStorage.setItem("auth", JSON.stringify(auth));
        },
    });
};

const seleccionarProyectoAsociado = () => {
    cy.contains("Buscar proyecto", { timeout: 10000 }).should("be.visible");

    cy.get(".buscador-select input")
        .should("be.visible")
        .click({ force: true })
        .type("CICES-CUST-001", { force: true });

    cy.contains(
        ".buscador__option",
        "CICES-CUST-001 - Proyecto custodia de datos Cypress"
    ).click({ force: true });

    cy.wait("@obtenerProyectoCompleto");

    cy.contains("Editar Proyecto", { timeout: 10000 }).should("be.visible");
    cy.contains("Objetivos Específicos").should("be.visible");
};

describe("HU - Custodiar datos en proyecto asociado desde actualizar proyecto", () => {
    beforeEach(() => {
        cy.intercept(
            "GET",
            `${API}/api/reports/proyectos/investigador/principal`,
            {
                statusCode: 200,
                body: [proyectoAsociado],
            }
        ).as("listarProyectosPrincipal");

        cy.intercept(
            "GET",
            `${API}/api/reports/proyectos/investigador`,
            {
                statusCode: 500,
                body: "No debería consultar proyectos no principales",
            }
        ).as("listarProyectosInvestigadorNoPrincipal");

        cy.intercept("GET", `${API}/api/proyectos/CICES-CUST-001`, {
            statusCode: 200,
            body: proyectoCompleto,
        }).as("obtenerProyectoCompleto");

        cy.intercept("POST", `${API}/api/catalogos/tipos`, (req) => {
            const respuesta = {};

            req.body.forEach((tipo) => {
                respuesta[tipo] = catalogos[tipo] || [];
            });

            req.reply({
                statusCode: 200,
                body: respuesta,
            });
        }).as("catalogos");

        cy.intercept("GET", `${API}/api/proyectos/lineas-investigacion`, {
            statusCode: 200,
            body: ["Salud Pública", "Enfermería", "Epidemiología"],
        }).as("lineasInvestigacion");

        cy.intercept("GET", `${API}/api/entidades`, {
            statusCode: 200,
            body: entidades,
        }).as("entidades");
    });

    it("muestra únicamente proyectos asociados al investigador principal", () => {
        iniciarSesionYVisitar();

        cy.wait("@listarProyectosPrincipal");

        cy.contains("Buscar proyecto").should("be.visible");

        cy.get(".buscador-select input")
            .click({ force: true })
            .type("CICES", { force: true });

        cy.contains(
            ".buscador__option",
            "CICES-CUST-001 - Proyecto custodia de datos Cypress"
        ).should("be.visible");

        cy.contains("CICES-AJENO-999").should("not.exist");

        cy.get("@listarProyectosInvestigadorNoPrincipal.all").should(
            "have.length",
            0
        );
    });

    it("permite ingresar datos cuantitativos, cualitativos y guardar cambios", () => {
        cy.intercept("POST", `${API}/api/proyectos/registro`, (req) => {
            expect(req.headers.authorization).to.match(/^Bearer\s.+/);

            req.reply({
                statusCode: 200,
                body: {
                    mensaje: "Proyecto actualizado correctamente",
                },
            });
        }).as("guardarProyecto");

        iniciarSesionYVisitar();

        cy.wait("@listarProyectosPrincipal");

        seleccionarProyectoAsociado();

        cy.get(".objetivo-especifico-block").first().within(() => {
            cy.get('textarea[placeholder="Descripción objetivo 1"]')
                .clear()
                .type(
                    "Objetivo específico actualizado con datos cuantitativos y cualitativos."
                );

            cy.get(".meta-objetivo-block").eq(0).within(() => {
                cy.get("select.input-field").select("CUANTITATIVA");
                cy.get('input[type="number"]').clear().type("25");

                cy.get('textarea[placeholder="Descripción meta 1 (Objetivo 1)"]')
                    .clear()
                    .type("Se registran 25 encuestas estructuradas.");

                cy.get(
                    'input[placeholder="Descripción indicador 1  (Meta 1 - Objetivo 1)"]'
                )
                    .clear()
                    .type("Cantidad de encuestas registradas en el sistema.");
            });

            cy.get(".meta-objetivo-block").eq(1).within(() => {
                cy.get("select.input-field").select("CUALITATIVA");

                cy.get('textarea[placeholder="Descripción meta 2 (Objetivo 1)"]')
                    .clear()
                    .type("Se documentan observaciones cualitativas del proyecto.");

                cy.get(
                    'input[placeholder="Descripción indicador 1  (Meta 2 - Objetivo 1)"]'
                )
                    .clear()
                    .type("Descripción de hallazgos cualitativos documentados.");
            });
        });

        cy.contains("legend", "Fechas de Informes")
            .parent()
            .within(() => {
                cy.get("select.input-field").first().select("FINAL");
                cy.get('input[type="date"]').first().clear().type("2026-11-15");
            });

        cy.get('textarea[name="detallesProyecto"]')
            .clear()
            .type(
                "Notas internas de custodia: se agregan datos estructurados y descripción libre."
            );

        cy.contains("button", "Actualizar Proyecto").click();

        cy.get(".swal2-popup")
            .should("be.visible")
            .and("contain.text", "Confirmar cambios")
            .and("contain.text", "¿Desea guardar los cambios?");

        cy.get(".swal2-confirm").click();

        cy.wait("@guardarProyecto");

        cy.contains("Proyecto actualizado correctamente", {
            timeout: 10000,
        }).should("be.visible");

        cy.get('textarea[placeholder="Descripción objetivo 1"]').should(
            "have.value",
            "Objetivo específico actualizado con datos cuantitativos y cualitativos."
        );

        cy.get('textarea[name="detallesProyecto"]').should(
            "contain.value",
            "Notas internas de custodia"
        );
    });

    it("no guarda cambios si hay datos obligatorios incompletos", () => {
        cy.intercept("POST", `${API}/api/proyectos/registro`, {
            statusCode: 200,
            body: {},
        }).as("guardarProyecto");

        iniciarSesionYVisitar();

        cy.wait("@listarProyectosPrincipal");

        seleccionarProyectoAsociado();

        cy.get('textarea[placeholder="Descripción objetivo 1"]')
            .clear()
            .then(($textarea) => {
                expect($textarea[0].checkValidity()).to.eq(false);
            });

        cy.contains("button", "Actualizar Proyecto").click();

        cy.get("@guardarProyecto.all").should("have.length", 0);
        cy.get(".swal2-popup").should("not.exist");
    });

    it("bloquea el guardado cuando el proyecto no está permitido para el investigador", () => {
        cy.intercept("POST", `${API}/api/proyectos/registro`, (req) => {
            req.reply({
                statusCode: 403,
                body: {
                    error: "No tiene permisos para custodiar datos en este proyecto",
                },
            });
        }).as("guardarSinPermiso");

        iniciarSesionYVisitar();

        cy.wait("@listarProyectosPrincipal");

        seleccionarProyectoAsociado();

        cy.get(".objetivo-especifico-block").first().within(() => {
            cy.get('textarea[placeholder="Descripción objetivo 1"]')
                .clear()
                .type("Intento de actualización sin permisos.");
        });

        cy.contains("button", "Actualizar Proyecto").click();

        cy.get(".swal2-confirm").click();

        cy.wait("@guardarSinPermiso");

        cy.contains(
            /No tiene permisos para custodiar datos en este proyecto|Error al procesar el proyecto/i,
            { timeout: 10000 }
        ).should("be.visible");
    });
});