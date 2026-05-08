/// <reference types="cypress" />

const crearJwtFalso = () => {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;
    const payload = btoa(JSON.stringify({ exp }));

    return {
        token: `x.${payload}.y`,
        exp,
    };
};

const authDireccion = () => {
    const { token, exp } = crearJwtFalso();

    return {
        user: {
            id: 1,
            nombre: "Directora CICES",
            correo: "direccion@cices.ucr.ac.cr",
            roles: ["DIRECCION"],
        },
        token,
        exp,
    };
};

const rolesSistema = [
    { id: 1, nombreRol: "DIRECCION" },
    { id: 2, nombreRol: "INVESTIGADOR" },
    { id: 3, nombreRol: "ASISTENTE" },
];

const usuariosBase = [
    {
        id: 1,
        nombreCompleto: "Ana Usuario Activo",
        nombreUsuario: "ana.activa@cices.ucr.ac.cr",
        activo: true,
        roles: ["INVESTIGADOR"],
    },
    {
        id: 2,
        nombreCompleto: "Carlos Usuario Deshabilitado",
        nombreUsuario: "carlos.deshabilitado@cices.ucr.ac.cr",
        activo: false,
        roles: ["INVESTIGADOR"],
    },
];

describe("HU-043 Reactivar usuarios deshabilitados", () => {
    let usuarios;

    beforeEach(() => {
        usuarios = usuariosBase.map((u) => ({ ...u }));

        cy.intercept("GET", "**/api/rol-sistema", {
            statusCode: 200,
            body: rolesSistema,
        }).as("listarRoles");

        cy.intercept("GET", "**/api/reports/personas/usuarios", (req) => {
            req.reply({
                statusCode: 200,
                body: usuarios,
            });
        }).as("listarUsuarios");

        cy.intercept("PUT", "**/api/usuarios/2/estado", (req) => {
            expect(req.body).to.deep.eq({
                activo: true,
            });

            usuarios = usuarios.map((usuario) =>
                usuario.id === 2
                    ? {
                        ...usuario,
                        activo: true,
                    }
                    : usuario
            );

            req.reply({
                statusCode: 200,
                body: {},
            });
        }).as("reactivarUsuario");

        cy.visit("/gestion-usuarios", {
            onBeforeLoad(win) {
                const auth = authDireccion();

                win.sessionStorage.setItem("auth", JSON.stringify(auth));
                win.localStorage.setItem("auth", JSON.stringify(auth));
            },
        });

        cy.wait("@listarUsuarios");
        cy.wait("@listarRoles");
    });

    it("permite buscar un usuario deshabilitado por nombre", () => {
        cy.contains("h2", "Gestión de Usuarios").should("be.visible");

        cy.get(".gu-input")
            .should("be.visible")
            .clear()
            .type("Carlos");

        cy.contains("Carlos Usuario Deshabilitado").should("be.visible");
        cy.contains("carlos.deshabilitado@cices.ucr.ac.cr").should("be.visible");
        cy.contains("Inactivo").should("be.visible");

        cy.contains("Ana Usuario Activo").should("not.exist");
    });

    it("solicita confirmación antes de reactivar el usuario", () => {
        cy.get(".gu-input").clear().type("Carlos");

        cy.contains("tr", "Carlos Usuario Deshabilitado").within(() => {
            cy.contains("button", "Activar").click();
        });

        cy.get(".swal2-popup").should("be.visible");
        cy.get(".swal2-title")
            .should("be.visible")
            .and("contain.text", "¿Desea activar este usuario?");

        cy.get(".swal2-confirm").should("be.visible");
        cy.get(".swal2-cancel").should("be.visible");
    });

    it("reactiva un usuario deshabilitado y actualiza su estado en la lista", () => {
        cy.get(".gu-input").clear().type("Carlos");

        cy.contains("tr", "Carlos Usuario Deshabilitado").within(() => {
            cy.contains("Inactivo").should("be.visible");
            cy.contains("button", "Activar").click();
        });

        cy.get(".swal2-confirm").click();

        cy.wait("@reactivarUsuario");
        cy.wait("@listarUsuarios");

        cy.get(".gu-input").clear().type("Carlos");

        cy.contains("tr", "Carlos Usuario Deshabilitado").within(() => {
            cy.contains("Activo").should("be.visible");
            cy.contains("button", "Desactivar").should("be.visible");
        });
    });

    it("no reactiva el usuario si se cancela la confirmación", () => {
        cy.get(".gu-input").clear().type("Carlos");

        cy.contains("tr", "Carlos Usuario Deshabilitado").within(() => {
            cy.contains("Inactivo").should("be.visible");
            cy.contains("button", "Activar").click();
        });

        cy.get(".swal2-popup").should("be.visible");
        cy.get(".swal2-cancel").click();

        cy.contains("tr", "Carlos Usuario Deshabilitado").within(() => {
            cy.contains("Inactivo").should("be.visible");
            cy.contains("button", "Activar").should("be.visible");
        });

        cy.get("@reactivarUsuario.all").should("have.length", 0);
    });
});