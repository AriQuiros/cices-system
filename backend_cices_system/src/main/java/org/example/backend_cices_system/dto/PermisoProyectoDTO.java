package org.example.backend_cices_system.dto;

import java.time.LocalDate;

public record PermisoProyectoDTO(
        Integer id,
        InvestigadorProyectoDTO investigadorProyectoDTO,
        LocalDate fechaInicio,
        LocalDate fechaFin
) {
}
