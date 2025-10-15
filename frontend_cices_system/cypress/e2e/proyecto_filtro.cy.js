
describe('Filtrado de proyectos', () => {
    beforeEach(() => {

        cy.intercept('GET', '/api/proyectos/consultar', {
            statusCode: 200,
            body: [
                {
                    idProyecto: 1,
                    nombre: "Sistema de Gestión Hospitalaria",
                    codigo: "HOSP-001",
                    lineaInvestigacion: "Salud Digital",
                    fechaInicio: "2024-01-01",
                    fechaFinalizacion: "2024-12-31"
                },
                {
                    idProyecto: 2,
                    nombre: "Red de Datos Médicos",
                    codigo: "RED-002",
                    lineaInvestigacion: "Telemedicina",
                    fechaInicio: "2024-02-01",
                    fechaFinalizacion: "2025-01-15"
                }
            ],
        }).as('getProyectos');

        cy.visit('http://localhost:5173/consultaProyectos');
        cy.wait('@getProyectos');
    });


    it('muestra todos los proyectos inicialmente', () => {
        cy.get('.todosLosProyectos h3').should('have.length', 1);
        cy.contains("Sistema de Gestión Hospitalaria");
        cy.contains(2);
    });

    it('filtra por nombre correctamente', () => {
        // Cambiar filtro a "nombreProyecto"
        cy.get('select.filtro').select('nombre');

        // Escribir término de búsqueda
        cy.get('input.buscador').type('hospitalaria');

        // Validar que solo aparece uno
        cy.get('.todosLosProyectos h3').should('have.length', 1);
        cy.contains('Sistema de Gestión Hospitalaria');
    });

    it('limpia los filtros correctamente', () => {
        cy.get('select.filtro').select('nombre');
        cy.get('input.buscador').type('red');
        cy.get('.boton-limpiar').click();

        cy.get('input.buscador').should('have.value', '');
        cy.get('.todosLosProyectos h3').should('have.length', 1);
    });

    describe('Seleccionar un proyecto', () => {
        beforeEach(() => {

            cy.intercept('GET', '/api/proyectos/consultar:id', {
                statusCode: 200,
                body: [
                    {
                        "idProyecto": 1,
                        "nombre": "Sistema de Gestion de Investigacion",
                        "codigo": "2024-001",
                        "descripcion":  "Se ha estimado que mundialmente hay aproximadamente 200 millones de estudiantes universitarios; se espera incluso que en América Latina y el Caribe la cantidad de estudiantes crezca de forma acelerada en los próximos años. En el caso de Costa Rica, para el 2017 se registraron cerca de 209,000 alumnos universitarios, de los cuales 40,939 estaban matriculados en la Universidad de Costa Rica, de estos 9,327 fueron de primer ingreso. Por otro lado, además de la importante cantidad de personas que son estudiantes universitarios, hay que considerar que muchas de ellas se encuentran en la etapa de la adultez joven. Este es uno de los periodos de transición más importantes en la vida de todos los individuos, ya que se terminan de consolidar muchas de las habilidades, actitudes y conductas que se desarrollaron durante las etapas previas, de tal forma que ciertamente todo lo que ocurre en este periodo influye en los años subsecuentes de la vida de las personas. Otro elemento que se debe tomar en cuenta es que el estudiantado universitario ha sido identificado como una población con alto riesgo de exposición a conductas de riesgo como lo son el consumo de sustancias psicoactivas, los altos niveles de estrés y ansiedad, los trastornos de la calidad del sueño, la actividad física y la alimentación, entre otros. Por esta razón es necesario establecer mecanismos de vigilancia en salud que permitan identificar las necesidades (en salud) de esta población e informar las intervenciones y acciones enfocadas en mejorar su bienestar. A pesar de que en la Universidad de Costa Rica han existido diferentes iniciativas para recolectar información de la salud de la población estudiantil, estos esfuerzos no se han establecido de forma permanente ni sistematizada, por lo que este proyecto propone la implementación de un observatorio para el análisis de la situación de salud del estudiantado universitario. Para lograr este objetivo, se propone realizar una recolección longitudinal de información con cohortes de estudiantes, los cuales deben completar una encuesta en línea, con preguntas sobre las características sociodemográficas y académicas, las morbilidades, la salud mental, la calidad de las relaciones interpersonales, las conductas de salud y la utilización de servicios universitarios. Los cohortes de estudiantes se seguirán desde el momento que ingresen a la universidad hasta que finalicen sus planes de estudio.",
                        "objetivoGeneral": "Analizar la situación de salud de la población estudiantil universitaria",
                        "fechaInicio": "2024-01-31",
                        "fechaFinalizacion": "2024-12-31",
                        "lineaInvestigacion": "Investigacion Basica",
                        "tipoProyecto": "Biomedico observacional",
                        "estado": "ACTIVO",
                        "tipo": null,
                        "detalles": "Desarrollo de un sistema integral para la gestion de proyectos de investigacion",
                        "objetivosEspecificos": [
                            {

                            }
                        ],
                        "presupuestos": [
                            {
                                "idPresupuesto": 1,
                                "idProyecto": null,
                                "fechaAsignacion": null,
                                "fuenteFinanciamiento": "CONCURSABLE",
                                "monto": 500000,
                                "cantidadHorasMes": null,
                                "cantidadMeses": null,
                                "tipoPresupuesto": "FINANCIERO",
                                "descripcion": "Investigacion",
                                "gastosRealizados": null,
                                "montoDisponible": null
                            }
                        ],
                        "documentos": [],
                        "entidadesVinculadas": [],
                        "presentacionesInformes": [],
                        "investigadoresProyectos": [
                            {
                                "rolProyecto": "INVESTIGADOR_PRINCIPAL",
                                "nombre": "Prueba Base de Datos",
                                "cedula": "11111111",
                                "gradoAcademico": "LICENCIATURA",
                                "institucion": "ucr",
                                "unidadAcademica": "medicina",
                                "certificaciones": [
                                    {
                                        "nombre": "patito",
                                        "tipoCertificacion": "ACREDITACION",
                                        "fechaExpiracion": "2025-12-31",
                                        "estado": "VIGENTE"
                                    }
                                ]
                            }
                        ]
                    }
                    ,
                    {
                    }
                ],
            }).as('proyecto');

            cy.visit('http://localhost:5173/consultar:id');
            cy.wait('@proyecto');
        });

    });
});