package org.example.backend_cices_system.dto;

import java.time.LocalDate;
import java.util.List;

public record InvestigadorProyectoDTO(
        String identificacionInvestigador,
        String nombreInvestigador,
        String rolProyecto,
        String actividadProyecto,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        List<HorasAsignadasDTO> horasAsignadas
) {}

