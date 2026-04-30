package org.example.backend_cices_system.consult.persona.dto;


public record InvestigadorConsultaDTO(
        PersonaUsuariaDTO persona,
        String institucionOrigen,
        String unidadAcademica,
        String temaInteres
) {
}
