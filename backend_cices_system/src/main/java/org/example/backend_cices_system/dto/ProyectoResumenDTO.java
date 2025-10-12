package org.example.backend_cices_system.dto;

import java.time.LocalDate;

public record ProyectoResumenDTO(
        Short id,
        String codigo,
        String nombre,
        String estado,
        String linea,
        LocalDate ini,
        LocalDate fin,
        Integer horas_planificadas,
        Integer asignados_cnt,
        Integer horas_comprometidas
) {}
