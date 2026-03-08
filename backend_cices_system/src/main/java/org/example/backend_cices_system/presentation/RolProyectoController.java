package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.service.RolProyectoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rol-proyecto")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RolProyectoController {
    private final RolProyectoService rolProyectoService;

    public RolProyectoController(RolProyectoService rolProyectoService) {
        this.rolProyectoService = rolProyectoService;
    }

    @GetMapping("/roles")
    public @ResponseBody
    String[] obtenerNombreRolesProyecto() {
        return rolProyectoService.obtenerNombreRolesProyecto().toArray(new String[0]);
    }

}
