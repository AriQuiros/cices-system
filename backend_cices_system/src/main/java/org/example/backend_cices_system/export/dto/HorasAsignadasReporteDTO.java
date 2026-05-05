package org.example.backend_cices_system.export.dto;

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
        String cargaAcademica, // tipo hora??
        Double horasMes,
        Short meses,
        BigDecimal totalHorasAsignadas
) {}