package org.example.backend_cices_system.modules.investigadorProyecto.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.investigadorProyecto.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.modules.investigador.model.Investigador;
import org.example.backend_cices_system.modules.investigadorProyecto.service.HorasAsignadasService;
import org.example.backend_cices_system.modules.investigadorProyecto.service.InvestigadorProyectoService;
import org.example.backend_cices_system.modules.proyecto.model.Proyecto;
import org.example.backend_cices_system.modules.investigador.service.InvestigadorService;
import org.example.backend_cices_system.modules.proyecto.service.ProyectoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/investigador-proyecto")
public class InvestigadorProyectoController {

    private final InvestigadorProyectoService investigadorProyectoService;
    private final HorasAsignadasService horasAsignadasService;
    private final ProyectoService proyectoService;
    private final InvestigadorService investigadorService;

    @PostMapping("/registro")
    public ResponseEntity<?> asignarInvestigador(@RequestBody @Valid List<InvestigadorProyectoDTO> listDto) {
        for(InvestigadorProyectoDTO dto : listDto){
            Proyecto proyecto = proyectoService.obtenerProyectoPorCodigo(dto.codigoProyecto());
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
        if(horasAsignadasService.existInvProyecto(id))
            throw new IllegalStateException("No se puede eliminar: El investigador tiene horas asignadas");
        var inv = investigadorProyectoService.eliminarInvestigadorProyecto(id);
        return ResponseEntity.ok(inv);
    }

    @GetMapping("/obtener/{id}")
    public InvestigadorProyectoDTO obtenerHora (@PathVariable Integer id){
        var investigadorProyecto = investigadorProyectoService.obtenerInvestigadorProyecto(id);
        return investigadorProyectoService.obtenerDTO(investigadorProyecto);
    }
}