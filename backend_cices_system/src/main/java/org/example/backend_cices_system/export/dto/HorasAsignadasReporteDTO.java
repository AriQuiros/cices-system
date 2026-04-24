package org.example.backend_cices_system.export.dto;

import java.math.BigDecimal;

public record HorasAsignadasReporteDTO(
        Integer id,
        Integer idInvestigadorProyecto,
        String investigador,
        String modalidad,
        String cargaAcademica,
        Double horasMes,
        Short meses,
        BigDecimal totalHorasAsignadas
) {}