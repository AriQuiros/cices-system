package org.example.backend_cices_system.export.dto;

public record BitacoraGastoReporteDTO(
        String fecha,
        String accion,
        String usuario,
        String montoAnterior,
        String fechaGastoAnterior,
        String descripcionAnterior
) {}