package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.dto.RolProyectoDTO;
import org.example.backend_cices_system.report.controller.RepInvestigadorProyectoController;
import org.example.backend_cices_system.report.serviceVw.RepInvestigadorProyectoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
}