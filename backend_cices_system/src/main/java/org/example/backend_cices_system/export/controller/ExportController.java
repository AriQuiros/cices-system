package org.example.backend_cices_system.export.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.consult.investigador.dto.CertificacionFiltroDTO;
import org.example.backend_cices_system.consult.proyecto.dto.ProyectoFiltroDTO;
import org.example.backend_cices_system.export.service.ExportService;
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

    @GetMapping("/test-word")
    public ResponseEntity<byte[]> testWord() {

        ProyectoFiltroDTO filtro = new ProyectoFiltroDTO(null, null, null, null, "desc");

        return exportService.generarReporteProyectos(filtro, "docx");
    }

}

