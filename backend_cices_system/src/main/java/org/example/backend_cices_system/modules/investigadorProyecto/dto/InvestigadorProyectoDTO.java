package org.example.backend_cices_system.modules.investigadorProyecto.dto;

import java.time.LocalDate;

public record InvestigadorProyectoDTO(
        Integer id,
        String identificacionInvestigador,
        String nombreInvestigador,
        String gradoAcademico,
        String codigoProyecto,
        RolProyectoDTO rolProyecto,
        String actividadProyecto,
        LocalDate fechaInicio,
        LocalDate fechaFin
) {}

