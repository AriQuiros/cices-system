package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.serviceVw.RepResumenEjecutivoService;
import org.example.backend_cices_system.report.view.RepResumenEjecutivo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports/resumen")
public class RepResumenEjecutivoController {

    private final RepResumenEjecutivoService service;

    @GetMapping
    public List<RepResumenEjecutivo> getAll() {
        return service.obtenerTodos();
    }
}
