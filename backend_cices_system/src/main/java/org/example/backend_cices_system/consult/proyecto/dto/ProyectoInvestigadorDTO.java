package org.example.backend_cices_system.consult.proyecto.dto;

import org.example.backend_cices_system.modules.proyecto.dto.ProyectoDatosDTO;

import java.time.LocalDate;

public record ProyectoInvestigadorDTO(
        ProyectoDatosDTO proyectoDatosDTO,
        String rolProyecto,
        LocalDate fechaInicioInvestigador,
        LocalDate fechaFinInvestigador
)
{}
