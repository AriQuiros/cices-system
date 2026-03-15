package org.example.backend_cices_system.report.dto;

import java.time.LocalDate;


public record FormacionDTO(
        String identificacionInvestigador,
        String nombreInvestigador,
        String nombre,
        String institucion,
        String tipo,
        String estado,
        LocalDate fecha
) {
}
