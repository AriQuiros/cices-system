package org.example.backend_cices_system.reportes.dto;

public record BitacoraPresupuestoReporteDTO(
        String fecha,
        String accion,
        String usuario,
        String montoAnterior,
        String horasMesAnterior,
        String mesesAnterior
) {}