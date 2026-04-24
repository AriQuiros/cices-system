package org.example.backend_cices_system.modules.presupuesto.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.presupuesto.dto.PresupuestoDTO;
import org.example.backend_cices_system.modules.proyecto.model.Proyecto;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.example.backend_cices_system.modules.presupuesto.service.PresupuestoService;
import org.example.backend_cices_system.modules.proyecto.service.ProyectoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/presupuestos")
public class PresupuestoController {

    private final PresupuestoService presupuestoService;
    private final ProyectoService proyectoService;

    @PostMapping("/{codigoProyecto}/registrar")
    public ResponseEntity<Integer> registrarPresupuesto(
            @PathVariable String codigoProyecto,
            @RequestBody @Valid List<PresupuestoDTO> listDto) {
        Proyecto proyecto = proyectoService.obtenerProyectoPorCodigo(codigoProyecto);
        var cant = presupuestoService.guardarPresupuesto(listDto, proyecto);
        return ResponseEntity.ok(cant);
    }

    @PostMapping("/actualizar")
    public ResponseEntity<?> actualizarPresupuesto(
            @RequestBody @Valid PresupuestoDTO dto,
            Authentication authentication) {
        var usuario = (Usuario) authentication.getPrincipal();
        var presupuesto = presupuestoService.actualizarPresupuesto(dto, usuario);
        return ResponseEntity.ok(presupuesto);
    }

    @GetMapping("/obtener/{id}")
    public ResponseEntity<?> obtenerPresupuesto(@PathVariable Integer id){
        var presupuesto = presupuestoService.obtenerPresupuesto(id);
        var dto = presupuestoService.obtenerDTO(presupuesto);
        return ResponseEntity.ok(dto);
    }


}