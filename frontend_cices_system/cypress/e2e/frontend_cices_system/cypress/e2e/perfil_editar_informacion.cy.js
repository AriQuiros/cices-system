/// <reference types="cypress" />

const API = Cypress.env("apiUrl") || "http://localhost:8080";
const PASSWORD = "Password123";

const crearJwtFalso = () => {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;
    const payload = btoa(JSON.stringify({ exp }));

    return {
        token: `x.${payload}.y`,
        exp,
    };
};

const rolDireccion = {
    id: 1,
    nombreRol: "DIRECCION",
};

const authDirector = (username = "maria.directora@ucr.ac.cr") => {
    const { token, exp } = crearJwtFalso();

    return {
        user: {
            id: 7,
            username,
            nombre: "María Directora",
            roles: [rolDireccion],
        },
        token,
        exp,
    };
};

const tiposCatalogo = {
    TIPO_IDENTIFICACION: [
        {
            id: 1,
            valor: "NACIONAL",
            despliegue: "Nacional",
        },
        {
            id: 2,
            valor: "DIMEX",
            despliegue: "DIMEX",
        },
    ],
    GRADO_ACADEMICO: [
        {
            id: 10,
            valor: "LICENCIATURA",
            despliegue: "Licenciatura",
        },
        {
            id: 11,
            valor: "MAESTRIA",
            despliegue: "Maestría",
        },
    ],
};

const rolesSistema = [
    rolDireccion,
    {
        id: 2,
        nombreRol: "ADMINISTRATIVO",
    },
    {
        id: 3,
        nombreRol: "ASISTENTE",
    },
    {
        id: 4,
        nombreRol: "INVESTIGADOR",
    },
];

const perfilInicial = {
    id: 15,
    nombreCompleto: "María Directora Prueba",
    identificacion: "111111111",
    tipoId: {
        id: 1,
        valor: "NACIONAL",
        despliegue: "Nacional",
    },
    pais: "CR",
    correo: "maria.directora@ucr.ac.cr",
    numeroTelefono: "+50688887777",
    gradoAcademico: {
        id: 10,
        valor: "LICENCIATURA",
        despliegue: "Licenciatura",
    },
    usuario: {
        id: 7,
        nombreUsuario: "maria.directora@ucr.ac.cr",
        roles: [rolDireccion],
        activo: true,
    },
};

const copiar = (obj) => JSON.parse(JSON.stringify(obj));

const obtenerInputTelefono = () => {
    return cy
        .get('input#numeroTelefono, input[name="numeroTelefono"], input[type="tel"]')
        .first();
};

const visitarPerfil = () => {
    cy.visit("/perfil", {
        onBeforeLoad(win) {
            const auth = authDirector();

            win.sessionStorage.setItem("auth", JSON.stringify(auth));
            win.localStorage.setItem("auth", JSON.stringify(auth));
        },
    });

    cy.wait("@catalogos");
    cy.wait("@roles");
    cy.wait("@obtenerPerfil");
};

const confirmarIdentidadParaEditarCorreo = () => {
    cy.contains("button", "Editar correo").click();

    cy.get(".perfil-auth-modal").should("be.visible");

    cy.get(".perfil-auth-modal").within(() => {
        cy.get('input[type="password"]').clear().type(PASSWORD);
        cy.contains("button", "Confirmar").click();
    });

    cy.contains("Identidad confirmada").should("be.visible");

    cy.get('input[name="correo"]').should("not.be.disabled");
};

