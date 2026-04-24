package org.example.backend_cices_system.modules.proyecto.dto;

import java.time.LocalDate;

public record ProyectoDatosDTO (
        Integer id,
        String codigoProyecto,
        String nombreProyecto,
        String lineaInvestigacion,
        String tipoProyecto,
        String estado,
        LocalDate fechaInicio,
        LocalDate fechaFinalizacion
) {}
