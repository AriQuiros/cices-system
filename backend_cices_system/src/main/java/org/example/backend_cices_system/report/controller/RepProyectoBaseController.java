package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.report.serviceVw.RepPersonaUsuariaService;
import org.example.backend_cices_system.report.serviceVw.RepProyectoBaseService;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports/proyectos")
public class RepProyectoBaseController {

    private final RepProyectoBaseService service;

    @GetMapping("/codigo-nombre-fechas")
    public List<ProyectoFechasDTO> obtenerProyectos_CodigoNombre() {
        return service.obtenerTodos_fechas();
    }

    @GetMapping("/listar")
    public Page<ProyectoDatosDTO> listar(
            @RequestParam(required = false) String texto,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) List<String> tipoProyecto,
            @RequestParam(required = false) List<String> lineaInvestigacion,
            @RequestParam(required = false) String ordenFecha,
            Pageable pageable
    ) {
        return service.buscarConFiltros(
                texto,
                estado,
                tipoProyecto,
                lineaInvestigacion,
                pageable
        );
    }

//
//    private Integer obtenerIdInvestigador(Integer idUsuario) {
//        Integer idInvestigador = repPersonaUsuariaService.idInvestigadorPorUsuario(idUsuario);
//
//        if (idInvestigador == null) {
//            throw new ResponseStatusException(
//                    HttpStatus.FORBIDDEN,
//                    "El usuario autenticado no tiene perfil de investigador"
//            );
//        }
//
//        return idInvestigador;
//    }
}
