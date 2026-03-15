package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.report.serviceVw.RepPersonaUsuariaService;
import org.example.backend_cices_system.report.serviceVw.RepProyectoBaseService;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports/proyectos")
public class RepProyectoBaseController {

    private final RepProyectoBaseService service;
    private final RepPersonaUsuariaService repPersonaUsuariaService;

    public RepProyectoBaseController(RepProyectoBaseService service, RepPersonaUsuariaService repPersonaUsuariaService) {
        this.service = service;
        this.repPersonaUsuariaService = repPersonaUsuariaService;
    }

    @GetMapping("/list")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.proyectosListado());
    }

    @GetMapping("/codigo/{codigoProyecto}")
    public RepProyectoBase getByCodigoProyecto(@PathVariable String codigoProyecto) {
        return service.buscarPorCodigoProyecto(codigoProyecto);
    }

    @GetMapping("/codigo-nombre-fechas")
    public List<ProyectoFechasDTO> obtenerProyectos_CodigoNombre() {
        return service.obtenerTodos_fechas();
    }

    @GetMapping("/investigador")
    public List<ProyectoFechasDTO> obtenerProyectos_Investigador(Authentication authentication) {
        String username = (String) authentication.getPrincipal();
        Integer idUsuario = repPersonaUsuariaService.idUsuarioPorNombre(username);
        Integer idInvestigador = repPersonaUsuariaService.idInvestigadorPorUsuario(idUsuario);
        return service.obtenerProyectosInvestigador(idInvestigador);
    }

    @GetMapping("/investigador/principal")
    public List<ProyectoFechasDTO> obtenerProyectos_InvestigadorPrincipal(Authentication authentication) {
        String username = (String) authentication.getPrincipal();
        Integer idUsuario = repPersonaUsuariaService.idUsuarioPorNombre(username);
        Integer idInvestigador = repPersonaUsuariaService.idInvestigadorPorUsuario(idUsuario);
        return service.proyectosPrincipalInvestigador(idInvestigador);
    }

    @GetMapping("/investigador/list")
    public ResponseEntity<?> obtenerProyectos_InvestigadorList(Authentication authentication) {
        String username = (String) authentication.getPrincipal();
        Integer idUsuario = repPersonaUsuariaService.idUsuarioPorNombre(username);
        Integer idInvestigador = repPersonaUsuariaService.idInvestigadorPorUsuario(idUsuario);
        return ResponseEntity.ok(service.proyectosListadoInvestigador(idInvestigador));
    }
}
