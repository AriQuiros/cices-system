package org.example.backend_cices_system.dto.view;

import org.example.backend_cices_system.dto.entity.ProyectoDatosDTO;

import java.time.LocalDate;

public record ProyectoInvestigadorDTO(
        ProyectoDatosDTO proyectoDatosDTO,
        String rolProyecto,
        LocalDate fechaInicioInvestigador,
        LocalDate fechaFinInvestigador
)
{}
