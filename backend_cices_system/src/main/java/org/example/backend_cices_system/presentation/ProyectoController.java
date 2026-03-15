package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import org.example.backend_cices_system.dto.ProyectoDTO;
import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.service.ProyectoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProyectoController {

    private final ProyectoService proyectoService;

    public ProyectoController(ProyectoService proyectoService) {
        this.proyectoService = proyectoService;
    }

    @GetMapping("/lineas-investigacion")
    public String[] obtenerLineas() {
        return proyectoService.obtenerLineasInvestigacion().toArray(String[]::new);
    }

    @PostMapping("/registro")
    public ResponseEntity<Integer> crearProyectoCompleto(
            @RequestBody @Valid ProyectoDTO dto) {
        Integer id = proyectoService.guardarProyecto(dto).getId();
        return ResponseEntity.ok(id);
    }


}
