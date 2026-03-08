package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.RepPersonaBaseService;
import org.example.backend_cices_system.report.view.RepPersonaBase;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/personas")
public class RepPersonaBaseController {

    private final RepPersonaBaseService service;

    public RepPersonaBaseController(RepPersonaBaseService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<RepPersonaBase> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/identificacion/{identificacion}")
    public RepPersonaBase getByIdentificacion(@PathVariable String identificacion) {
        return service.buscarPorIdentificacion(identificacion);
    }
}
