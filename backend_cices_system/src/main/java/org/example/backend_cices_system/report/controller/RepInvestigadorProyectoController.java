package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.RepInvestigadorProyectoService;
import org.example.backend_cices_system.report.view.RepInvestigadorProyecto;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/investigadorProyecto")
public class RepInvestigadorProyectoController {

    private final RepInvestigadorProyectoService service;

    public RepInvestigadorProyectoController(RepInvestigadorProyectoService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<RepInvestigadorProyecto> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/identificacion/{identificacion}")
    public List<RepInvestigadorProyecto> getByIdentificacion(@PathVariable String identificacion) {
        return service.buscarPorIdentificacionInvestigador(identificacion);
    }
}
