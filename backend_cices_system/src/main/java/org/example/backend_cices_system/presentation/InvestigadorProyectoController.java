package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/investigador-proyecto")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class InvestigadorProyectoController {

    private final InvestigadorProyectoService investigadorProyectoService;
    private final ProyectoService proyectoService;
    private final InvestigadorService investigadorService;

    public InvestigadorProyectoController(InvestigadorProyectoService investigadorProyectoService,
                                          ProyectoService proyectoService, InvestigadorService investigadorService) {
        this.investigadorProyectoService = investigadorProyectoService;
        this.proyectoService = proyectoService;
        this.investigadorService = investigadorService;
    }

    @PostMapping("/{codigoProyecto}/{idInvestigador}/asignar-investigador")
    public ResponseEntity<Integer> asignarInvestigador(
            @PathVariable String codigoProyecto,
            @PathVariable String idInvestigador,
            @RequestBody @Valid InvestigadorProyectoDTO dto) {
        var proyecto = proyectoService.buscarProyectoXCodigo(codigoProyecto);
        var investigador = investigadorService.buscarXIdentificacion(idInvestigador);
        Integer id = investigadorProyectoService.guardarInvestigadorProyecto(dto, investigador, proyecto).getId();
        return ResponseEntity.ok(id);
    }
}