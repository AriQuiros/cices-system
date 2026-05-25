package org.example.backend_cices_system.controller.view;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.service.view.RepResumenEjecutivoService;
import org.example.backend_cices_system.model.view.RepResumenEjecutivo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/resumen-ejecutivo")
public class RepResumenEjecutivoController {

    private final RepResumenEjecutivoService service;

    @GetMapping
    public List<RepResumenEjecutivo> getAll() {
        return service.obtenerTodos();
    }
}
