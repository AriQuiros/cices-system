package org.example.backend_cices_system.export.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record HorasAsignadasReporteDTO(
        Integer id,
        Integer idInvestigadorProyecto,
        String investigador,
        String modalidad,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        String cargaAcademica,
        Double horasMes,
        Short meses,
        BigDecimal totalHorasAsignadas
) {}