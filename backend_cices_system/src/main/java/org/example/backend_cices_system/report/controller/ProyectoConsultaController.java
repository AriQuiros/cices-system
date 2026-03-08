package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.ProyectoConsultaService;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * @author angie
 */
@RestController
@RequestMapping("/api/reports/proyectos")
public class ProyectoConsultaController {

    private final ProyectoConsultaService proyectoService;

    public ProyectoConsultaController(ProyectoConsultaService proyectoService) {
        this.proyectoService = proyectoService;
    }

    @GetMapping("/{codigo}/basico")
    public RepProyectoBase obtenerBasico(@PathVariable String codigo) {
        return proyectoService.obtenerProyectoBasico(codigo);
    }

    @GetMapping("/{codigo}/completo")
    public Map<String, Object> obtenerCompleto(@PathVariable String codigo) {
        return proyectoService.obtenerProyectoCompleto(codigo);
    }
}

