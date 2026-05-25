package org.example.backend_cices_system.dto.export;

import java.time.LocalDate;

public record BitacoraPresupuestoReporteDTO(
        LocalDate fecha,
        String accion,
        String usuario,
        String montoAnterior,
        String horasMesAnterior,
        String mesesAnterior,
        Integer idPresupuesto
) {}