package org.example.backend_cices_system.dto.entity;

import java.time.LocalDate;

public record InvestigadorProyectoDTO(
        Integer id,
        String identificacionInvestigador,
        String nombreInvestigador,
        String codigoProyecto,
        RolProyectoDTO rolProyecto,
        String actividadProyecto,
        LocalDate fechaInicio,
        LocalDate fechaFin
) {}

