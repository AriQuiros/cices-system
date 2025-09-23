package org.example.backend_cices_system.dto;

import java.util.List;

public record RegistroInvestigadorDTO(
        Short idEmpleado,
        String institucionOrigen,
        String unidadAcademica,
        Short idCodigoGradoAcademico,
        Integer numeroBecario,
        List<CertificacionDTO> acreditaciones
) {}
