package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.InvestigadorDetalleService;
import org.example.backend_cices_system.report.serviceVw.PerfilService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports/investigadores")
public class InvestigadorDetalle {

    private final PerfilService perfilService;
    private final InvestigadorDetalleService investigadorDetalleService;

    public InvestigadorDetalle(PerfilService perfilService, InvestigadorDetalleService investigadorDetalleService) {
        this.perfilService = perfilService;
        this.investigadorDetalleService = investigadorDetalleService;
    }

    @GetMapping("/empleado/{identificacion}")
    public ResponseEntity<?> perfilEmpleado(
            @PathVariable String identificacion
    ) {
        return ResponseEntity.ok(perfilService.obtenerPerfilEmpleado(identificacion));
    }

    @GetMapping("/usuario/{identificacion}")
    public Map<String, Object> perfilUsuario(
            @PathVariable String identificacion
    ) {
        return perfilService.obtenerPerfilUsuario(identificacion);
    }

    @GetMapping("/{identificacion}")
    public ResponseEntity<?> perfilInvestigador(
            @PathVariable String identificacion
    ) {
        return ResponseEntity.ok(investigadorDetalleService.obtenerInvestigador(identificacion));
    }
}
