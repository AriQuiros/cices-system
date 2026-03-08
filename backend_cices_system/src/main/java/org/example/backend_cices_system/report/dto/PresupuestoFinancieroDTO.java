package org.example.backend_cices_system.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record PresupuestoFinancieroDTO(
        String descripcion,
        String categoria,
        LocalDate fechaAsignacion,
        String tipoPresupuesto,
        String fuenteFinanciamiento,
        BigDecimal monto,
        List<GastoPresupuestoDTO> gastos
) {}
