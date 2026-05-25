package org.example.backend_cices_system.controller.view;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.model.entity.Usuario;
import org.example.backend_cices_system.dto.view.FormacionDTO;
import org.example.backend_cices_system.dto.filter.CertificacionFiltroDTO;
import org.example.backend_cices_system.service.view.RepInvestigadorCertificacionesService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/consulta/certificaciones")
@RequiredArgsConstructor
public class RepInvestigadorCertificacionesController {

    private final RepInvestigadorCertificacionesService service;

    @GetMapping("/filtrar")
    public Page<FormacionDTO> filtrar(
            @ModelAttribute CertificacionFiltroDTO filtro,
            @PageableDefault(size = 10) Pageable pageable
            ) {
        return service.filtrarCertificacionesPaginado(filtro, pageable);
    }

    @GetMapping("/investigador")
    public Page<FormacionDTO> misCertificaciones(
            @ModelAttribute CertificacionFiltroDTO filtro,
            @PageableDefault(size = 10) Pageable pageable,
            Authentication authentication
    ) {
        Usuario usuario = (Usuario) authentication.getPrincipal();

        var idInvestigador  = service.obtenerInvestigadorPorUsuario(usuario.getId());
        var filtroFinal = new CertificacionFiltroDTO(
                idInvestigador,
                filtro.investigador(),
                filtro.nombreCertificacion(),
                filtro.tipos(),
                filtro.estados(),
                filtro.ordenFecha()
        );
        return service.filtrarCertificacionesPaginado(filtroFinal, pageable);
    }
}
