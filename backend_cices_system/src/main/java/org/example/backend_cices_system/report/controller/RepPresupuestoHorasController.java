package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.dto.PresupuestoHorasDTO;
import org.example.backend_cices_system.report.serviceVw.RepPresupuestoHorasService;
import org.example.backend_cices_system.report.view.RepPresupuestoHoras;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes/presupuesto-horas")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RepPresupuestoHorasController {

    private final RepPresupuestoHorasService service;

    public RepPresupuestoHorasController(RepPresupuestoHorasService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<RepPresupuestoHoras> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/codigo/{codigoProyecto}")
    public List<RepPresupuestoHoras> getByCodigoProyecto(@PathVariable String codigoProyecto) {
        return service.buscarPorCodigoProyecto(codigoProyecto);
    }

    @GetMapping("/{codigoProyecto}")
    public List<PresupuestoHorasDTO> getDistribucionHoras(@PathVariable String codigoProyecto) {
        return service.horasPresupuesto(codigoProyecto);
    }
}
