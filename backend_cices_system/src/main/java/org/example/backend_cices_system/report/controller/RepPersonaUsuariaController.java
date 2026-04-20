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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consulta/personas")
public class RepPersonaUsuariaController {

    private final RepPersonaUsuariaService personaService;

    @GetMapping("/empleados")
    public Page<PersonaUsuariaDTO> obtenerEmpleados(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) List<String> gradosAcademicos,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        var filtro = new PersonaFiltroDTO(
                nombre,
                List.of("ASISTENTE", "ADMINISTRATIVO"),
                gradosAcademicos
        );
        return personaService.obtenerPersonaPorRoles(
                filtro,
                pageable
        );
    }

    @GetMapping("/investigadores")
    public Page<PersonaUsuariaDTO> obtenerInvestigadores(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) List<String> gradosAcademicos,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        var filtro = new PersonaFiltroDTO(
                nombre,
                List.of("INVESTIGADOR"),
                gradosAcademicos
        );
        return personaService.obtenerPersonaPorRoles(
                filtro,
                pageable
        );
    }

    @GetMapping("/usuarios")
    public Page<UsuarioPersonaDTO> obtenerUsuarios(
            PersonaFiltroDTO filtro,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return personaService.todosUsuarios(filtro, pageable);
    }
}
