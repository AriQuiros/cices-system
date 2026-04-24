package org.example.backend_cices_system.service;

import static org.mockito.Mockito.verify;
/*
@ExtendWith(MockitoExtension.class)
class RepPresupuestoHorasControllerTest {

    @Mock
    private RepPresupuestoHorasService service;

    @InjectMocks
    private RepPresupuestoHorasController controller;

    @Test
    void getDistribucionHoras_debeRetornarPresupuestosConHoras() {
        String codigoProyecto = "PROY-001";

        List<PresupuestoHorasDTO> mockResponse = List.of(
                new PresupuestoHorasDTO(
                        1,
                        "Horas de investigación",
                        "RECURSO HUMANO",
                        LocalDate.of(2025, 2, 1),
                        "HORAS",
                        new BigDecimal("160.00"),
                        (short) 4,
                        List.of()
                )
        );

        when(service.horasPresupuesto(codigoProyecto)).thenReturn(mockResponse);

        List<PresupuestoHorasDTO> resultado = controller.getDistribucionHoras(codigoProyecto);

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Horas de investigación", resultado.get(0).descripcion());
        assertEquals("HORAS", resultado.get(0).tipoPresupuesto());

        verify(service).horasPresupuesto(codigoProyecto);
    }
}*/