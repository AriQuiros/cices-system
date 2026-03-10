package org.example.backend_cices_system.report.dto;


public record InvestigadorHorasDTO(
        Integer id,
        Integer idInvestigadorProyecto,
        Integer idPresupuesto,
        String nombreInvestigador,
        Double horasMes,
        Short cantidadMeses,
        String modalidad
) {}
