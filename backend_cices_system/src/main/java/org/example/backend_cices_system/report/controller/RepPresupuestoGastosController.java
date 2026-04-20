package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.serviceVw.RepPresupuestoGastosService;
import org.example.backend_cices_system.reportes.dto.GastoReporteDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consulta/gastos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RepPresupuestoGastosController {

    private final RepPresupuestoGastosService service;

   @GetMapping("/{idPresupuesto}")
    public List<GastoReporteDTO> obtenerGastosPorPresupuesto(@PathVariable Integer idPresupuesto) {
        return service.buscarPorIdPresupuesto(idPresupuesto);
    }
}
