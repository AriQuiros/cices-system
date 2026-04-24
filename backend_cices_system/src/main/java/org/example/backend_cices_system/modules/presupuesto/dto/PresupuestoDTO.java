package org.example.backend_cices_system.modules.presupuesto.dto;

import org.example.backend_cices_system.modules.gasto.dto.GastoDTO;
import org.example.backend_cices_system.modules.investigadorProyecto.dto.HorasAsignadasDTO;
import org.example.backend_cices_system.shared.catalogo.CodigoDTO;

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
