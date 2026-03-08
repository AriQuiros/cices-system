package org.example.backend_cices_system.dto;

public record HorasAsignadasDTO(
        PresupuestoDTO presupuesto,
        String modalidad,
        String tipoHora,
        Double cantidadHorasMes,
        Short cantidadMeses
) {}
