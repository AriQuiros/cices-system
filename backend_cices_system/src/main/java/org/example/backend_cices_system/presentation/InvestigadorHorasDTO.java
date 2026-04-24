package org.example.backend_cices_system.presentation;

public record InvestigadorHorasDTO(
        Integer idInvestigador,
        String nombreCompleto,
        String tipoHoras,
        Double horasMes,
        Short meses
) {}