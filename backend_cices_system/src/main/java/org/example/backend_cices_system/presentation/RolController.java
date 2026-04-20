package org.example.backend_cices_system.presentation;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.RolDTO;
import org.example.backend_cices_system.service.RolService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rol-sistema")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RolController {
    private final RolService rolService;

    @GetMapping
    public @ResponseBody
    List<RolDTO> obtenerNombreRoles() {
        return rolService.obtenerRolesDTO();
    }

}
