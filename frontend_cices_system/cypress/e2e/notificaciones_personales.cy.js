/// <reference types="cypress" />

const crearJwtFalso = () => {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;
    const payload = btoa(JSON.stringify({ exp }));

    return {
        token: `x.${payload}.y`,
        exp,
    };
};

const authInvestigador = () => {
    const { token, exp } = crearJwtFalso();

    return {
        user: {
            id: 25,
            nombre: "Investigador Cypress",
            username: "investigador.cypress@ucr.ac.cr",
            roles: ["INVESTIGADOR"],
        },
        token,
        exp,
    };
};

const notificacionesBase = [
    {
        idNotificacionUsuario: 101,
        tipo: "Informe",
        fechaCreacion: "2026-05-09",
        fechaObjetivo: "2026-05-10",
        leido: false,
        eliminado: false,
        detalle: [
            {
                label: "Codigo de proyecto",
                value: "CICES-NOT-001",
            },
            {
                label: "Numero de informe",
                value: "INF-01",
            },
            {
                label: "Fecha de presentacion",
                value: "2026-05-10",
            },
        ],
    },
    {
        idNotificacionUsuario: 102,
        tipo: "Acreditacion o licencia",
        fechaCreacion: "2026-04-01",
        fechaObjetivo: "2026-04-15",
        leido: true,
        eliminado: false,
        detalle: [
            {
                label: "Nombre de la acreditacion o licencia",
                value: "Licencia de investigación biomédica",
            },
            {
                label: "Fecha de expiracion",
                value: "2026-04-15",
            },
            {
                label: "Nombre del investigador",
                value: "Investigador Cypress",
            },
        ],
    },
    {
        idNotificacionUsuario: 103,
        tipo: "Permiso coordinador",
        fechaCreacion: "2026-06-01",
        fechaObjetivo: "2026-06-01",
        leido: false,
        eliminado: false,
        detalle: [
            {
                label: "Codigo de proyecto",
                value: "CICES-NOT-003",
            },
            {
                label: "Fecha de inicio",
                value: "2026-06-01",
            },
            {
                label: "Fecha fin",
                value: "2026-06-30",
            },
        ],
    },
];

const clonar = (obj) => JSON.parse(JSON.stringify(obj));

const visitarNotificaciones = () => {
    cy.visit("/notificaciones", {
        onBeforeLoad(win) {
            const auth = authInvestigador();

            win.sessionStorage.setItem("auth", JSON.stringify(auth));
            win.localStorage.setItem("auth", JSON.stringify(auth));
        },
    });

    cy.wait("@cargarNotificaciones");

    cy.get(".notificaciones-table", { timeout: 10000 }).should("be.visible");
};

