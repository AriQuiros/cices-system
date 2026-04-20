package org.example.backend_cices_system.presentation;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.CodigoDTO;

import org.example.backend_cices_system.service.CatalogoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/catalogos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CatalogoController {
    private final CatalogoService catalogoService;

    @PostMapping("/tipos")
    public ResponseEntity<Map<String, List<CodigoDTO>>> obtenerPorTipos(@RequestBody List<String> tipos) {
        return ResponseEntity.ok(catalogoService.obtenerCodigosPorTipos(tipos));
    }

    @GetMapping("/grados_academicos")
    public ResponseEntity<?> obtenerGradosAcademicos() {
        return ResponseEntity.ok(catalogoService.obtenerGradosAcademicos());
    }

}