package org.example.backend_cices_system.modules.proyecto.dto;

import java.time.LocalDate;

public record ProyectoFechasDTO(
        String codigoProyecto,
        String nombreProyecto,
        LocalDate fechaInicio,
        LocalDate fechaFinalizacion
) {}
