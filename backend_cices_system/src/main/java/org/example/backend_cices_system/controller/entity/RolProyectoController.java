package org.example.backend_cices_system.controller.entity;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.entity.RolProyectoDTO;
import org.example.backend_cices_system.service.entity.RolProyectoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rol-proyecto")
public class RolProyectoController {
    private final RolProyectoService rolProyectoService;

    @GetMapping("/roles")
    public @ResponseBody
    List<RolProyectoDTO> obtenerNombreRolesProyecto() {
        return rolProyectoService.obtenerRolesProyectoDTO();
    }

}
