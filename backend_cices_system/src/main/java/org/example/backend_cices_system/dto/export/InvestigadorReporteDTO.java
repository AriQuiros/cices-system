package org.example.backend_cices_system.dto.export;

import java.time.LocalDate;

public record InvestigadorReporteDTO(
        Integer id,
        String identificacion,
        String nombreCompleto,
        String rolProyecto,
        String actividadProyecto,
        LocalDate fechaInicio,
        LocalDate fechaFin
) {}