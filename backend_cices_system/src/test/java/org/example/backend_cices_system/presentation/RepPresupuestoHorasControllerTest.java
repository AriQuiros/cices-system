package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.report.controller.RepPresupuestoHorasController;
import org.example.backend_cices_system.report.dto.PresupuestoHorasDTO;
import org.example.backend_cices_system.report.serviceVw.RepPresupuestoHorasService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
}