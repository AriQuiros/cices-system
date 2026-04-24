package org.example.backend_cices_system.consult.proyecto.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.proyecto.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.example.backend_cices_system.consult.proyecto.dto.ProyectoInvestigadorDTO;
import org.example.backend_cices_system.consult.proyecto.dto.InvestigadorProyectoFiltroDTO;
import org.example.backend_cices_system.consult.proyecto.dto.ProyectoFiltroDTO;
import org.example.backend_cices_system.consult.proyecto.service.RepInvestigadorProyectoService;
import org.example.backend_cices_system.export.dto.InvestigadorReporteDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consulta/investigador-proyecto")
public class RepInvestigadorProyectoController {

    private final RepInvestigadorProyectoService service;

    @GetMapping("/busqueda")
    public Page<ProyectoFechasDTO> obtenerProyectos(
            @RequestParam(required = false) String texto,
            @RequestParam(defaultValue = "false") boolean soloPrincipalOPermiso,
            @PageableDefault(size = 8, page = 0) Pageable pageable,
            Authentication authentication
    ) {

        var filtro = new ProyectoFiltroDTO(
                texto, null, null, null, null
        );

        Usuario user = (Usuario) authentication.getPrincipal();
        Integer idInvestigador = service.obtenerIdInvestigador(user.getId());

        return service.obtenerProyectosInvestigadorLigero(
                idInvestigador,
                filtro,
                soloPrincipalOPermiso,
                pageable
        );
    }

    @GetMapping("/listar") // listado(ProyectoDatosDTO) de investigadores con rol y fechas de investigador
    public Page<ProyectoInvestigadorDTO> listar(
            @ModelAttribute ProyectoFiltroDTO filtro,
            @ModelAttribute InvestigadorProyectoFiltroDTO filtroInv,
            @PageableDefault(size = 8, page = 0) Pageable pageable,
            Authentication authentication
    ) {

        Usuario user = (Usuario) authentication.getPrincipal();
        Integer idInvestigador = service.obtenerIdInvestigador(user.getId());

        return service.obtenerInvestigadorProyectos(
                idInvestigador,
                filtro,
                filtroInv,
                pageable
        );
    }

    @GetMapping("/{codigoProyecto}") // investigadores por proyecto se ordena por fechaInicioInvestigador
    public Page<InvestigadorReporteDTO> obtenerLista(
            @PathVariable String codigoProyecto,
            @PageableDefault(size = 5, page = 0) Pageable pageable,
            @RequestParam(required = false) String ordenPor,
            @RequestParam(required = false) String direccion) {

        return service.obtenerPorCodigoProyecto(codigoProyecto, pageable, ordenPor, direccion);
    }

}
