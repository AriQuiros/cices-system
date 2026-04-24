package org.example.backend_cices_system.export.dto;

import java.math.BigDecimal;

public record PresupuestoResumenReporteDTO(
        BigDecimal totalAsignado,
        BigDecimal totalUsado,
        BigDecimal disponible, // restante
        Long cantidad    // cantidad gastos u horas asignadas
) {}