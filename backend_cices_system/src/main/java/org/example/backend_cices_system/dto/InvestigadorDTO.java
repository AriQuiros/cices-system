package org.example.backend_cices_system.dto;

import java.util.List;

public record InvestigadorDTO(
        Integer id,
        EmpleadoDTO empleado,
        EntidadDTO institucionOrigen,
        EntidadDTO unidadAcademica,
        String temaInteres,
        List<TituloDTO> titulos,
        List<CertificacionDTO> certificaciones
) {}

