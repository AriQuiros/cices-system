package org.example.backend_cices_system.presentation;

import static org.mockito.Mockito.verify;
/*
@ExtendWith(MockitoExtension.class)
class RepInvestigadorProyectoControllerTest {

    @Mock
    private RepInvestigadorProyectoService service;

    @InjectMocks
    private RepInvestigadorProyectoController controller;

    @Test
    void getByCodigoProyecto_debeRetornarListaDeParticipantes() {
        String codigoProyecto = "PROY-001";

        List<InvestigadorProyectoDTO> mockResponse = List.of(
                new InvestigadorProyectoDTO(
                        10,
                        "123456789",
                        "Derby Muñoz",
                        "Licenciatura",
                        codigoProyecto,
                        new RolProyectoDTO((short) 3, "Colaborador"),
                        "Análisis de datos",
                        LocalDate.of(2025, 1, 10),
                        LocalDate.of(2025, 12, 10)
                )
        );

        when(service.buscarPorCodigoProyecto(codigoProyecto)).thenReturn(mockResponse);

        List<InvestigadorProyectoDTO> resultado = controller.getByCodigoProyecto(codigoProyecto);

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Derby Muñoz", resultado.get(0).nombreInvestigador());
        assertEquals("PROY-001", resultado.get(0).codigoProyecto());

        verify(service).buscarPorCodigoProyecto(codigoProyecto);
    }
}*/