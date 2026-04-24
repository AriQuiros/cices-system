package org.example.backend_cices_system.presentation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
/*
@ExtendWith(MockitoExtension.class)
class ProyectoControllerTest {

    @Mock
    private ProyectoService proyectoService;

    @InjectMocks
    private ProyectoController proyectoController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(proyectoController).build();
    }

    @Test
    void debeRetornarResumenHorasProyecto() throws Exception {
        ResumenHorasProyectoDTO response = new ResumenHorasProyectoDTO(
                "Proyecto CICES",
                80.0,
                20.0,
                List.of(
                        new InvestigadorHorasDTO(
                                1,
                                "Alejandro Alvarez",
                                "Carga académica",
                                10.0,
                                (short) 6
                        ),
                        new InvestigadorHorasDTO(
                                2,
                                "Maria Gomez",
                                "Asistente",
                                5.0,
                                (short) 4
                        )
                )
        );

        when(proyectoService.obtenerResumenHoras(1)).thenReturn(response);

        mockMvc.perform(get("/api/proyectos/1/horas-asignadas")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.proyectoNombre").value("Proyecto CICES"))
                .andExpect(jsonPath("$.totalHorasAsignadas").value(80.0))
                .andExpect(jsonPath("$.totalHorasDisponibles").value(20.0))
                .andExpect(jsonPath("$.investigadores.length()").value(2))
                .andExpect(jsonPath("$.investigadores[0].idInvestigador").value(1))
                .andExpect(jsonPath("$.investigadores[0].nombreCompleto").value("Alejandro Alvarez"))
                .andExpect(jsonPath("$.investigadores[0].tipoHoras").value("Carga académica"))
                .andExpect(jsonPath("$.investigadores[0].horasMes").value(10.0))
                .andExpect(jsonPath("$.investigadores[0].meses").value(6));
    }

    @Test
    void debeRetornarListaVaciaSiNoHayInvestigadores() throws Exception {
        ResumenHorasProyectoDTO response = new ResumenHorasProyectoDTO(
                "Proyecto vacío",
                0.0,
                50.0,
                List.of()
        );

        when(proyectoService.obtenerResumenHoras(1)).thenReturn(response);

        mockMvc.perform(get("/api/proyectos/1/horas-asignadas")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.proyectoNombre").value("Proyecto vacío"))
                .andExpect(jsonPath("$.totalHorasAsignadas").value(0.0))
                .andExpect(jsonPath("$.totalHorasDisponibles").value(50.0))
                .andExpect(jsonPath("$.investigadores.length()").value(0));
    }
}*/