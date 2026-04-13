/// <reference types="cypress" />

describe("Perfil investigador - editar acreditación y guardar", () => {
    const APP_URL = "http://localhost:5173/perfil";
    const API = "http://localhost:8080/api";

    const exp = Math.floor(Date.now() / 1000) + 3600;
    const fakePayload = btoa(JSON.stringify({ exp }));
    const fakeJwt = `x.${fakePayload}.y`;

    const auth = {
        user: {
            id: 10,
            username: "maria.martinezhernandez@ucr.ac.cr",
            nombreCompleto: "Maria Martinez Hernandez",
            roles: ["INVESTIGADOR"],
        },
        token: fakeJwt,
        exp,
    };

    const catalogosPerfil = {
        TIPO_IDENTIFICACION: [
            { id: 1, valor: "NACIONAL", despliegue: "Nacional" },
            { id: 2, valor: "DIMEX", despliegue: "DIMEX" },
            { id: 3, valor: "PASAPORTE", despliegue: "Pasaporte" },
        ],
        GRADO_ACADEMICO: [
            { id: 10, valor: "LICENCIATURA", despliegue: "Licenciatura" },
            { id: 11, valor: "MAESTRIA", despliegue: "Maestría" },
            { id: 12, valor: "DOCTORADO", despliegue: "Doctorado" },
        ],
    };

    const catalogosCertificacion = {
        TIPO_CERTIFICACION: [
            { id: 20, valor: "ACREDITACION", despliegue: "Acreditación" },
            { id: 21, valor: "LICENCIA", despliegue: "Licencia" },
        ],
    };

    const rolesSistema = [
        { id: 1, nombreRol: "INVESTIGADOR" },
    ];

    const entidades = [
        {
            id: 1,
            nombre: "Universidad de Costa Rica",
            tipo: { valor: "INSTITUCION" },
        },
        {
            id: 2,
            nombre: "Escuela de Computación",
            tipo: { valor: "UNIDAD" },
        },
        {
            id: 3,
            nombre: "Colegio Federado",
            tipo: { valor: "INSTITUCION" },
        },
    ];

    const perfilInvestigador = {
        id: 100,
        institucionOrigen: {
            id: 1,
            nombre: "Universidad de Costa Rica",
            tipo: { valor: "INSTITUCION" },
        },
        unidadAcademica: {
            id: 2,
            nombre: "Escuela de Computación",
            tipo: { valor: "UNIDAD" },
        },
        temaInteres: "Seguridad informática",
        titulos: [],
        certificaciones: [
            {
                id: 55,
                nombreCertificacion: "Acreditación ISO 9001",
                entidadEmisora: {
                    id: 3,
                    nombre: "Colegio Federado",
                    tipo: { valor: "INSTITUCION" },
                },
                tipoCertificacion: {
                    id: 20,
                    valor: "ACREDITACION",
                    despliegue: "Acreditación",
                },
                fechaExpiracion: "2026-12-31",
                estado: {
                    valor: "VIGENTE",
                    despliegue: "Vigente",
                },
            },
        ],
        empleado: {
            id: 200,
            nombreCompleto: "Maria Martinez Hernandez",
            tipoId: {
                id: 1,
                valor: "NACIONAL",
                despliegue: "Nacional",
            },
            identificacion: "123456789",
            pais: "CR",
            numeroTelefono: "+50688887777",
            gradoAcademico: {
                id: 10,
                valor: "LICENCIATURA",
                despliegue: "Licenciatura",
            },
            correo: "maria.martinezhernandez@ucr.ac.cr",
            usuario: {
                id: 300,
                nombreUsuario: "maria.martinezhernandez@ucr.ac.cr",
                roles: [
                    { id: 1, nombreRol: "INVESTIGADOR" },
                ],
            },
        },
    };

    beforeEach(() => {
        cy.intercept("POST", `${API}/catalogos/tipos`, (req) => {
            const body = req.body || [];

            if (Array.isArray(body) && body.includes("TIPO_CERTIFICACION")) {
                req.reply({
                    statusCode: 200,
                    body: catalogosCertificacion,
                });
                return;
            }

            req.reply({
                statusCode: 200,
                body: catalogosPerfil,
            });
        }).as("catalogos");

        cy.intercept("GET", `${API}/rol-sistema`, {
            statusCode: 200,
            body: rolesSistema,
        }).as("roles");

        cy.intercept("GET", `${API}/entidades`, {
            statusCode: 200,
            body: entidades,
        }).as("entidades");

        cy.intercept("GET", `${API}/investigadores/perfil`, {
            statusCode: 200,
            body: perfilInvestigador,
        }).as("perfil");

        cy.intercept(
            "GET",
            `${API}/reports/notificaciones/usuario/*/detalladas`,
            {
                statusCode: 200,
                body: [],
            }
        ).as("notificaciones");

        cy.intercept(
            "GET",
            `${API}/reports/notificaciones/usuario/*/esperar-cambios`,
            {
                statusCode: 204,
                body: {},
            }
        ).as("esperarCambios");

        cy.intercept("PUT", `${API}/investigadores/actualizar`, (req) => {
            expect(req.body).to.have.property("certificaciones");
            expect(req.body.certificaciones).to.have.length(1);

            expect(req.body.certificaciones[0].id).to.eq(55);
            expect(req.body.certificaciones[0].nombreCertificacion)
                .to.eq("Acreditación ISO 27001");
            expect(req.body.certificaciones[0].fechaExpiracion)
                .to.eq("2027-06-30");

            req.reply({
                statusCode: 200,
                body: { ok: true, message: "Perfil actualizado" },
            });
        }).as("actualizarPerfil");

        cy.visit(APP_URL, {
            onBeforeLoad(win) {
                win.localStorage.clear();
                win.sessionStorage.clear();

                win.sessionStorage.setItem("auth", JSON.stringify(auth));
                win.localStorage.setItem("auth", JSON.stringify(auth));
            },
        });

        cy.window().then((win) => {
            expect(win.sessionStorage.getItem("auth")).to.not.be.null;
        });

        cy.wait("@catalogos");
        cy.wait("@roles");
        cy.wait("@perfil");
        cy.wait("@catalogos");
        cy.wait("@entidades");
    });

    it("debe editar una acreditación y guardar los cambios con Actualizar Perfil", () => {
        cy.contains("Mi Perfil").should("be.visible");

        cy.contains("Formación académica e investigativa", { timeout: 10000 })
            .should("be.visible");

        cy.contains("Certificaciones (informal)")
            .should("be.visible");

        cy.get('input[name="cert-nombre-0"]', { timeout: 10000 })
            .should("be.visible")
            .clear()
            .type("Acreditación ISO 27001");

        cy.get('input[name="cert-exp-0"]')
            .should("be.visible")
            .clear()
            .type("2027-06-30");

        cy.contains("button", "Actualizar Perfil")
            .scrollIntoView()
            .should("be.visible")
            .click({ force: true });

        cy.get(".swal2-popup", { timeout: 10000 }).should("be.visible");
        cy.contains(".swal2-confirm", "Guardar")
            .should("be.visible")
            .click({ force: true });

        cy.wait("@actualizarPerfil");

        cy.contains("Perfil actualizado correctamente", { timeout: 10000 })
            .should("exist");
    });
});