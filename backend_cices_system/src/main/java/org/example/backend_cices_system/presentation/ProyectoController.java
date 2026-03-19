package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import org.example.backend_cices_system.dto.ProyectoDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.service.ProyectoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

    @PostMapping(value = "/registro", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Integer> crearProyectoCompleto(
            @RequestPart("proyecto") ProyectoDTO dto,
            @RequestPart(value = "documentos", required = false) List<MultipartFile> documentos
    ) {
        Integer id = proyectoService.guardarProyecto(dto, documentos).getId();
        return ResponseEntity.ok(id);
    }

    @GetMapping("/consultar")
    public List<Map<String, Object>> consultarProyectos() {
        return proyectoService.obtenerProyectos().stream()
                .map(proyecto -> {
                    Map<String, Object> data = new LinkedHashMap<>();
                    data.put("idProyecto", proyecto.getId());
                    data.put("codigo", proyecto.getCodigoProyecto());
                    data.put("nombre", proyecto.getNombreProyecto());
                    data.put("lineaInvestigacion", proyecto.getLineaInvestigacion());
                    data.put("fechaInicio", proyecto.getFechaInicio());
                    data.put("fechaFinalizacion", proyecto.getFechaFinalizacion());
                    return data;
                })
                .toList();
    }

//    @GetMapping("/consultar/{id}")
//    public ResponseEntity<Proyecto> consultarProyectoPorId(@PathVariable Integer id) {
//        return ResponseEntity.ok(proyectoService.obtenerProyecto(id));
//    }
    @GetMapping("/consultar/{codigo}")
    public ResponseEntity<ProyectoDTO> consultarProyectoPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(proyectoService.obtenerProyectoPorCodigo(codigo));
    }

}
