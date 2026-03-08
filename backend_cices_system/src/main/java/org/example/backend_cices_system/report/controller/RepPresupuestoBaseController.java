package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.RepPresupuestoBaseService;
import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/presupuestos")
public class RepPresupuestoBaseController {

    private final RepPresupuestoBaseService service;

    public RepPresupuestoBaseController(RepPresupuestoBaseService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<RepPresupuestoBase> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/codigo/{codigoProyecto}")
    public List<RepPresupuestoBase> getByCodigoProyecto(@PathVariable String codigoProyecto) {
        return service.buscarPorCodigoProyecto(codigoProyecto);
    }
}
