package org.example.backend_cices_system.report.dto;


import java.math.BigDecimal;
import java.time.LocalDate;

public record GastoPresupuestoDTO(
        Integer id,
        Integer idPresupuesto,
        BigDecimal monto,
        LocalDate fechaGasto,
        String descripcion
) {
}
