package org.example.backend_cices_system.dto;

import java.time.LocalDate;

public record ProyectoFechasDTO(
        String codigo,
        String nombre,
        LocalDate fechaInicio,
        LocalDate fechaFinalizacion
) {}
