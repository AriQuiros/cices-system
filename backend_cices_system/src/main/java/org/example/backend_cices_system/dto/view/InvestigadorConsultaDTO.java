package org.example.backend_cices_system.dto.view;


public record InvestigadorConsultaDTO(
        PersonaUsuariaDTO persona,
        String institucionOrigen,
        String unidadAcademica,
        String temaInteres
) {
}
