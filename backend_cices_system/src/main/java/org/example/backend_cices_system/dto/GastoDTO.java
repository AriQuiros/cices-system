package org.example.backend_cices_system.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GastoDTO(
    Integer id,
    Integer idPresupuesto,
    BigDecimal monto,
    LocalDate fechaGasto,
    String descripcion
) { }
