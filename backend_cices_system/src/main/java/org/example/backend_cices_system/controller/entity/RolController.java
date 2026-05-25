package org.example.backend_cices_system.controller.entity;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.entity.RolDTO;
import org.example.backend_cices_system.service.entity.RolService;
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
