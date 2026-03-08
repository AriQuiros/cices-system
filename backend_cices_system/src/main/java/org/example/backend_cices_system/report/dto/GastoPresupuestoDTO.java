package org.example.backend_cices_system.report.dto;


import java.math.BigDecimal;
import java.time.LocalDate;

public record GastoPresupuestoDTO(
        BigDecimal monto,
        LocalDate fecha,
        String descripcion
) {
}
