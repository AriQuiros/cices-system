package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.report.dto.ProyectoInvestigadorDTO;
import org.example.backend_cices_system.report.filter.InvestigadorProyectoFiltroDTO;
import org.example.backend_cices_system.report.filter.ProyectoFiltroDTO;
import org.example.backend_cices_system.report.serviceVw.RepInvestigadorProyectoService;
import org.example.backend_cices_system.reportes.dto.InvestigadorReporteDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consulta/investigador-proyecto")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RepInvestigadorProyectoController {

    private final RepInvestigadorProyectoService service;

    @GetMapping("/proyectos")
    public List<ProyectoFechasDTO> obtenerProyectos_Investigador(
            @RequestParam(required = false) String texto,
            @PageableDefault(size = 8, page = 0) Pageable pageable,
            Authentication authentication) {

        var filtro = new ProyectoFiltroDTO(
                texto,null, null, null, null
        );
        Usuario user = (Usuario) authentication.getPrincipal();
        Integer idInvestigador = service.obtenerIdInvestigador(user.getId());
        return service.obtenerInvestigadorProyectos(idInvestigador, filtro, pageable);
    }

    @GetMapping("/proyectos/permiso-principal")
    public List<ProyectoFechasDTO> obtenerProyectos_InvestigadorPrincipal(
            @RequestParam(required = false) String texto,
            @PageableDefault(size = 8, page = 0) Pageable pageable,
            Authentication authentication) {
        var filtro = new ProyectoFiltroDTO(
                texto,null, null, null, null
        );
        Usuario user = (Usuario) authentication.getPrincipal();
        Integer idInvestigador = service.obtenerIdInvestigador(user.getId());
        return service.obtenerProyectosPrincipalOPermiso(idInvestigador, filtro, pageable);
    }

    @GetMapping("/listar")
    public Page<ProyectoInvestigadorDTO> listar(
            InvestigadorProyectoFiltroDTO filtro,
            @PageableDefault(size = 8, page = 0) Pageable pageable,
            Authentication authentication
    ) {

        Usuario user = (Usuario) authentication.getPrincipal();
        Integer idInvestigador = service.obtenerIdInvestigador(user.getId());

        return service.obtenerInvestigadorProyectos(
                idInvestigador,
                filtro,
                pageable
        );
    }

    @GetMapping("/{codigoProyecto}")
    public List<InvestigadorReporteDTO> obtenerLista(@PathVariable String codigoProyecto) {
        return service.obtenerPorCodigoProyecto(codigoProyecto);
    }

}
