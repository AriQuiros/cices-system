package org.example.backend_cices_system.dto.export;

import java.math.BigDecimal;
import java.time.LocalDate;

public record HorasAsignadasReporteDTO(
        Integer id,
        Integer idInvestigadorProyecto,
        String investigador,
        String modalidad,
        String rolProyecto,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        String tiempo, // tipo hora??
        Double horasMes,
        Short meses,
        BigDecimal totalHorasAsignadas
) {}