package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.RepInvestigadorTitulosService;
import org.example.backend_cices_system.report.view.RepInvestigadorTitulos;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/titulos")
public class RepInvestigadorTitulosController {

    private final RepInvestigadorTitulosService service;

    public RepInvestigadorTitulosController(RepInvestigadorTitulosService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<RepInvestigadorTitulos> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/identificacion/{identificacion}")
    public List<RepInvestigadorTitulos> getByIdentificacion(@PathVariable String identificacion) {
        return service.buscarPorIdentificacion(identificacion);
    }
}