describe("HU - Notificaciones personales del investigador", () => {
    let notificacionesActuales;

    beforeEach(() => {
        notificacionesActuales = clonar(notificacionesBase);

        cy.intercept(
            "GET",
            "**/api/reports/notificaciones/usuario/investigador.cypress%40ucr.ac.cr/detalladas",
            (req) => {
                expect(req.headers.authorization).to.match(/^Bearer\s.+/);

                req.reply({
                    statusCode: 200,
                    body: notificacionesActuales.filter((n) => n.eliminado !== true),
                });
            }
        ).as("cargarNotificaciones");

        cy.intercept(
            "GET",
            "**/api/reports/notificaciones/usuario/investigador.cypress%40ucr.ac.cr/esperar-cambios",
            {
                statusCode: 504,
                body: "",
            }
        ).as("esperarCambios");

        cy.intercept(
            "GET",
            "**/api/reports/notificaciones/usuario/otro.usuario%40ucr.ac.cr/detalladas",
            {
                statusCode: 500,
                body: "No debería consultar notificaciones de otro usuario",
            }
        ).as("consultaOtroUsuario");
    });

    it("muestra únicamente las notificaciones personales del usuario autenticado", () => {
        visitarNotificaciones();

        cy.contains("Informe").should("be.visible");
        cy.contains("Acreditacion o licencia").should("be.visible");
        cy.contains("Permiso coordinador").should("be.visible");

        cy.contains("CICES-NOT-001").should("be.visible");
        cy.contains("Licencia de investigación biomédica").should("be.visible");
        cy.contains("CICES-NOT-003").should("be.visible");

        cy.get("@consultaOtroUsuario.all").should("have.length", 0);
    });

    it("muestra las notificaciones ordenadas de la más reciente a la más antigua", () => {
        visitarNotificaciones();

        cy.get("#orden-fecha-notificacion").select("MAS_RECIENTE");

        cy.get(".notificaciones-table tbody tr")
            .eq(0)
            .should("contain.text", "Permiso coordinador")
            .and("contain.text", "CICES-NOT-003");

        cy.get(".notificaciones-table tbody tr")
            .eq(1)
            .should("contain.text", "Informe")
            .and("contain.text", "CICES-NOT-001");

        cy.get(".notificaciones-table tbody tr")
            .eq(2)
            .should("contain.text", "Acreditacion o licencia")
            .and("contain.text", "Licencia de investigación biomédica");
    });

    it("muestra indicador visual para notificaciones no leídas", () => {
        visitarNotificaciones();

        cy.get(".notification-bell-img")
            .should("be.visible")
            .and("have.attr", "src")
            .and("not.be.empty");

        cy.contains("tr", "CICES-NOT-001")
            .should("have.class", "row-unread")
            .and("contain.text", "No leida");

        cy.contains("tr", "CICES-NOT-003")
            .should("have.class", "row-unread")
            .and("contain.text", "No leida");
    });

    it("permite marcar una notificación como leída", () => {
        cy.intercept(
            "PUT",
            "**/api/reports/notificaciones/usuario/investigador.cypress%40ucr.ac.cr/101/leido",
            (req) => {
                expect(req.headers.authorization).to.match(/^Bearer\s.+/);

                notificacionesActuales = notificacionesActuales.map((n) =>
                    n.idNotificacionUsuario === 101
                        ? {
                            ...n,
                            leido: true,
                            fechaLeido: "2026-06-10",
                        }
                        : n
                );

                req.reply({
                    statusCode: 200,
                    body: {},
                });
            }
        ).as("marcarLeida");

        visitarNotificaciones();

        cy.contains("tr", "CICES-NOT-001").within(() => {
            cy.contains("No leida").should("be.visible");
            cy.contains("button", "Marcar leida").click();
        });

        cy.wait("@marcarLeida");

        cy.contains("tr", "CICES-NOT-001").within(() => {
            cy.contains("Leida").should("be.visible");
            cy.contains("button", "Marcar leida").should("be.disabled");
            cy.contains("button", "Marcar no leida").should("not.be.disabled");
        });
    });

    it("permite marcar una notificación como no leída", () => {
        cy.intercept(
            "PUT",
            "**/api/reports/notificaciones/usuario/investigador.cypress%40ucr.ac.cr/102/no-leido",
            (req) => {
                expect(req.headers.authorization).to.match(/^Bearer\s.+/);

                notificacionesActuales = notificacionesActuales.map((n) =>
                    n.idNotificacionUsuario === 102
                        ? {
                            ...n,
                            leido: false,
                            fechaLeido: null,
                        }
                        : n
                );

                req.reply({
                    statusCode: 200,
                    body: {},
                });
            }
        ).as("marcarNoLeida");

        visitarNotificaciones();

        cy.contains("tr", "Licencia de investigación biomédica").within(() => {
            cy.contains("Leida").should("be.visible");
            cy.contains("button", "Marcar no leida").click();
        });

        cy.wait("@marcarNoLeida");

        cy.contains("tr", "Licencia de investigación biomédica").within(() => {
            cy.contains("No leida").should("be.visible");
            cy.contains("button", "Marcar no leida").should("be.disabled");
            cy.contains("button", "Marcar leida").should("not.be.disabled");
        });
    });

    it("permite eliminar una notificación personal", () => {
        cy.intercept(
            "DELETE",
            "**/api/reports/notificaciones/usuario/investigador.cypress%40ucr.ac.cr/102",
            (req) => {
                expect(req.headers.authorization).to.match(/^Bearer\s.+/);

                notificacionesActuales = notificacionesActuales.map((n) =>
                    n.idNotificacionUsuario === 102
                        ? {
                            ...n,
                            eliminado: true,
                        }
                        : n
                );

                req.reply({
                    statusCode: 200,
                    body: {},
                });
            }
        ).as("eliminarNotificacion");

        visitarNotificaciones();

        cy.contains("Licencia de investigación biomédica").should("be.visible");

        cy.contains("tr", "Licencia de investigación biomédica").within(() => {
            cy.contains("button", "Eliminar").click();
        });

        cy.wait("@eliminarNotificacion");

        cy.contains("Licencia de investigación biomédica").should("not.exist");
        cy.contains("Resultados : 2").should("be.visible");
    });

    it("permite filtrar por estado de lectura", () => {
        visitarNotificaciones();

        cy.get("#filtro-estado-notificacion").select("NO_LEIDAS");

        cy.contains("CICES-NOT-001").should("be.visible");
        cy.contains("CICES-NOT-003").should("be.visible");
        cy.contains("Licencia de investigación biomédica").should("not.exist");

        cy.contains("Resultados : 2").should("be.visible");

        cy.get("#filtro-estado-notificacion").select("LEIDAS");

        cy.contains("Licencia de investigación biomédica").should("be.visible");
        cy.contains("CICES-NOT-001").should("not.exist");
        cy.contains("CICES-NOT-003").should("not.exist");

        cy.contains("Resultados : 1").should("be.visible");
    });
});