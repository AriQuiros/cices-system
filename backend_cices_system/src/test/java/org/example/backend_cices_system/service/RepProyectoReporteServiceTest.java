package org.example.backend_cices_system.service;

import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.report.dto.ProyectoFiltroDTO;
import org.example.backend_cices_system.report.serviceVw.RepProyectoReporteService;
import org.example.backend_cices_system.reportes.builder.ProyectosReportBuilder;
import org.example.backend_cices_system.reportes.service.DocumentService;
import org.example.backend_cices_system.service.ProyectoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RepProyectoReporteServiceTest {

    @Mock
    private ProyectoService proyectoService;

    @Mock
    private DocumentService documentService;

    @Mock
    private ProyectosReportBuilder proyectosReportBuilder;

    @InjectMocks
    private RepProyectoReporteService service;

    @Test
    void generarReporte_debeBuscarConFiltrosSinLimiteYGenerarResponse() {
        ProyectoFiltroDTO filtro = new ProyectoFiltroDTO();
        filtro.setTexto("oncologia");
        filtro.setEstado((short) 1);
        filtro.setTipos(List.of((short) 2));
        filtro.setLineas(List.of("Salud Pública"));
        filtro.setInstitucion("UCR");
        filtro.setOrdenFecha("desc");

        List<ProyectoDatosDTO> proyectos = List.of(
                new ProyectoDatosDTO(
                        1,
                        "CICES-777",
                        "Oncología comunitaria",
                        "Salud Pública",
                        "Investigación",
                        "ACTIVO",
                        LocalDate.of(2026, 5, 1),
                        LocalDate.of(2026, 12, 20)
                )
        );

        when(proyectoService.buscarConFiltros(
                eq("oncologia"),
                eq((short) 1),
                eq(List.of((short) 2)),
                eq(List.of("Salud Pública")),
                eq("UCR"),
                any(Pageable.class)
        )).thenReturn(new PageImpl<>(proyectos));

        ResponseEntity<byte[]> responseEsperado = ResponseEntity.ok(new byte[]{1, 2, 3});

        when(documentService.generarResponse(
                same(proyectosReportBuilder),
                eq(proyectos),
                eq("pdf"),
                eq("proyectos_reportes")
        )).thenReturn(responseEsperado);

        ResponseEntity<byte[]> response = service.generarReporte(filtro, "pdf");

        assertSame(responseEsperado, response);

        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);

        verify(proyectoService).buscarConFiltros(
                eq("oncologia"),
                eq((short) 1),
                eq(List.of((short) 2)),
                eq(List.of("Salud Pública")),
                eq("UCR"),
                pageableCaptor.capture()
        );

        Pageable pageable = pageableCaptor.getValue();

        assertEquals(0, pageable.getPageNumber());
        assertEquals(Integer.MAX_VALUE, pageable.getPageSize());

        Sort.Order ordenFechaInicio = pageable.getSort().getOrderFor("fechaInicio");

        assertNotNull(ordenFechaInicio);
        assertEquals(Sort.Direction.DESC, ordenFechaInicio.getDirection());

        verify(documentService).generarResponse(
                same(proyectosReportBuilder),
                eq(proyectos),
                eq("pdf"),
                eq("proyectos_reportes")
        );
    }
}