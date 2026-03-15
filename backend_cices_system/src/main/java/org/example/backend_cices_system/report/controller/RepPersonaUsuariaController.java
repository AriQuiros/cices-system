package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.dto.InvestigadorConsultaDTO;
import org.example.backend_cices_system.report.dto.PersonaUsuariaDTO;
import org.example.backend_cices_system.report.dto.UsuarioPersonaDTO;
import org.example.backend_cices_system.report.serviceVw.RepPersonaUsuariaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/personas")
public class RepPersonaUsuariaController {

    private final RepPersonaUsuariaService personaService;

    public RepPersonaUsuariaController(RepPersonaUsuariaService personaService) {
        this.personaService = personaService;
    }

    @GetMapping("/empleados")
    public List<PersonaUsuariaDTO> obtenerEmpleados() {
        return personaService.obtenerAsistentesAdministrativos();
    }

    @GetMapping("/investigadores")
    public List<InvestigadorConsultaDTO> obtenerInvestigadores() {
        return personaService.obtenerInvestigadores();
    }

    @GetMapping("/usuarios")
    public List<UsuarioPersonaDTO> obtenerUsuarios() {
        return personaService.todosUsuarios();
    }
}
