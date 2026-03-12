package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.service.EntidadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/entidades")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EntidadController {
    public EntidadController(EntidadService entidadService) {
        this.entidadService = entidadService;
    }

    private final EntidadService entidadService;

    @GetMapping
    public ResponseEntity<?> todos(){
        return ResponseEntity.ok(entidadService.obtenerTodos());
    }
}
