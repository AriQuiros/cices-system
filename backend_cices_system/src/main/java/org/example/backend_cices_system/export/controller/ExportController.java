package org.example.backend_cices_system.export.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.consult.investigador.dto.CertificacionFiltroDTO;
import org.example.backend_cices_system.consult.proyecto.dto.ProyectoFiltroDTO;
import org.example.backend_cices_system.export.dto.ReporteParticipantesDTO;
import org.example.backend_cices_system.export.dto.ReportePresupuestosListadoDTO;
import org.example.backend_cices_system.export.service.ExportService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/exportar")
public class ExportController {

    private final ExportService exportService;

    @GetMapping("/reporte-certificaciones")
    public ResponseEntity<byte[]> exportar(
            @ModelAttribute CertificacionFiltroDTO filtro,
            @RequestParam String formato
    ) {
        return exportService.generarReporteCertificaciones(filtro, formato);
    }

    @GetMapping("/reporte-proyectos")
    public ResponseEntity<byte[]> exportar(
            @ModelAttribute ProyectoFiltroDTO filtro,
            @RequestParam String formato
    ) {
        return exportService.generarReporteProyectos(filtro, formato);
    }

    // PARTICIPANTES
    @GetMapping("/listar-participantes")
    public Page<ReporteParticipantesDTO> listarParticipantes(
            @ModelAttribute ProyectoFiltroDTO filtro,
            @PageableDefault(size = 8) Pageable pageable,
            @RequestParam(defaultValue = "5") int limite
    ) {
        return exportService.paginadoParticipantes(filtro, pageable,limite);
    }

    @GetMapping("/reporte-participantes")
    public ResponseEntity<byte[]> exportarParticipantes(
            @ModelAttribute ProyectoFiltroDTO filtro,
            @RequestParam String formato
    ) {
        return exportService.generarReporteParticipantes(filtro, formato);
    }

    // ── PRESUPUESTOS ──────────────────────────────────────────────────────────

    @GetMapping("/listar-presupuestos")
    public Page<ReportePresupuestosListadoDTO> listarPresupuestos(
            @ModelAttribute ProyectoFiltroDTO filtro,
            @PageableDefault(size = 8) Pageable pageable,
            @RequestParam(defaultValue = "5") int limite
    ) {
        return exportService.paginadoPresupuestos(filtro, pageable, limite);
    }

    @GetMapping("/reporte-presupuestos")
    public ResponseEntity<byte[]> exportarPresupuestos(
            @ModelAttribute ProyectoFiltroDTO filtro,
            @RequestParam String formato
    ) {
        return exportService.generarReportePresupuestos(filtro, formato);
    }
}

