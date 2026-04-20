package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.serviceVw.RepPresupuestoHorasService;
import org.example.backend_cices_system.reportes.dto.HorasAsignadasReporteDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consulta/presupuesto-horas")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RepPresupuestoHorasController {

    private final RepPresupuestoHorasService service;

    @GetMapping("/{idPresupuesto}")
    public List<HorasAsignadasReporteDTO> getDistribucionHoras(@PathVariable Integer idPresupuesto) {
        return service.buscarPorIdPresupuesto(idPresupuesto);
    }
}
