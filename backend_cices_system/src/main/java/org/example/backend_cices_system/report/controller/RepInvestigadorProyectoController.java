package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.report.filter.ProyectoFiltroDTO;
import org.example.backend_cices_system.report.serviceVw.RepInvestigadorProyectoService;
import org.example.backend_cices_system.report.view.RepInvestigadorProyecto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reportes/investigadorProyecto")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RepInvestigadorProyectoController {

    private final RepInvestigadorProyectoService service;

    @GetMapping("/proyectos")
    public List<ProyectoFechasDTO> obtenerProyectos_Investigador(Authentication authentication) {
        Usuario user = (Usuario) authentication.getPrincipal();
        Integer idInvestigador = service.obtenerIdInvestigador(user.getId());
        return service.obtenerProyectosInvestigador(idInvestigador);
    }

    @GetMapping("/proyectos/principal")
    public List<ProyectoFechasDTO> obtenerProyectos_InvestigadorPrincipal(Authentication authentication) {
        Usuario user = (Usuario) authentication.getPrincipal();
        Integer idInvestigador = service.obtenerIdInvestigador(user.getId());
        return service.obtenerProyectosPrincipalOCoordinadorFechas(idInvestigador);
    }

    @GetMapping("/listar")
    public Page<ProyectoDatosDTO> listar(
            @RequestParam(required = false) String texto,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) List<String> tipoProyecto,
            @RequestParam(required = false) List<String> lineaInvestigacion,
            @RequestParam(required = false) String ordenFecha,
            Pageable pageable,
            Authentication authentication
    ) {
        var filtro = new ProyectoFiltroDTO(
                texto,
                estado,
                tipoProyecto,
                lineaInvestigacion,
                ordenFecha
        );

        Usuario user = (Usuario) authentication.getPrincipal();
        Integer idInvestigador = service.obtenerIdInvestigador(user.getId());

        return service.obtenerProyectosDatosInvestigador(
                idInvestigador,
                filtro,
                pageable
        );
    }

}
