package org.example.backend_cices_system.service;

import org.example.backend_cices_system.consult.presupuesto.dto.PresupuestoFiltroDTO;
import org.example.backend_cices_system.consult.proyecto.dto.ProyectoFiltroDTO;
import org.example.backend_cices_system.export.builder.PresupuestosReportBuilder;
import org.example.backend_cices_system.export.dto.*;
import org.example.backend_cices_system.export.service.DocumentService;
import org.example.backend_cices_system.export.service.ExportService;
import org.example.backend_cices_system.export.service.PresupuestoReporteOrquestador;
import org.example.backend_cices_system.modules.proyecto.dto.ProyectoFechasDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExportServiceTest {

    @Mock
    private DocumentService documentService;

    @Mock
    private PresupuestosReportBuilder presupuestosReportBuilder;

    @Mock
    private PresupuestoReporteOrquestador presupuestoReporteOrquestador;

    @InjectMocks
    private ExportService exportService;

    private ProyectoFiltroDTO filtroProyecto;
    private PresupuestoFiltroDTO filtroPresupuesto;

    @BeforeEach
    void setUp() {
        filtroProyecto = new ProyectoFiltroDTO(
                "",
                "Activo",
                List.of(),
                List.of(),
                ""
        );

        filtroPresupuesto = new PresupuestoFiltroDTO(
                "",
                "",
                "",
                List.of(),
                List.of("Transporte", "Alimentacion"),
                LocalDate.of(2021,1,1),
                null

        );
    }


    @Test
    void generarReportePresupuestos_debeRetornarResponseCorrecto() {



        ProyectoFechasDTO proyecto = new ProyectoFechasDTO(
                "CICES-001",
                "Sistema Presupuestario",
                LocalDate.of(2020,1,1),
                LocalDate.now()
        );

        GastoReporteDTO gasto = new GastoReporteDTO(
                1,
                "Compra de equipos",
                BigDecimal.valueOf(500000),
                LocalDate.of(2025,2,10)
        );

        HorasAsignadasReporteDTO horas = new HorasAsignadasReporteDTO(
                1,
                20,
                "Juan Pérez",
                "Investigador",
                "Desarrollador",
                LocalDate.of(2025,1,1),
                LocalDate.of(2025,6,1),
                "20 horas",
                20.0,
                (short)6,
                BigDecimal.valueOf(120)
        );

        PresupuestoResumenReporteDTO resumen = mock(PresupuestoResumenReporteDTO.class);

        PresupuestoReporteDTO presupuesto = new PresupuestoReporteDTO(
                1,
                "Equipo",
                "Compra de computadoras",
                "Financiero",
                LocalDate.of(2025,1,15),
                "Concursable",
                BigDecimal.valueOf(40),
                (short)12,
                BigDecimal.valueOf(2000000),
                resumen,
                List.of(gasto),
                List.of(horas)
        );

        BitacoraPresupuestoReporteDTO bitacoraPresupuesto =
                new BitacoraPresupuestoReporteDTO(
                        LocalDate.now(),
                        "ACTUALIZACION",
                        "admin",
                        "1000000",
                        "20",
                        "6",
                        1
                );

        BitacoraGastoReporteDTO bitacoraGasto =
                new BitacoraGastoReporteDTO(
                        LocalDate.now(),
                        "Actualizacion",
                        "admin",
                        "50000",
                        LocalDate.now(),
                        "Gasto actiualizado",
                        1,
                        10
                );

        PresupuestoConBitacorasReporteDTO presupuestoCompleto =
                new PresupuestoConBitacorasReporteDTO(
                        presupuesto,
                        List.of(bitacoraPresupuesto),
                        List.of(bitacoraGasto)
                );

        ReportePresupuestosExportDTO reporte =
                new ReportePresupuestosExportDTO(
                        proyecto,
                        List.of(presupuestoCompleto)
                );

        List<ReportePresupuestosExportDTO> data = List.of(reporte);

        ResponseEntity<byte[]> response =
                ResponseEntity.ok(new byte[]{1,2,3});

        when(presupuestoReporteOrquestador.generarCompleto(
                filtroProyecto,
                filtroPresupuesto
        )).thenReturn(data);

        when(documentService.generarResponse(
                presupuestosReportBuilder,
                data,
                "pdf",
                "reporte_presupuestos"
        )).thenReturn(response);

        ResponseEntity<byte[]> resultado =
                exportService.generarReportePresupuestos(
                        filtroProyecto,
                        filtroPresupuesto,
                        "pdf"
                );

        assertEquals(response, resultado);

        verify(presupuestoReporteOrquestador)
                .generarCompleto(filtroProyecto, filtroPresupuesto);

        verify(documentService)
                .generarResponse(
                        presupuestosReportBuilder,
                        data,
                        "pdf",
                        "reporte_presupuestos"
                );
    }

    @Test
    void generarReportePresupuestos_sinDatos_debeGenerarReporteVacio() {

        when(presupuestoReporteOrquestador.generarCompleto(any(), any()))
                .thenReturn(List.of());

        ResponseEntity<byte[]> response =
                ResponseEntity.ok(new byte[]{});

        when(documentService.generarResponse(
                any(),
                any(),
                any(),
                any()
        )).thenReturn(response);

        ResponseEntity<byte[]> resultado =
                exportService.generarReportePresupuestos(
                       filtroProyecto,
                       filtroPresupuesto,
                        "pdf"
                );

        assertEquals(response, resultado);
    }

    @Test
    void generarReportePresupuestos_formatoInvalido_debeLanzarExcepcion() {

        when(presupuestoReporteOrquestador.generarCompleto(
                any(),
                any()
        )).thenReturn(List.of());

        when(documentService.generarResponse(
                any(),
                any(),
                eq("txt"),
                any()
        )).thenThrow(
                new IllegalArgumentException("Formato no soportado")
        );

        IllegalArgumentException exception =
                org.junit.jupiter.api.Assertions.assertThrows(
                        IllegalArgumentException.class,
                        () -> exportService.generarReportePresupuestos(
                                filtroProyecto,
                                filtroPresupuesto,
                                "txt"
                        )
                );

        assertEquals("Formato no soportado", exception.getMessage());
    }

    @Test
    void generarReportePresupuestos_conListasVacias_noDebeFallar() {

        ProyectoFechasDTO proyecto = new ProyectoFechasDTO(
                "CICES-001",
                "Proyecto Vacío",
                LocalDate.now(),
                LocalDate.now()
        );

        PresupuestoResumenReporteDTO resumen =
                mock(PresupuestoResumenReporteDTO.class);

        PresupuestoReporteDTO presupuesto = new PresupuestoReporteDTO(
                1,
                "Equipo",
                "Sin datos",
                "Financiero",
                LocalDate.now(),
                "Interno",
                BigDecimal.ZERO,
                (short)0,
                BigDecimal.ZERO,
                resumen,
                List.of(),
                List.of()
        );

        PresupuestoConBitacorasReporteDTO presupuestoCompleto =
                new PresupuestoConBitacorasReporteDTO(
                        presupuesto,
                        List.of(),
                        List.of()
                );

        ReportePresupuestosExportDTO reporte =
                new ReportePresupuestosExportDTO(
                        proyecto,
                        List.of(presupuestoCompleto)
                );

        List<ReportePresupuestosExportDTO> data = List.of(reporte);

        ResponseEntity<byte[]> response =
                ResponseEntity.ok(new byte[]{1});

        when(presupuestoReporteOrquestador.generarCompleto(any(), any()))
                .thenReturn(data);

        when(documentService.generarResponse(
                any(),
                any(),
                any(),
                any()
        )).thenReturn(response);

        ResponseEntity<byte[]> resultado =
                exportService.generarReportePresupuestos(
                        filtroProyecto,
                        filtroPresupuesto,
                        "pdf"
                );

        assertEquals(response, resultado);
    }

    @Test
    void paginadoPresupuestos_debeRetornarPaginaCorrecta() {

        Pageable pageable = PageRequest.of(0, 5);

        Page<ReportePresupuestosListadoDTO> pagina =
                new PageImpl<>(List.of(
                        mock(ReportePresupuestosListadoDTO.class)
                ));

        when(presupuestoReporteOrquestador.paginado(
                filtroProyecto,
                filtroPresupuesto,
                pageable,
                5
        )).thenReturn(pagina);

        Page<ReportePresupuestosListadoDTO> resultado =
                exportService.paginadoPresupuestos(
                        filtroProyecto,
                        filtroPresupuesto,
                        pageable,
                        5
                );

        assertEquals(pagina, resultado);
    }

}

