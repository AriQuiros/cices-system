package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.dto.PresupuestoFinancieroDTO;
import org.example.backend_cices_system.report.serviceVw.RepPresupuestoGastosService;
import org.example.backend_cices_system.report.view.RepPresupuestoGastos;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes/gastos")
public class RepPresupuestoGastosController {

    private final RepPresupuestoGastosService service;

    public RepPresupuestoGastosController(RepPresupuestoGastosService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<RepPresupuestoGastos> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/codigo/{codigoProyecto}")
    public List<RepPresupuestoGastos> getByCodigoProyecto(@PathVariable String codigoProyecto) {
        return service.buscarPorCodigoProyecto(codigoProyecto);
    }

    @GetMapping("/{codigoProyecto}")
    public List<PresupuestoFinancieroDTO> getGastos(@PathVariable String codigoProyecto) {
        return service.gastosPresupuesto(codigoProyecto);
    }
}
