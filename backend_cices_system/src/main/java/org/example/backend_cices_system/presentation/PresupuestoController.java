package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.PresupuestoDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.service.PresupuestoService;
import org.example.backend_cices_system.service.ProyectoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/presupuestos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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

    @GetMapping("/{codigoProyecto}")
    public ResponseEntity<?> obtenerPresupuestosProyecto(@PathVariable String codigoProyecto) {
        Proyecto proyecto = proyectoService.obtenerProyectoPorCodigo(codigoProyecto);
        var presupuestos = presupuestoService.obtenerPresupuestosPorProyecto(proyecto);
        return ResponseEntity.ok(presupuestos);
    }

    @GetMapping("/obtener/{id}")
    public ResponseEntity<?> obtenerPresupuesto(@PathVariable Integer id){
        var presupuesto = presupuestoService.obtenerPresupuesto(id);
        var dto = presupuestoService.obtenerDTO(presupuesto);
        return ResponseEntity.ok(dto);
    }


}