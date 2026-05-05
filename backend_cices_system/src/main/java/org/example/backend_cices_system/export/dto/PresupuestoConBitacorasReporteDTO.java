package org.example.backend_cices_system.export.dto;

import java.util.List;

public record PresupuestoConBitacorasReporteDTO(
        PresupuestoReporteDTO base,
        List<BitacoraPresupuestoReporteDTO> cambiosPresupuesto,
        List<BitacoraGastoReporteDTO> cambiosGasto
) {}