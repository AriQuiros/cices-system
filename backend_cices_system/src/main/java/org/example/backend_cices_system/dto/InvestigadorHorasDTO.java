package org.example.backend_cices_system.dto;

public record InvestigadorHorasDTO(
        Integer idInvestigador,
        String nombreCompleto,
        String tipoHoras,
        Double horasMes,
        Short meses
) {}