package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.data.RolRepository;
import org.example.backend_cices_system.logic.Rol;

import org.example.backend_cices_system.data.RolRepository;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.logic.Rol;
import org.example.backend_cices_system.service.CatalogoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/catalogos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CatalogoController {
    @Autowired
    private RolRepository rolRepository;

    @GetMapping("/roles")
    public ResponseEntity<List<Rol>> obtenerRoles() {
        return ResponseEntity.ok(rolRepository.findAll());
    }
    @Autowired
    private CatalogoService catalogoService;

    @PostMapping("/tipos_registro_proyecto")
    public ResponseEntity<Map<String, List<CodigoDTO>>> obtenerPorTipos(@RequestBody List<String> tipos) {
        return ResponseEntity.ok(catalogoService.obtenerCodigosPorTipos(tipos));
    }

    @GetMapping("/grados_academicos")
    public ResponseEntity<List<CodigoDTO>> obtenerGradosAcademicos() {
        return ResponseEntity.ok(catalogoService.obtenerGradosAcademicos());
    }

    @GetMapping("/tipos_identificacion")
    public ResponseEntity<List<CodigoDTO>> obtenerTiposIdentificacion() {
        return ResponseEntity.ok(catalogoService.obtenerTiposIdentificacion());
    }
}
