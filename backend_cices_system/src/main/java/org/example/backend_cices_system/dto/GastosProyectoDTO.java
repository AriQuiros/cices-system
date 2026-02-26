package org.example.backend_cices_system.dto;

import java.math.BigDecimal;
import java.util.List;

public record GastosProyectoDTO(
        Short proyectoId,
        String codigoProyecto,
        String nombreProyecto,
        BigDecimal presupuestoFinancieroInicial,
        BigDecimal presupuestoFinancieroActual,
        BigDecimal presupuestoHorasInicial,
        BigDecimal presupuestoHorasActual,
        List<GastoDetalleDTO> gastos,
        List<HorasAsignadasDetalleDTO> horasAsignadas
) {}
