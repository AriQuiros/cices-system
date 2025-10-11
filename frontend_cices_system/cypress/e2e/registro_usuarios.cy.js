// cypress/e2e/registro_roles_json.cy.js
const URL = "http://localhost:5173/registro";

const llenarFormulario = (u, idx) => {
    const ts = Date.now() + idx;
    cy.get('input[name="nombre"]').clear().type(u.nombreCompleto);
    cy.get('input[name="nacionalidad"]').clear().type(u.nacionalidad);
    // si tu JSON trae "Nacional", "Dimex" o "Pasaporte"
    cy.get('select[name="tipoIdentificacion"]')
        .should('be.visible')
        .select(u.tipoIdentificacion);

    cy.get('input[name="identificacion"]').clear().type(`${u.identificacion}${ts}`); // único
    cy.get('input[name="telefono"]').clear().type(u.telefono);
    cy.get('input[name="correo"]').clear().type(`test${ts}.${u.correo}`); // único y @ucr.ac.cr
    cy.get('input[name="contrasena"]').clear().type(u.contrasena);
    cy.get('input[name="confirmarContrasena"]').clear().type(u.confirmarContrasena);
};

describe("Registro con fixture", () => {
    it("registra dos de cada rol", () => {
        cy.fixture("usuarios_roles.json").then((usuarios) => {
            cy.wrap(usuarios).each((u, idx) => {
                cy.visit(URL);
                llenarFormulario(u, idx);
                cy.contains("label", u.rol).click();       // click en el rol por label
                cy.get('button[type="submit"]').click();
                cy.contains("Usuario registrado exitosamente", { timeout: 8000 }).should("be.visible");
            });
        });
    });
});
