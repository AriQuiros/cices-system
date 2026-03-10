package org.example.backend_cices_system.presentation;

import jakarta.validation.Valid;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/registro")
    public ResponseEntity<?> asignarInvestigador(@RequestBody @Valid List<InvestigadorProyectoDTO> listDto) {
        for(InvestigadorProyectoDTO dto : listDto){
            Proyecto proyecto = proyectoService.buscarProyectoPorCodigo(dto.codigoProyecto());
            Investigador investigador = investigadorService.buscarPorIdentificacion(dto.identificacionInvestigador());
            investigadorProyectoService.guardarInvestigadorProyecto(dto, investigador, proyecto);
        }
        return ResponseEntity.ok(listDto.size());
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarInvestigadorProyecto (@RequestBody @Valid InvestigadorProyectoDTO dto){
        var inv = investigadorProyectoService.actualizarInvestigadorProyecto(dto);
        return ResponseEntity.ok(inv);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarInvestigadorProyecto (@PathVariable Integer id){
        var inv = investigadorProyectoService.eliminarInvestigadorProyecto(id);
        return ResponseEntity.ok(inv);
    }
}