package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.filter.CertificacionFiltroDTO;
import org.example.backend_cices_system.report.serviceVw.RepInvestigadorCertificacionesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports/certificaciones")
@RequiredArgsConstructor
public class RepInvestigadorCertificacionesController {

    private final RepInvestigadorCertificacionesService service;

    @PostMapping("/filtrar")
    public ResponseEntity<?> filtrar(@RequestBody CertificacionFiltroDTO filtro,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size
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
