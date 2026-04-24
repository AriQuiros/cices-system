package org.example.backend_cices_system.consult.persona.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.consult.persona.dto.PersonaUsuariaDTO;
import org.example.backend_cices_system.consult.persona.dto.UsuarioPersonaDTO;
import org.example.backend_cices_system.consult.persona.dto.PersonaFiltroDTO;
import org.example.backend_cices_system.consult.persona.service.RepPersonaUsuariaService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consulta/personas")
public class RepPersonaUsuariaController {

    private final RepPersonaUsuariaService personaService;

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
    public Page<PersonaUsuariaDTO> obtenerInvestigadores(
            @ModelAttribute PersonaFiltroDTO filtro,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return personaService.obtenerPersonaPorRoles(
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
}
