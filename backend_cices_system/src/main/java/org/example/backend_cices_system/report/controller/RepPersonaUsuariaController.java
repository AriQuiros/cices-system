package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dto.InvestigadorConsultaDTO;
import org.example.backend_cices_system.report.dto.PersonaUsuariaDTO;
import org.example.backend_cices_system.report.dto.UsuarioPersonaDTO;
import org.example.backend_cices_system.report.filter.PersonaFiltroDTO;
import org.example.backend_cices_system.report.serviceVw.RepPersonaUsuariaService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports/personas")
public class RepPersonaUsuariaController {

    private final RepPersonaUsuariaService personaService;

    @GetMapping("/empleados")
    public Page<PersonaUsuariaDTO> obtenerEmpleados(
            PersonaFiltroDTO filtro,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return personaService.obtenerPersonaPorRoles(
                filtro,
                pageable,
                List.of("ASISTENTE", "ADMINISTRATIVO")
        );
    }

    @GetMapping("/investigadores")
    public Page<PersonaUsuariaDTO> obtenerInvestigadores(
            PersonaFiltroDTO filtro,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return personaService.obtenerPersonaPorRoles(filtro, pageable, List.of("INVESTIGADOR"));
    }

    @GetMapping("/usuarios")
    public Page<UsuarioPersonaDTO> obtenerUsuarios(
            PersonaFiltroDTO filtro,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return personaService.todosUsuarios(filtro, pageable);
    }
}
