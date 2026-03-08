package org.example.backend_cices_system.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record PresupuestoHorasDTO(
    String descripcion,
    String categoria,
    LocalDate fechaAsignacion,
    String tipoPresupuesto,
    BigDecimal cantidadHoras,
    Short cantidadMeses,
    List<InvestigadorHorasDTO> horas
) {}
