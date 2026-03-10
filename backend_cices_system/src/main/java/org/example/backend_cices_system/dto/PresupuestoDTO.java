package org.example.backend_cices_system.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record PresupuestoDTO (
    Integer id,
    String descripcion,
    CodigoDTO categoria,
    LocalDate fechaAsignacion,
    CodigoDTO tipoPresupuesto,
    CodigoDTO fuenteFinanciamiento,
    BigDecimal monto,
    BigDecimal cantidadHorasMes,
    Short cantidadMeses,

    List<GastoDTO> gastos,
    List<HorasAsignadasDTO> horas
){}
