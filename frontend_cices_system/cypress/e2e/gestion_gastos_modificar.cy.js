/// <reference types="cypress" />

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

const proyectoPrincipal = {
    codigoProyecto: "CICES-GT-001",
    nombreProyecto: "Proyecto de gastos Cypress",
    fechaInicio: "2026-01-01",
    fechaFinalizacion: "2026-12-31",
};

const presupuestoInicial = [
    {
        id: 501,
        categoria: "Materiales",
        descripcion: "Compra de materiales",
        fechaAsignacion: "2026-01-10",
        monto: 100000,
        gastos: [
            {
                id: 9001,
                idPresupuesto: 501,
                monto: 15000,
                fechaGasto: "2026-04-10",
                descripcion: "Compra de reactivos",
            },
        ],
    },
];

const clonar = (obj) => JSON.parse(JSON.stringify(obj));

const seleccionarProyectoYPresupuesto = () => {
    cy.contains("Buscar proyecto").should("be.visible");

    cy.get(".buscador-select input")
        .should("be.visible")
        .click({ force: true })
        .type("CICES-GT-001", { force: true });

    cy.contains(
        ".buscador__option",
        "CICES-GT-001 - Proyecto de gastos Cypress"
    ).click({ force: true });

    cy.contains("Materiales - Compra de materiales", { timeout: 10000 }).should(
        "be.visible"
    );

    cy.get("select.gestion-gastos-select").select("501");

    cy.contains("Gastos registrados").should("be.visible");
    cy.contains("Compra de reactivos").should("be.visible");
};

const editarGastoRegistrado = () => {
    cy.contains("tr", "Compra de reactivos").within(() => {
        cy.contains("button", "Editar").click();
    });

    cy.contains("button", "Actualizar gasto").should("be.visible");
};

describe("HU - Modificar gastos registrados en proyecto", () => {
    let presupuestosActuales;

    beforeEach(() => {
        presupuestosActuales = clonar(presupuestoInicial);

        cy.intercept("GET", "**/api/reports/proyectos/investigador/principal", {
            statusCode: 200,
            body: [proyectoPrincipal],
        }).as("listarProyectosPrincipal");

        cy.intercept("GET", "**/api/reportes/gastos/CICES-GT-001", (req) => {
            req.reply({
                statusCode: 200,
                body: presupuestosActuales,
            });
        }).as("obtenerGastosProyecto");

        cy.intercept("GET", "**/api/gastos/CICES-GT-001", (req) => {
            req.reply({
                statusCode: 200,
                body: presupuestosActuales,
            });
        }).as("obtenerGastosProyectoAlterno");

        cy.visit("/gestion-gastos", {
            onBeforeLoad(win) {
                const auth = authInvestigadorPrincipal();

                win.sessionStorage.setItem("auth", JSON.stringify(auth));
                win.localStorage.setItem("auth", JSON.stringify(auth));
            },
        });

        cy.wait("@listarProyectosPrincipal");
    });

    it("permite al investigador principal modificar un gasto asociado a su proyecto", () => {
        cy.intercept("PUT", "**/api/gastos/actualizar", (req) => {
            expect(req.headers.authorization).to.match(/^Bearer\s.+/);

            expect(req.body).to.deep.eq({
                id: 9001,
                idPresupuesto: 501,
                monto: 18000,
                descripcion: "Compra de reactivos corregida",
                fechaGasto: "2026-04-12",
            });

            presupuestosActuales = [
                {
                    ...presupuestosActuales[0],
                    gastos: [
                        {
                            id: 9001,
                            idPresupuesto: 501,
                            monto: 18000,
                            fechaGasto: "2026-04-12",
                            descripcion: "Compra de reactivos corregida",
                        },
                    ],
                },
            ];

            req.reply({
                statusCode: 200,
                body: presupuestosActuales[0].gastos[0],
            });
        }).as("actualizarGasto");

        cy.contains("h2", "Gestion de gastos").should("be.visible");

        seleccionarProyectoYPresupuesto();
        editarGastoRegistrado();

        cy.get('input[name="monto-0"]').clear().type("18000");
        cy.get('input[name="fecha-0"]').clear().type("2026-04-12");
        cy.get('input[name="descripcion-0"]')
            .clear()
            .type("Compra de reactivos corregida");

        cy.contains("button", "Actualizar gasto").click();

        cy.get(".swal2-popup")
            .should("be.visible")
            .and("contain.text", "Confirmar cambios")
            .and("contain.text", "¿Desea guardar los cambios?");

        cy.get(".swal2-confirm").click();

        cy.wait("@actualizarGasto");

        cy.contains("Gasto actualizado").should("be.visible");

        cy.contains("tr", "Compra de reactivos corregida", {
            timeout: 10000,
        }).within(() => {
            cy.contains("2026-04-12").should("be.visible");
            cy.contains(/18\.?000|18,000|18000/).should("be.visible");
        });

        cy.contains(/^Compra de reactivos$/).should("not.exist");
    });

    it("no guarda cambios inválidos si hay campos requeridos incompletos", () => {
        cy.intercept("PUT", "**/api/gastos/actualizar", {
            statusCode: 200,
            body: {},
        }).as("actualizarGasto");

        seleccionarProyectoYPresupuesto();
        editarGastoRegistrado();

        cy.get('input[name="descripcion-0"]').clear().blur();

        cy.contains("No puede ser vacío").should("be.visible");

        cy.contains("button", "Actualizar gasto").click();

        cy.get("@actualizarGasto.all").should("have.length", 0);

        cy.contains("tr", "Compra de reactivos").within(() => {
            cy.contains("15000").should("be.visible");
            cy.contains("2026-04-10").should("be.visible");
        });
    });

    it("bloquea la modificación si el usuario no tiene permisos sobre el gasto", () => {
        cy.intercept("PUT", "**/api/gastos/actualizar", (req) => {
            req.reply({
                statusCode: 403,
                body: "No tiene permisos para modificar este gasto",
            });
        }).as("actualizarGastoSinPermiso");

        seleccionarProyectoYPresupuesto();
        editarGastoRegistrado();

        cy.get('input[name="monto-0"]').clear().type("22000");
        cy.get('input[name="fecha-0"]').clear().type("2026-04-15");
        cy.get('input[name="descripcion-0"]')
            .clear()
            .type("Intento de modificación sin permiso");

        cy.contains("button", "Actualizar gasto").click();

        cy.get(".swal2-confirm").click();

        cy.wait("@actualizarGastoSinPermiso");

        cy.contains(/Error guardando gasto|No tiene permisos/i).should("be.visible");

        cy.contains("tr", "Compra de reactivos").within(() => {
            cy.contains("15000").should("be.visible");
            cy.contains("2026-04-10").should("be.visible");
        });

        cy.contains("Intento de modificación sin permiso").should("not.exist");
    });
});