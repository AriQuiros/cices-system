package org.example.backend_cices_system.report.dto;


public record InvestigadorConsultaDTO(
        String nombreCompleto,
        String identificacion,
        String pais,
        String correo,
        String numeroTelefono,
        String gradoAcademico,
        String institucionOrigen,
        String unidadAcademica,
        String temaInteres
) {
}
