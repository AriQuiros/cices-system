package org.example.backend_cices_system.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PresupuestoDTO (
    String descripcion,
    String categoria,
    LocalDate fechaAsignacion,
    String tipoPresupuesto,
    String fuenteFinanciamiento,
    BigDecimal monto,
    BigDecimal cantidadHorasMes,
    Short cantidadMeses
){}
