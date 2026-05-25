package org.example.backend_cices_system.controller.entity;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.entity.InvestigadorProyectoDTO;
import org.example.backend_cices_system.model.entity.Investigador;
import org.example.backend_cices_system.service.entity.HorasAsignadasService;
import org.example.backend_cices_system.service.entity.InvestigadorProyectoService;
import org.example.backend_cices_system.model.entity.Proyecto;
import org.example.backend_cices_system.service.entity.InvestigadorService;
import org.example.backend_cices_system.service.entity.ProyectoService;
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