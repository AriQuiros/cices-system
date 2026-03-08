package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.PerfilService;
import org.example.backend_cices_system.report.view.RepPersonaBase;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    private final PerfilService perfilService;

    public PerfilController(PerfilService perfilService) {
        this.perfilService = perfilService;
    }

    @GetMapping("/empleado/{identificacion}")
    public RepPersonaBase perfilEmpleado(
            @PathVariable String identificacion
    ) {
        return perfilService.obtenerPerfilEmpleado(identificacion);
    }

    @GetMapping("/usuario/{identificacion}")
    public Map<String, Object> perfilUsuario(
            @PathVariable String identificacion
    ) {
        return perfilService.obtenerPerfilUsuario(identificacion);
    }

    @GetMapping("/investigador/{identificacion}")
    public Map<String, Object> perfilInvestigador(
            @PathVariable String identificacion
    ) {
        return perfilService.obtenerPerfilInvestigador(identificacion);
    }
}
