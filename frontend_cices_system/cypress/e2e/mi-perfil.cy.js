describe("Pruebas funcionales - Módulo Mi Perfil", () => {

    // ============================================================
    // Helpers
    // ============================================================

    const crearTokenFalso = (username) => {
        const header = window.btoa(JSON.stringify({
            alg: "HS256",
            typ: "JWT"
        }));

        const payload = window.btoa(JSON.stringify({
            sub: username,
            exp: Math.floor(Date.now() / 1000) + 3600
        }));

        return `${header}.${payload}.firma-falsa`;
    };

    const visitarPerfilConSesion = (user) => {
        cy.visit("/perfil", {
            onBeforeLoad(win) {
                const token = win.btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })) + "." +
                    win.btoa(JSON.stringify({
                        sub: user.username,
                        exp: Math.floor(Date.now() / 1000) + 3600
                    })) +
                    ".firma-falsa";

                win.sessionStorage.setItem("auth", JSON.stringify({
                    user,
                    token,
                    exp: Math.floor(Date.now() / 1000) + 3600
                }));
            }
        });
    };

    const mockCatalogosRolesYNotificaciones = () => {
        cy.intercept("POST", "**/api/catalogos/tipos", {
            statusCode: 200,
            body: {
                TIPO_IDENTIFICACION: [
                    {
                        id: 1,
                        valor: "NACIONAL",
                        despliegue: "Nacional"
                    }
                ],
                GRADO_ACADEMICO: [
                    {
                        id: 2,
                        valor: "LICENCIATURA",
                        despliegue: "Licenciatura"
                    }
                ],
                TIPO_CERTIFICACION: [
                    {
                        id: 3,
                        valor: "LICENCIA",
                        despliegue: "Licencia"
                    }
                ]
            }
        }).as("tiposCatalogo");

        cy.intercept("GET", "**/api/rol-sistema", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    nombreRol: "ADMINISTRATIVO"
                },
                {
                    id: 2,
                    nombreRol: "INVESTIGADOR"
                },
                {
                    id: 3,
                    nombreRol: "DIRECCION"
                },
                {
                    id: 4,
                    nombreRol: "ASISTENTE"
                }
            ]
        }).as("rolesSistema");

        cy.intercept("GET", "**/api/reports/notificaciones/usuario/**/detalladas", {
            statusCode: 200,
            body: []
        }).as("notificacionesDetalladas");

        cy.intercept("GET", "**/api/reports/notificaciones/usuario/**/esperar-cambios", {
            statusCode: 200,
            body: []
        }).as("notificacionesCambios");

        cy.intercept("GET", "**/api/entidades**", {
            statusCode: 200,
            body: []
        }).as("entidades");
    };

    // ============================================================
    // Datos de prueba
    // ============================================================

    const empleadoAdministrativo = {
        id: 1,
        nombreCompleto: "Ana Mora",
        identificacion: "11223344",
        tipoId: {
            id: 1,
            valor: "NACIONAL",
            despliegue: "Nacional"
        },
        pais: "CR",
        correo: "ana.mora@ucr.ac.cr",
        numeroTelefono: "+50688887777",
        gradoAcademico: {
            id: 2,
            valor: "LICENCIATURA",
            despliegue: "Licenciatura"
        },
        usuario: {
            id: 1,
            nombreUsuario: "ana.mora@ucr.ac.cr",
            roles: [
                {
                    id: 1,
                    nombreRol: "ADMINISTRATIVO"
                }
            ]
        }
    };

    const empleadoInvestigador = {
        id: 2,
        nombreCompleto: "Carlos Rojas",
        identificacion: "55667788",
        tipoId: {
            id: 1,
            valor: "NACIONAL",
            despliegue: "Nacional"
        },
        pais: "CR",
        correo: "carlos.rojas@ucr.ac.cr",
        numeroTelefono: "+50688889999",
        gradoAcademico: {
            id: 2,
            valor: "LICENCIATURA",
            despliegue: "Licenciatura"
        },
        usuario: {
            id: 2,
            nombreUsuario: "carlos.rojas@ucr.ac.cr",
            roles: [
                {
                    id: 2,
                    nombreRol: "INVESTIGADOR"
                }
            ]
        }
    };

    const perfilInvestigador = {
        id: 10,
        empleado: empleadoInvestigador,
        institucionOrigen: {
            id: 1,
            nombre: "Universidad de Costa Rica"
        },
        unidadAcademica: {
            id: 2,
            nombre: "Escuela de Enfermería"
        },
        temaInteres: "Cuidado de enfermería",
        titulos: [
            {
                id: 20,
                nombreTitulo: "Licenciatura en Enfermería",
                entidadEmisora: {
                    id: 1,
                    nombre: "Universidad de Costa Rica"
                },
                nivelTitulo: {
                    id: 2,
                    valor: "LICENCIATURA",
                    despliegue: "Licenciatura"
                },
                fechaEmision: "2022-06-15"
            }
        ],
        certificaciones: [
            {
                id: 5,
                entidadEmisora: {
                    id: 1,
                    nombre: "Colegio Profesional"
                },
                nombreCertificacion: "Licencia profesional",
                tipoCertificacion: {
                    id: 3,
                    valor: "LICENCIA",
                    despliegue: "Licencia"
                },
                fechaExpiracion: "2026-12-31",
                tipoEstado: {
                    id: 4,
                    valor: "VIGENTE",
                    despliegue: "Vigente"
                }
            }
        ]
    };

    const usuarioAdministrativo = {
        id: 1,
        username: "ana.mora@ucr.ac.cr",
        nombreCompleto: "Ana Mora",
        roles: [
            {
                id: 1,
                nombreRol: "ADMINISTRATIVO"
            }
        ]
    };

    const usuarioInvestigador = {
        id: 2,
        username: "carlos.rojas@ucr.ac.cr",
        nombreCompleto: "Carlos Rojas",
        roles: [
            {
                id: 2,
                nombreRol: "INVESTIGADOR"
            }
        ]
    };

    beforeEach(() => {
        mockCatalogosRolesYNotificaciones();
    });

    // ============================================================
    // HU-035
    // ============================================================

    context("HU-035 - Visualizar perfil del personal administrativo, asistente y director", () => {

        it("Debe mostrar los datos personales del perfil administrativo", () => {
            cy.intercept("GET", "**/api/empleados/perfil", {
                statusCode: 200,
                body: empleadoAdministrativo
            }).as("perfilEmpleado");

            visitarPerfilConSesion(usuarioAdministrativo);

            cy.wait("@tiposCatalogo");
            cy.wait("@rolesSistema");
            cy.wait("@perfilEmpleado");

            cy.contains("Mi Perfil").should("be.visible");

            cy.get('input[name="nombreCompleto"]')
                .should("have.value", "Ana Mora");

            cy.get('input[name="identificacion"]')
                .should("have.value", "11223344");

            cy.get('input[name="correo"]')
                .should("have.value", "ana.mora@ucr.ac.cr");

            cy.get('input[name="numeroTelefono"]')
                .should("exist");

            cy.contains("Formación académica e investigativa")
                .should("not.exist");
        });

    });

    // ============================================================
    // HU-036
    // ============================================================

    context("HU-036 - Visualizar perfil de investigadores", () => {

        it("Debe mostrar perfil del investigador con formación académica", () => {
            cy.intercept("GET", "**/api/investigadores/perfil", {
                statusCode: 200,
                body: perfilInvestigador
            }).as("perfilInvestigador");

            visitarPerfilConSesion(usuarioInvestigador);

            cy.wait("@tiposCatalogo");
            cy.wait("@rolesSistema");
            cy.wait("@perfilInvestigador");

            cy.contains("Mi Perfil").should("be.visible");

            cy.get('input[name="nombreCompleto"]')
                .should("have.value", "Carlos Rojas");

            cy.get('input[name="identificacion"]')
                .should("have.value", "55667788");

            cy.get('input[name="correo"]')
                .should("have.value", "carlos.rojas@ucr.ac.cr");

            cy.contains("Formación académica e investigativa")
                .should("be.visible");

            cy.get('input[name="titulo-nombre-0"]')
                .should("have.value", "Licenciatura en Enfermería");

            cy.get('input[name="cert-nombre-0"]')
                .should("have.value", "Licencia profesional");
        });

    });

    // ============================================================
    // HU-041
    // ============================================================

    context("HU-041 - Eliminar acreditación o licencia personal", () => {

        it("Debe eliminar una certificación desde formación académica", () => {
            cy.intercept("GET", "**/api/investigadores/perfil", {
                statusCode: 200,
                body: perfilInvestigador
            }).as("perfilInvestigador");

            cy.intercept("DELETE", "**/api/certificaciones/eliminar/5", {
                statusCode: 200,
                body: "Licencia profesional"
            }).as("eliminarCertificacion");

            visitarPerfilConSesion(usuarioInvestigador);

            cy.wait("@tiposCatalogo");
            cy.wait("@rolesSistema");
            cy.wait("@perfilInvestigador");

            cy.contains("Formación académica e investigativa")
                .should("be.visible");

            cy.get('input[name="cert-nombre-0"]')
                .should("have.value", "Licencia profesional");

            cy.get('button[aria-label="Eliminar certificación"]')
                .first()
                .click();

            cy.get("body").then(($body) => {
                if ($body.find(".swal2-confirm").length > 0) {
                    cy.get(".swal2-confirm").click();
                } else {
                    cy.contains("button", /confirmar|eliminar|sí|si/i)
                        .click({ force: true });
                }
            });

            cy.wait("@eliminarCertificacion");

            cy.get('input[name="cert-nombre-0"]')
                .should("not.exist");
        });

    });

});