package org.example.backend_cices_system.dto.export;

import java.time.LocalDate;

public record BitacoraGastoReporteDTO(
        LocalDate fecha,
        String accion,
        String usuario,
        String montoAnterior,
        LocalDate fechaGastoAnterior,
        String descripcionAnterior,
        Integer idPresupuesto,
        Integer idGasto

) {}