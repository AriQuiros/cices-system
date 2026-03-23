package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.report.serviceVw.RepPersonaUsuariaService;
import org.example.backend_cices_system.report.serviceVw.RepProyectoBaseService;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
        Usuario user = (Usuario) authentication.getPrincipal();
        Integer idInvestigador = obtenerIdInvestigador(user.getId());
        return service.obtenerProyectosInvestigador(idInvestigador);
    }

    @GetMapping("/investigador/principal")
    public List<ProyectoFechasDTO> obtenerProyectos_InvestigadorPrincipal(Authentication authentication) {
        Usuario user = (Usuario) authentication.getPrincipal();
        Integer idInvestigador = obtenerIdInvestigador(user.getId());
        return service.proyectosPrincipalInvestigador(idInvestigador);
    }

    @GetMapping("/investigador/list")
    public ResponseEntity<?> obtenerProyectos_InvestigadorList(Authentication authentication) {
        Usuario user = (Usuario) authentication.getPrincipal();
        Integer idInvestigador = obtenerIdInvestigador(user.getId());
        return ResponseEntity.ok(service.proyectosListadoInvestigador(idInvestigador));
    }

    private Integer obtenerIdInvestigador(Integer idUsuario) {
        Integer idInvestigador = repPersonaUsuariaService.idInvestigadorPorUsuario(idUsuario);

        if (idInvestigador == null) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "El usuario autenticado no tiene perfil de investigador"
            );
        }

        return idInvestigador;
    }
}
