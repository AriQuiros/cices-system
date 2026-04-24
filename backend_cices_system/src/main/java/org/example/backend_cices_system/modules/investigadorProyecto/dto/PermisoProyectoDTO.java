package org.example.backend_cices_system.modules.investigadorProyecto.dto;

import java.time.LocalDate;

public record PermisoProyectoDTO(
        Integer id,
        Integer idInvestigadorProyecto,
        String identificacionInvestigador,
        String nombreInvestigador,
        LocalDate fechaInicio,
        LocalDate fechaFin
) {
}
