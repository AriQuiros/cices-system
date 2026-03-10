package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.dto.RolDTO;
import org.example.backend_cices_system.service.RolService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    List<RolDTO> obtenerNombreRoles() {
        return rolService.obtenerRolesDTO();
    }

}
