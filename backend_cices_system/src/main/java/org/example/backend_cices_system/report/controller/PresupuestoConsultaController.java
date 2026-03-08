package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.audit.PresupuestoBit;
import org.example.backend_cices_system.report.serviceVw.PresupuestoConsultaService;
import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.example.backend_cices_system.report.view.RepPresupuestoGastos;
import org.example.backend_cices_system.report.view.RepPresupuestoHoras;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author angie
 */
@RestController
@RequestMapping("/api/reports/presupuestos")
public class PresupuestoConsultaController {

    private final PresupuestoConsultaService presupuestoService;

    public PresupuestoConsultaController(PresupuestoConsultaService presupuestoService) {
        this.presupuestoService = presupuestoService;
    }

    @GetMapping("/proyecto/{codigo}/base")
    public List<RepPresupuestoBase> presupuestos(@PathVariable String codigo) {
        return presupuestoService.obtenerPresupuestosProyecto(codigo);
    }

    @GetMapping("/proyecto/{codigo}/historial")
    public List<PresupuestoBit> historial(@PathVariable String codigo) {
        return presupuestoService.obtenerHistorialPresupuesto(codigo);
    }

    @GetMapping("/proyecto/{codigo}/gastos")
    public List<RepPresupuestoGastos> gastos(@PathVariable String codigo) {
        return presupuestoService.obtenerGastosProyecto(codigo);
    }

    @GetMapping("/proyecto/{codigo}/horas")
    public List<RepPresupuestoHoras> horas(@PathVariable String codigo) {
        return presupuestoService.obtenerHorasProyecto(codigo);
    }
}
