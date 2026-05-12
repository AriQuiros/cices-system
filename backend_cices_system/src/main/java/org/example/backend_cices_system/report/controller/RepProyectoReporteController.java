package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.report.dto.ProyectoFiltroDTO;
import org.example.backend_cices_system.report.serviceVw.RepProyectoReporteService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports/proyectos")
public class RepProyectoReporteController {

    private final RepProyectoReporteService service;

    public RepProyectoReporteController(RepProyectoReporteService service) {
        this.service = service;
    }

    /**
     * Genera y descarga el reporte en el formato indicado.
     * POST /api/reports/proyectos/reporte/exportar?formato=pdf
     *
     * Formatos soportados: pdf | xlsx | docx
     *
     * Response headers:
     *   Content-Type:        application/pdf  (o según formato)
     *   Content-Disposition: attachment; filename=proyectos.pdf
     */
    @PostMapping("/exportar")
    public ResponseEntity<byte[]> exportar(
            @RequestBody ProyectoFiltroDTO filtro,
            @RequestParam String formato
    ) {
        return service.generarReporte(filtro, formato);
    }
}