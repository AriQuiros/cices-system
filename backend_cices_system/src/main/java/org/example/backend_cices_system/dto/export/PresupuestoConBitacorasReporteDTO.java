package org.example.backend_cices_system.dto.export;

import java.util.List;

public record PresupuestoConBitacorasReporteDTO(
        PresupuestoReporteDTO base,
        List<BitacoraPresupuestoReporteDTO> cambiosPresupuesto,
        List<BitacoraGastoReporteDTO> cambiosGasto
) {}