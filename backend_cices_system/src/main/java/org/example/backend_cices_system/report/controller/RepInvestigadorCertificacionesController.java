package org.example.backend_cices_system.report.controller;

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

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.obtenerTodasCertificaciones());
    }

    @GetMapping("/identificacion/{identificacion}")
    public List<RepInvestigadorCertificaciones> getByIdentificacion(@PathVariable String identificacion) {
        return service.buscarPorIdentificacion(identificacion);
    }
}