describe("HU-038 Editar información de Mi Perfil", () => {
    let perfilActual;

    beforeEach(() => {
        perfilActual = copiar(perfilInicial);

        cy.intercept("POST", `${API}/api/catalogos/tipos`, (req) => {
            expect(req.body).to.deep.eq([
                "TIPO_IDENTIFICACION",
                "GRADO_ACADEMICO",
            ]);

            req.reply({
                statusCode: 200,
                body: tiposCatalogo,
            });
        }).as("catalogos");

        cy.intercept("GET", `${API}/api/rol-sistema`, {
            statusCode: 200,
            body: rolesSistema,
        }).as("roles");

        cy.intercept("GET", `${API}/api/empleados/perfil`, (req) => {
            expect(req.headers.authorization).to.match(/^Bearer\s.+/);

            req.reply({
                statusCode: 200,
                body: perfilActual,
            });
        }).as("obtenerPerfil");

        cy.intercept("POST", `${API}/auth/login`, (req) => {
            expect(req.body.password).to.eq(PASSWORD);

            const username = req.body.username;
            const { token } = crearJwtFalso();

            req.reply({
                statusCode: 200,
                body: {
                    user: {
                        id: 7,
                        username,
                        nombre: "María Directora",
                        roles: [rolDireccion],
                    },
                    token,
                },
            });
        }).as("reauth");

        cy.intercept("PUT", `${API}/api/empleados/actualizar`, (req) => {
            perfilActual = {
                ...req.body,
                usuario: {
                    ...req.body.usuario,
                    nombreUsuario: req.body.correo,
                },
            };

            req.reply({
                statusCode: 200,
                body: req.body.nombreCompleto,
            });
        }).as("actualizarPerfil");
    });

    it("carga únicamente la información personal del usuario autenticado", () => {
        visitarPerfil();

        cy.contains("h2", "Mi Perfil").should("be.visible");

        cy.get('input[name="nombreCompleto"]')
            .should("be.visible")
            .and("have.value", "María Directora Prueba");

        cy.get('input[name="correo"]')
            .should("be.visible")
            .and("have.value", "maria.directora@ucr.ac.cr");

        obtenerInputTelefono().should("contain.value", "8888");
    });

    it("no permite guardar si el nombre queda vacío", () => {
        visitarPerfil();

        cy.get('input[name="nombreCompleto"]').clear().blur();

        cy.contains("No puede ser vacío").should("be.visible");

        cy.contains("button", "Actualizar Perfil").click();

        cy.get("@actualizarPerfil.all").should("have.length", 0);
    });

    it("no permite guardar correo con formato inválido", () => {
        visitarPerfil();

        confirmarIdentidadParaEditarCorreo();

        cy.get('input[name="correo"]')
            .clear()
            .type("correo-invalido")
            .blur();

        cy.contains("Debe terminar en @ucr.ac.cr").should("be.visible");

        cy.contains("button", "Actualizar Perfil").click();

        cy.get("@actualizarPerfil.all").should("have.length", 0);
    });


    it("guarda cambios válidos, muestra confirmación y refresca los datos en la vista", () => {
        visitarPerfil();

        confirmarIdentidadParaEditarCorreo();

        cy.get('input[name="nombreCompleto"]')
            .clear()
            .type("María Directora Actualizada");

        cy.get('input[name="correo"]')
            .clear()
            .type("maria.actualizada@ucr.ac.cr");

        obtenerInputTelefono().clear().type("88889999");

        cy.contains("button", "Actualizar Perfil").click();

        cy.get(".swal2-popup")
            .should("be.visible")
            .and("contain.text", "Confirmar cambios")
            .and("contain.text", "¿Desea guardar los cambios?");

        cy.get(".swal2-confirm").click();

        cy.wait("@actualizarPerfil").then(({ request }) => {
            expect(request.body.id).to.eq(15);
            expect(request.body.usuario.id).to.eq(7);

            expect(request.body.nombreCompleto).to.eq(
                "María Directora Actualizada"
            );

            expect(request.body.correo).to.eq("maria.actualizada@ucr.ac.cr");
            expect(request.body.usuario.nombreUsuario).to.eq(
                "maria.actualizada@ucr.ac.cr"
            );

            const digitosTelefono = String(request.body.numeroTelefono).replace(
                /\D/g,
                ""
            );

            expect(digitosTelefono).to.include("88889999");
        });

        cy.wait("@reauth");

        cy.contains(
            /Perfil actualizado correctamente|Cambios guardados exitosamente/
        ).should("be.visible");

        cy.get('input[name="nombreCompleto"]').should(
            "have.value",
            "María Directora Actualizada"
        );

        cy.get('input[name="correo"]').should(
            "have.value",
            "maria.actualizada@ucr.ac.cr"
        );

        obtenerInputTelefono().should("contain.value", "8888");
    });

    it("no guarda los cambios si el usuario cancela la confirmación", () => {
        visitarPerfil();

        cy.get('input[name="nombreCompleto"]')
            .clear()
            .type("Cambio Cancelado");

        cy.contains("button", "Actualizar Perfil").click();

        cy.get(".swal2-popup")
            .should("be.visible")
            .and("contain.text", "Confirmar cambios");

        cy.get(".swal2-cancel").click();

        cy.get("@actualizarPerfil.all").should("have.length", 0);

        cy.get('input[name="nombreCompleto"]').should(
            "have.value",
            "Cambio Cancelado"
        );
    });
});