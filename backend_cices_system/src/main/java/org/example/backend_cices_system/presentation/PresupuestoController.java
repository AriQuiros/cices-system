package org.example.backend_cices_system.presentation;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.dto.PresupuestoDTO;
import org.example.backend_cices_system.dto.ProyectoDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.service.CatalogoService;
import org.example.backend_cices_system.service.PresupuestoService;
import org.example.backend_cices_system.service.ProyectoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/presupuesto")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")

public class PresupuestoController {
    @Autowired
    private ProyectoService proyectoService;
    @Autowired
    private CatalogoService catalogoService;
    @Autowired
    private PresupuestoService presupuestoService;

    @GetMapping("/datos_form")
    public ResponseEntity<?> obtenerDatosForm() {
        try {
            // Obtener proyectos
            List<ProyectoDTO> proyectos = proyectoService.obtenerProyectos_PresupuestoForm();
            List<PresupuestoDTO> presupuestos = presupuestoService.obtenerPresupuestosPorProyectos(proyectos);

            List<String> tiposSolicitados = List.of("FUENTE FINANCIAMIENTO", "TIPO PRESUPUESTO");
            Map<String, List<CodigoDTO>> codigos = catalogoService.obtenerCodigosPorTipos(tiposSolicitados);

            // Construir respuesta
            var response = Map.of(
                    "proyectos", proyectos,
                    "presupuestos", presupuestos,
                    "tipos", codigos
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al cargar datos iniciales para el form"));
        }
    }
    @GetMapping("/tipos_form")
    public ResponseEntity<?> obtenerTiposForm() {
        try {
            List<String> tiposSolicitados = List.of("FUENTE FINANCIAMIENTO", "TIPO PRESUPUESTO");
            Map<String, List<CodigoDTO>> codigos = catalogoService.obtenerCodigosPorTipos(tiposSolicitados);

            // Construir respuesta
            var response = Map.of(
                    "tipos", codigos
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al cargar tipos para el form"));
        }
    }

    @PostMapping(value = "/registrar", consumes = {"multipart/form-data"})
    public ResponseEntity<?> registrarPresupuestos(
            @RequestPart("idProyecto") String idProyecto,
            @RequestPart("presupuestos") List<PresupuestoDTO> presupuestos
    ) {
        System.out.println("ID Proyecto: " + idProyecto);
        Proyecto proyecto = proyectoService.obtenerProyectoPorCodigo(idProyecto);
        System.out.println("Presupuestos: " + presupuestos);
        presupuestoService.guardarPresupuestos(presupuestos, proyecto);

        return ResponseEntity.ok("Presupuesto registrado correctamente");
    }

}
