package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dto.PresupuestoFinancieroDTO;
import org.example.backend_cices_system.report.serviceVw.RepPresupuestoGastosService;
import org.example.backend_cices_system.report.view.RepPresupuestoGastos;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reportes/gastos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RepPresupuestoGastosController {

    private final RepPresupuestoGastosService service;

    @GetMapping("/all")
    public List<RepPresupuestoGastos> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/codigo/{idPresupuesto}")
    public List<RepPresupuestoGastos> getByCodigoProyecto(@PathVariable Integer idPresupuesto) {
        return service.buscarPorIdPresupuesto(idPresupuesto);
    }

    @GetMapping("/{codigoProyecto}")
    public List<PresupuestoFinancieroDTO> getGastos(@PathVariable String codigoProyecto) {
        return service.gastosPresupuesto(codigoProyecto);
    }
}
