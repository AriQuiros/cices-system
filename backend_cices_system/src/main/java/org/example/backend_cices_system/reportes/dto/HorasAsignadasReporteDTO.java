package org.example.backend_cices_system.reportes.dto;

import java.math.BigDecimal;

public record HorasAsignadasReporteDTO(
        Integer id,
        String investigador,
        String modalidad,
        Double horasMes,
        Short meses,
        BigDecimal totalHorasAsignadas
) {}