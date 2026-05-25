package org.example.backend_cices_system.controller.view;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.service.view.InvestigadorDetalleService;
import org.example.backend_cices_system.service.view.RepPersonaUsuariaService;
import org.example.backend_cices_system.dto.filter.PersonaFiltroDTO;
import org.example.backend_cices_system.dto.view.InvestigadorConsultaDTO;
import org.example.backend_cices_system.dto.view.InvestigadorDetalleDTO;
import org.example.backend_cices_system.dto.view.PersonaUsuariaDTO;
import org.example.backend_cices_system.dto.view.UsuarioPersonaDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consulta/personas")
public class RepPersonaUsuariaController {

    private final RepPersonaUsuariaService personaService;
    private final InvestigadorDetalleService investigadorDetalleService;

    @GetMapping("/empleados")
    public Page<PersonaUsuariaDTO> obtenerEmpleados(
            @ModelAttribute PersonaFiltroDTO filtro,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return personaService.obtenerPersonaPorRoles(
                filtro,
                pageable
        );
    }

    @GetMapping("/investigadores")
    public Page<InvestigadorConsultaDTO> obtenerInvestigadores(
            @ModelAttribute PersonaFiltroDTO filtro,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return personaService.obtenerInvestigadoresPorRoles(
                filtro,
                pageable
        );
    }

    @GetMapping("/usuarios")
    public Page<UsuarioPersonaDTO> obtenerUsuarios(
            @ModelAttribute PersonaFiltroDTO filtro,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return personaService.todosUsuarios(filtro, pageable);
    }

    @GetMapping("/investigador/{identificacion}")
    public InvestigadorDetalleDTO obtenerUsuarios(
            @PathVariable String identificacion
    ) {
        return investigadorDetalleService.obtenerInvestigador(identificacion);
    }
}
