package org.example.backend_cices_system.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GastoDetalleDTO(
        String categoria,
        BigDecimal monto,
        LocalDate fecha,
        String descripcion
) {}
