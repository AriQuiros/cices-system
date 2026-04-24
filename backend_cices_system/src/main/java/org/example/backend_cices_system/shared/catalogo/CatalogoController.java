package org.example.backend_cices_system.shared.catalogo;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/catalogos")
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