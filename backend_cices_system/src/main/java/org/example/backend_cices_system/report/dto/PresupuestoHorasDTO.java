package org.example.backend_cices_system.report.dto;

import org.example.backend_cices_system.dto.HorasAsignadasDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record PresupuestoHorasDTO(
    Integer id,
    String descripcion,
    String categoria,
    LocalDate fechaAsignacion,
    String tipoPresupuesto,
    BigDecimal cantidadHoras,
    Short cantidadMeses,
    List<HorasAsignadasDTO> horas
) {}
