package org.example.backend_cices_system.dto.view;


import java.time.LocalDate;

public record PresupuestoDatosDTO (
        Integer id,
        String categoria,
        String descripcion,
        LocalDate fechaAsignacion
)
{}
