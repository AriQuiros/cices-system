package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.RepProyectoResultadosService;
import org.example.backend_cices_system.report.view.RepProyectoResultados;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/proyectoResultados")
public class RepProyectoResultadosController {

    private final RepProyectoResultadosService service;

    public RepProyectoResultadosController(RepProyectoResultadosService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<RepProyectoResultados> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/codigo/{codigoProyecto}")
    public List<RepProyectoResultados> getByCodigoProyecto(@PathVariable String codigoProyecto) {
        return service.buscarPorCodigoProyecto(codigoProyecto);
    }
}
