package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.RepProyectoBaseService;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/proyectos")
public class RepProyectoBaseController {

    private final RepProyectoBaseService service;

    public RepProyectoBaseController(RepProyectoBaseService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<RepProyectoBase> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/codigo/{codigoProyecto}")
    public RepProyectoBase getByCodigoProyecto(@PathVariable String codigoProyecto) {
        return service.buscarPorCodigoProyecto(codigoProyecto);
    }
}
