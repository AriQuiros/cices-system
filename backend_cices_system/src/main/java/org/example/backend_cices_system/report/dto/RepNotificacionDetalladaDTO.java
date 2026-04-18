package org.example.backend_cices_system.report.dto;

import java.time.LocalDate;
import java.util.List;

public record RepNotificacionDetalladaDTO(
        Integer idNotificacionUsuario,
        Integer idUsuario,
        String nombreUsuario,
        Integer idNotificacion,
        String tipo,
        List<CampoDetalleDTO> detalle,
        Boolean leido,
        LocalDate fechaCreacion,
        LocalDate fechaLeido,
        LocalDate fechaObjetivo
) {
    public record CampoDetalleDTO(String label, String value) {
    }
}
