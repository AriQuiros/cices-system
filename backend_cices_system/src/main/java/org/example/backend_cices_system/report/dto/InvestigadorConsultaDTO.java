package org.example.backend_cices_system.report.dto;


public record InvestigadorConsultaDTO(
        PersonaUsuariaDTO persona,
        String institucionOrigen,
        String unidadAcademica,
        String temaInteres
) {
}
