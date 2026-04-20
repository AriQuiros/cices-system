package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.dto.ProyectoDTO;
import org.example.backend_cices_system.service.ProyectoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @PostMapping(value = "/guardar", consumes = {"multipart/form-data"})
    public ResponseEntity<Integer> crearProyectoCompleto(
            @RequestPart("proyecto") ProyectoDTO dto,
            @RequestPart(value = "documentos", required = false) List<MultipartFile> documentos) {
        Integer id = proyectoService.guardarProyecto(dto, documentos).getId();
        return ResponseEntity.ok(id);
    }

    @GetMapping("/obtener/{codigo}")
    public ResponseEntity<?> obtenerProyecto(@PathVariable String codigo) {
        var proyecto = proyectoService.obtenerProyectoCompleto(codigo);
        return ResponseEntity.ok(proyecto);
    }

}
