package org.example.backend_cices_system.dto;

import java.math.BigDecimal;

public record HorasAsignadasDetalleDTO(
        String nombreCompleto,
        BigDecimal horasAsignadas,
        Integer duracionMeses
) {}
