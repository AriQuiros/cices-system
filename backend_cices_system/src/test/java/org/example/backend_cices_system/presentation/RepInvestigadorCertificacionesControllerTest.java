package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.report.controller.RepInvestigadorCertificacionesController;
import org.example.backend_cices_system.report.dto.CertificacionFiltroDTO;
import org.example.backend_cices_system.report.dto.FormacionDTO;
import org.example.backend_cices_system.report.serviceVw.RepInvestigadorCertificacionesService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RepInvestigadorCertificacionesControllerTest {

    @Mock
    private RepInvestigadorCertificacionesService service;

    @InjectMocks
    private RepInvestigadorCertificacionesController controller;

    @Test
    void filtrar_debeRetornarPaginaDeCertificaciones() {
        CertificacionFiltroDTO filtro = new CertificacionFiltroDTO();
        filtro.setNombre("Ana");

        var pagina = new PageImpl<>(List.of(
                new FormacionDTO(
                        "111",
                        "Ana Perez",
                        "Licencia Investigador",
                        "UNA",
                        "Licencia",
                        "Activa",
                        LocalDate.of(2026, 5, 10)
                )
        ));

        when(service.filtrarCertificacionesPaginado(filtro, 0, 10)).thenReturn(pagina);

        ResponseEntity<?> response = controller.filtrar(filtro, 0, 10);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(pagina, response.getBody());
        verify(service).filtrarCertificacionesPaginado(filtro, 0, 10);
    }

    @Test
    void exportar_debeRetornarArchivoGenerado() {
        CertificacionFiltroDTO filtro = new CertificacionFiltroDTO();

        ResponseEntity<byte[]> expected = ResponseEntity.ok("archivo".getBytes());

        when(service.generarReporte(filtro, "pdf")).thenReturn(expected);

        ResponseEntity<byte[]> response = controller.exportar(filtro, "pdf");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertArrayEquals("archivo".getBytes(), response.getBody());
        verify(service).generarReporte(filtro, "pdf");
    }
}