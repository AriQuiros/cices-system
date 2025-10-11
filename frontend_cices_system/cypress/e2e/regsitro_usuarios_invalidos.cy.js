const URL = "http://localhost:5173/registro";

const typeIf = (sel, val) => {
    cy.get(sel).clear();
    if (val != null && String(val).trim() !== "") cy.get(sel).type(String(val));
};

const fill = (u) => {
    typeIf('input[name="nombre"]', u.nombreCompleto);
    typeIf('input[name="nacionalidad"]', u.nacionalidad);
    if (u.tipoIdentificacion) cy.get('select[name="tipoIdentificacion"]').should('be.visible').select(u.tipoIdentificacion);
    typeIf('input[name="identificacion"]', u.identificacion);
    typeIf('input[name="telefono"]', u.telefono);
    typeIf('input[name="correo"]', u.correo);
    typeIf('input[name="contrasena"]', u.contrasena);
    typeIf('input[name="confirmarContrasena"]', u.confirmarContrasena);
};

describe("Registro inválido", () => {
    it("muestra el mensaje correcto según el caso", () => {
        cy.fixture("usuarios_invalidos.json").then(users => {
            cy.wrap(users).each((u) => {
                cy.visit(URL);
                fill(u);
                if (u.rol) cy.contains("label", u.rol).click();
                cy.get('button[type="submit"]').click();

                // Asserts en función del primer guard que dispara tu frontend
                if (u.expect === "missing") {
                    cy.contains("Debe completar todos los campos antes de registrar.").should("be.visible");
                    cy.contains("Las contraseñas no coinciden").should("not.exist");
                } else if (u.expect === "email") {
                    cy.contains("El correo debe terminar en @ucr.ac.cr").should("be.visible");
                    cy.contains("Las contraseñas no coinciden").should("not.exist");
                } else if (u.expect === "mismatch") {
                    // Todos los campos válidos y correo @ucr.ac.cr → ahora sí aparece
                    cy.contains("Las contraseñas no coinciden", { timeout: 8000 }).should("be.visible");
                }

                cy.contains("Usuario registrado exitosamente").should("not.exist");
            });
        });
    });
});

