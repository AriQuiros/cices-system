package org.example.backend_cices_system.report.dto;

import org.example.backend_cices_system.dto.ProyectoDatosDTO;

import java.time.LocalDate;

public record ProyectoInvestigadorDTO(
        ProyectoDatosDTO proyectoDatosDTO,
        String rolProyecto,
        LocalDate fechaInicioInvestigador,
        LocalDate fechaFinInvestigador
)
{}
