package org.example.backend_cices_system.report.dto;


public record InvestigadorHorasDTO(
        String nombreInvestigador,
        Double horasMes,
        Short cantidadMeses,
        String modalidad
) {}
