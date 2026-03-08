package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.service.RolService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rol-sistema")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RolController {
    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    @GetMapping
    public @ResponseBody
    String[] obtenerNombreRoles() {
        return rolService.obtenerNombreRoles().toArray(new String[0]);
    }

}
