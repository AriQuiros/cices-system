package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.report.controller.RepPresupuestoGastosController;
import org.example.backend_cices_system.report.dto.PresupuestoFinancieroDTO;
import org.example.backend_cices_system.report.serviceVw.RepPresupuestoGastosService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RepPresupuestoGastosControllerTest {

    @Mock
    private RepPresupuestoGastosService service;

    @InjectMocks
    private RepPresupuestoGastosController controller;

    @Test
    void testGetGastos() {

        String codigo = "PROY001";

        List<PresupuestoFinancieroDTO> mockResponse = List.of(
                new PresupuestoFinancieroDTO(
                        1,
                        "PROY001",
                        "Desc",
                        "Categoria",
                        LocalDate.now(),
                        "Tipo",
                        "Fuente",
                        new BigDecimal(1000.0),
                        List.of()
                )
        );

        when(service.gastosPresupuesto(codigo)).thenReturn(mockResponse);

        List<PresupuestoFinancieroDTO> result = controller.getGastos(codigo);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("PROY001", result.getFirst().codigoProyecto());

        verify(service).gastosPresupuesto(codigo);
    }
}