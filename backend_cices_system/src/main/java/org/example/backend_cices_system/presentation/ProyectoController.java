package org.example.backend_cices_system.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.ProyectoRepository;
import org.example.backend_cices_system.dto.PresupuestoDTO;
import org.example.backend_cices_system.dto.ProyectoDTO;
import org.example.backend_cices_system.dto.ProyectoMiniDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.service.DocumentoService;
import org.example.backend_cices_system.service.PresupuestoService;
import org.example.backend_cices_system.service.ProyectoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    private PresupuestoService presupuestoService;

    @PostMapping(value = "/registrar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registrarProyecto(
            @RequestPart("proyecto") ProyectoDTO proyectoDTO,
            @RequestPart("presupuesto") List<PresupuestoDTO> presupuestoDTOS,
            @RequestPart(value = "documentos", required = false) List<MultipartFile> documentos
    ) {
        try {
            Proyecto proyecto = proyectoService.guardarProyecto(proyectoDTO);
            presupuestoService.guardarPresupuestos(presupuestoDTOS, proyecto);
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

    @GetMapping("/consultar/{id}")
    public ResponseEntity<ProyectoDTO> consultarProyecto(@PathVariable("id") Integer id){
        return ResponseEntity.ok(proyectoService.obtenerProyectoDTOPorId(id.shortValue()));
    }

    @GetMapping("/suggest")
    public List<ProyectoMiniDTO> suggest(
            @RequestParam String q,
            @RequestParam(defaultValue = "10") int limit) {
        return proyectoService.suggest(q, org.springframework.data.domain.PageRequest.of(0, limit));
    }

}
