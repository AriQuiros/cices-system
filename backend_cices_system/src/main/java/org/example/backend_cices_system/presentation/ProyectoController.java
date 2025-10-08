package org.example.backend_cices_system.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.ProyectoDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.service.DocumentoService;
import org.example.backend_cices_system.service.ProyectoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/proyectos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")

public class ProyectoController {
    @Autowired
    private ProyectoService proyectoService;
    @Autowired
    private DocumentoService documentoService;
    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(value = "/registrar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registrarProyecto(
            @RequestPart("proyecto") ProyectoDTO proyectoDTO,
            @RequestPart(value = "documentos", required = false) List<MultipartFile> documentos
    ) {
        try {
            Proyecto proyecto = proyectoService.guardarProyecto(proyectoDTO);

            if (documentos != null && !documentos.isEmpty()) {
                documentoService.guardarDocumentos(proyecto, documentos);
            }

            return ResponseEntity.ok(Map.of("mensaje", "Proyecto registrado correctamente", "proyecto", proyecto));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error registrando proyecto", "detalle", e.getMessage()));
        }
    }

    @GetMapping("/consultar")
    public ResponseEntity<List<ProyectoDTO>> consultarProyecto(){
        List<ProyectoDTO> proyectoDTO = proyectoService
                .obtenerTodosLosProyectos();
        return ResponseEntity.ok(proyectoDTO);
        }

}
