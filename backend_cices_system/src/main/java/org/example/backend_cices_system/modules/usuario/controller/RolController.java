package org.example.backend_cices_system.modules.usuario.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.usuario.dto.RolDTO;
import org.example.backend_cices_system.modules.usuario.service.RolService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rol-sistema")
public class RolController {
    private final RolService rolService;

    @GetMapping
    public @ResponseBody
    List<RolDTO> obtenerNombreRoles() {
        return rolService.obtenerRolesDTO();
    }

}
