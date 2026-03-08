package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.RepProyectoPresentacionInformeService;
import org.example.backend_cices_system.report.view.RepProyectoPresentacionInforme;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/Informes")
public class RepProyectoPresentacionInformeController {

    private final RepProyectoPresentacionInformeService service;

    public RepProyectoPresentacionInformeController(RepProyectoPresentacionInformeService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<RepProyectoPresentacionInforme> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/codigo/{codigoProyecto}")
    public List<RepProyectoPresentacionInforme> getByCodigoProyecto(@PathVariable String codigoProyecto) {
        return service.buscarPorCodigoProyecto(codigoProyecto);
    }
}
