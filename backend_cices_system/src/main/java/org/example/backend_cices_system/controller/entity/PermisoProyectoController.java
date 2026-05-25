package org.example.backend_cices_system.controller.entity;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.entity.PermisoProyectoDTO;
import org.example.backend_cices_system.service.entity.PermisoProyectoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/permiso-proyecto")
public class PermisoProyectoController {

    private final PermisoProyectoService permisoProyectoService;

    @GetMapping("/obtener/{codigoProyecto}")
    public ResponseEntity<?> obtenerPorProyecto(@PathVariable String codigoProyecto){
        var permisosProyecto = permisoProyectoService.obtenerDTOsPorCodigoProyecto(codigoProyecto);
        return ResponseEntity.ok(permisosProyecto);
    }

    @PostMapping("/otorgar")
    public ResponseEntity<?> create(@RequestBody PermisoProyectoDTO permiso) {
        return ResponseEntity.ok(permisoProyectoService.save(permiso));
    }

    @DeleteMapping("/remover/{id}")
    public void delete(@PathVariable Integer id) {
        permisoProyectoService.delete(id);
    }
}