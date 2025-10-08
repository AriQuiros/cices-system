package org.example.backend_cices_system.presentation;


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

    @GetMapping("/datos_iniciales")
    public ResponseEntity<?> obtenerDatosIniciales() {
        try {
            // Obtener proyectos
            List<ProyectoDTO> proyectos = proyectoService.obtenerProyectos_datosPrincipales();

            // Obtener códigos de catálogo para los tipos deseados
            List<String> tiposSolicitados = List.of("FUENTE FINANCIAMIENTO", "TIPO PRESUPUESTO");
            Map<String, List<CodigoDTO>> codigos = catalogoService.obtenerCodigosPorTipos(tiposSolicitados);

            // Construir respuesta
            var response = Map.of(
                    "proyectos", proyectos,
                    "tipos", codigos
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al cargar datos iniciales"));
        }
    }

}
