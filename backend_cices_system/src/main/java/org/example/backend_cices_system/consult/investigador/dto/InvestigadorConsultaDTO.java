package org.example.backend_cices_system.consult.investigador.dto;


import org.example.backend_cices_system.consult.persona.dto.PersonaUsuariaDTO;

public record InvestigadorConsultaDTO(
        PersonaUsuariaDTO persona,
        String institucionOrigen,
        String unidadAcademica,
        String temaInteres
) {
}
