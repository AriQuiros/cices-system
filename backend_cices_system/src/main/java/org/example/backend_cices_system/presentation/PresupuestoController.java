package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import org.example.backend_cices_system.dto.PresupuestoDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.service.PresupuestoService;
import org.example.backend_cices_system.service.ProyectoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/presupuestos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PresupuestoController {

    private final PresupuestoService presupuestoService;
    private final ProyectoService proyectoService;

    public PresupuestoController(PresupuestoService presupuestoService, ProyectoService proyectoService) {
        this.presupuestoService = presupuestoService;
        this.proyectoService = proyectoService;
    }

    @PostMapping("/{codigoProyecto}/registrar")
    public ResponseEntity<Integer> registrarPresupuesto(
            @PathVariable String codigoProyecto,
            @RequestBody @Valid List<PresupuestoDTO> listDto) {
        Proyecto proyecto = proyectoService.buscarProyectoPorCodigo(codigoProyecto);
        var cant = presupuestoService.guardarPresupuesto(listDto, proyecto);
        return ResponseEntity.ok(cant);
    }

    @GetMapping("/{codigoProyecto}")
    public ResponseEntity<?> obtenerPresupuesto(@PathVariable String codigoProyecto) {
        Proyecto proyecto = proyectoService.buscarProyectoPorCodigo(codigoProyecto);
        var presupuestos = presupuestoService.obtenerPresupuestosPorProyecto(proyecto);
        return ResponseEntity.ok(presupuestos);
    }

}