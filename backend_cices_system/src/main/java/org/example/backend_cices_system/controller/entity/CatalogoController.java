package org.example.backend_cices_system.controller.entity;

import org.example.backend_cices_system.dto.entity.CodigoDTO;
import org.example.backend_cices_system.service.entity.CatalogoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/catalogos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CatalogoController {
    private static final Logger log = LoggerFactory.getLogger(CatalogoController.class);
    @Autowired
    private CatalogoService catalogoService;

    @PostMapping("/tipos")
    public ResponseEntity<Map<String, List<CodigoDTO>>> obtenerPorTipos(@RequestBody List<String> tipos) {
        try {
            if (tipos == null || tipos.isEmpty()) {
                return ResponseEntity.ok(Map.of());
            }
            return ResponseEntity.ok(catalogoService.obtenerCodigosPorTipos(tipos));
        } catch (Throwable t) {
            log.error("Error al obtener codigos por tipos: {}", tipos, t);
            return ResponseEntity.status(500).body(Map.of());
        }
    }

    @GetMapping("/grados_academicos")
    public ResponseEntity<?> obtenerGradosAcademicos() {
        return ResponseEntity.ok(catalogoService.obtenerGradosAcademicos());
    }

}