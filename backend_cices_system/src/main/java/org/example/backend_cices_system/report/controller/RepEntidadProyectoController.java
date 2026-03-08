package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.RepEntidadProyectoService;
import org.example.backend_cices_system.report.view.RepEntidadProyecto;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/entidades")
public class RepEntidadProyectoController {

    private final RepEntidadProyectoService service;

    public RepEntidadProyectoController(RepEntidadProyectoService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<RepEntidadProyecto> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/codigo/{codigoProyecto}")
    public List<RepEntidadProyecto> getByCodigoProyecto(@PathVariable String codigoProyecto) {
        return service.buscarPorCodigoProyecto(codigoProyecto);
    }
}
