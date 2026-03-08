package org.example.backend_cices_system.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

public record GastoDTO(
    PresupuestoDTO presupuesto,
    BigDecimal monto,
    LocalDate fecha,
    String descripcion
) { }
