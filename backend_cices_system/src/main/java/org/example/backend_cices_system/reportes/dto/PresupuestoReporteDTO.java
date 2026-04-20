package org.example.backend_cices_system.reportes.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record PresupuestoReporteDTO(
        Integer id,
        String categoria,
        String descripcion,
        String tipoPresupuesto,
        LocalDate fechaAsignacion,
        String fuenteFinanciamiento,
        BigDecimal cantidadHorasMes,
        Short cantidadMeses,
        BigDecimal montoAsignado,

        PresupuestoResumenReporteDTO presupuestoResumenReporteDTO,
        List<GastoReporteDTO>gastos,
        List<HorasAsignadasReporteDTO> horasAsignadas

) {}