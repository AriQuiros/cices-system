package org.example.backend_cices_system.dto;

import java.time.LocalDate;

public record ProyectoDatosDTO (
        String codigo,
        String nombre,
        String lineaInvestigacion,
        String tipoProyecto,
        String estado,
        LocalDate fechaInicio,
        LocalDate fechaFinalizacion
) {}
