package org.example.backend_cices_system.reportes.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GastoReporteDTO(
        Integer id,
        String descripcion,
        BigDecimal monto,
        LocalDate fechaGasto
) {}