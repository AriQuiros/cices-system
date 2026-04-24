package org.example.backend_cices_system.consult.resumenEjecutivo;

import lombok.RequiredArgsConstructor;
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
