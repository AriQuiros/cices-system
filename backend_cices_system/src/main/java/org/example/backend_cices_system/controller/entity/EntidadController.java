package org.example.backend_cices_system.controller.entity;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.entity.EntidadDTO;
import org.example.backend_cices_system.service.entity.EntidadService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/entidades")
public class EntidadController {

    private final EntidadService entidadService;

    @GetMapping("/buscar")
    public List<EntidadDTO> buscar(
            @RequestParam(required = false, defaultValue = "") String nombre,
            @RequestParam(required = false, defaultValue = "INSTITUCION") String tipo
    ) {
        return entidadService.buscarPorNombreYTipo(nombre, tipo);
    }
}
