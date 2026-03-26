package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.dto.CertificacionFiltroDTO;
import org.example.backend_cices_system.report.serviceVw.RepInvestigadorCertificacionesService;
import org.example.backend_cices_system.report.view.RepInvestigadorCertificaciones;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/certificaciones")
public class RepInvestigadorCertificacionesController {

    private final RepInvestigadorCertificacionesService service;

    public RepInvestigadorCertificacionesController(RepInvestigadorCertificacionesService service) {
        this.service = service;
    }

    @PostMapping("/filtrar")
    public ResponseEntity<?> filtrar(@RequestBody CertificacionFiltroDTO filtro,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(service.filtrarCertificacionesPaginado(filtro, page, size));
    }

    @PostMapping("/reporte")
    public ResponseEntity<byte[]> exportar(
            @RequestBody CertificacionFiltroDTO filtro,
            @RequestParam String formato
    ) {
        return service.generarReporte(filtro, formato);
    }
}
