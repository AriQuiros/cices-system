package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.filter.CertificacionFiltroDTO;
import org.example.backend_cices_system.report.filter.ProyectoFiltroDTO;
import org.example.backend_cices_system.report.serviceVw.ExportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/exportar")
public class ExportController {

    private final ExportService exportService;

    @PostMapping("/reporte-certificaciones")
    public ResponseEntity<byte[]> exportar(
            @RequestBody CertificacionFiltroDTO filtro,
            @RequestParam String formato
    ) {
        return exportService.generarReporteCertificaciones(filtro, formato);
    }


    @PostMapping("/reporte-proyectos")
    public ResponseEntity<byte[]> exportar(
            @RequestBody ProyectoFiltroDTO filtro,
            @RequestParam String formato
    ) {
        return exportService.generarReporteProyectos(filtro, formato);
    }

    @GetMapping("/test-word")
    public ResponseEntity<byte[]> testWord() {

        ProyectoFiltroDTO filtro = new ProyectoFiltroDTO(null, null, null, null, "desc");

        return exportService.generarReporteProyectos(filtro, "docx");
    }

}

