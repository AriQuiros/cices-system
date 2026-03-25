describe("HU-037 - Consulta de acreditaciones o licencias del investigador", () => {
    const auth = {
        user: {
            id: 10,
            nombre: "Investigador Demo",
            rol: "INVESTIGADOR",
        },
        token: "fake-jwt-token",
        exp: 4102444800,
    };

    const catalogos = {
        TIPO_CERTIFICACION: [
            { valor: "LICENCIA", despliegue: "Licencia" },
            { valor: "ACREDITACION", despliegue: "Acreditación" },
        ],
        ESTADO_CERTIFICACION: [
            { valor: "VIGENTE", despliegue: "Vigente" },
            { valor: "VENCIDA", despliegue: "Vencida" },
            { valor: "PROXIMA", despliegue: "Próxima a vencer" },
        ],
    };

    const certificaciones = [
        {
            id: 1,
            nombreCertificacion: "Licencia de Operación Institucional",
            entidadEmisora: { nombre: "UCR" },
            tipoCertificacion: { valor: "LICENCIA", despliegue: "Licencia" },
            estado: { valor: "VIGENTE", despliegue: "Vigente" },
            fechaExpiracion: "2026-04-15",
        },
        {
            id: 2,
            nombreCertificacion: "Acreditación de Conservación Técnica",
            entidadEmisora: { nombre: "CICES" },
            tipoCertificacion: { valor: "ACREDITACION", despliegue: "Acreditación" },
            estado: { valor: "VENCIDA", despliegue: "Vencida" },
            fechaExpiracion: "2025-12-01",
        },
    ];

    beforeEach(() => {
        cy.intercept("POST", "**/api/catalogos/tipos", {
            statusCode: 200,
            body: catalogos,
        }).as("catalogos");

        cy.intercept("GET", "**/api/certificaciones/investigador", {
            statusCode: 200,
            body: certificaciones,
        }).as("certificaciones");

        cy.visit("/certificaciones-investigador", {
            onBeforeLoad(win) {
                win.localStorage.setItem("auth", JSON.stringify(auth));
            },
        });

        cy.wait("@catalogos");
        cy.wait("@certificaciones");
    });

    it("muestra la lista inicial de certificaciones del investigador", () => {
        cy.contains("Mis Certificaciones").should("be.visible");
        cy.contains("Licencia de Operación Institucional").should("be.visible");
        cy.contains("Acreditación de Conservación Técnica").should("be.visible");
        cy.get("table tbody tr").should("have.length", 2);
    });

    it("filtra por tipo de certificación", () => {
        cy.get(".react-select__control").eq(0).click();
        cy.contains(".react-select__option", "Licencia").click();

        cy.get("table tbody tr").should("have.length", 1);
        cy.contains("Licencia de Operación Institucional").should("be.visible");
        cy.contains("Acreditación de Conservación Técnica").should("not.exist");
    });

    it("filtra por estado de certificación", () => {
        cy.get(".react-select__control").eq(1).click();
        cy.contains(".react-select__option", "Vencida").click();

        cy.get("table tbody tr").should("have.length", 1);
        cy.contains("Acreditación de Conservación Técnica").should("be.visible");
        cy.contains("Licencia de Operación Institucional").should("not.exist");
    });
});