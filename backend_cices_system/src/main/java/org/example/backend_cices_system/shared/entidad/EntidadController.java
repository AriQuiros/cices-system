package org.example.backend_cices_system.shared.entidad;

import lombok.RequiredArgsConstructor;
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
