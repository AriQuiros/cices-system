package org.example.backend_cices_system.modules.investigadorProyecto.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.investigadorProyecto.dto.RolProyectoDTO;
import org.example.backend_cices_system.modules.investigadorProyecto.service.RolProyectoService;
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
