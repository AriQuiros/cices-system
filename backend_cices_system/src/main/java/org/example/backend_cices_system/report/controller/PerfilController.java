package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.InvestigadorDetalleService;
import org.example.backend_cices_system.report.serviceVw.PerfilService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports/")
public class PerfilController {

    private final PerfilService perfilService;
    private final InvestigadorDetalleService investigadorDetalleService;

    public PerfilController(PerfilService perfilService, InvestigadorDetalleService investigadorDetalleService) {
        this.perfilService = perfilService;
        this.investigadorDetalleService = investigadorDetalleService;
    }

    @GetMapping("/perfil/empleado")
    public ResponseEntity<?> perfilEmpleado(Authentication authentication) {
        String username = (String) authentication.getPrincipal();
        var empleado = perfilService.obtenerPerfilEmpleado(username);
        return ResponseEntity.ok(empleado);
    }

    @GetMapping("/perfil/investigador")
    public ResponseEntity<?> perfilInvestigador (Authentication authentication) {
        String username = (String) authentication.getPrincipal();
        var investigador = perfilService.obtenerPerfilInvestigador(username);
        return ResponseEntity.ok(investigador);
    }

    @GetMapping("/investigadores/{identificacion}")
    public ResponseEntity<?> InvestigadorDetalle(
            @PathVariable String identificacion
    ) {
        return ResponseEntity.ok(investigadorDetalleService.obtenerInvestigador(identificacion));
    }
}
