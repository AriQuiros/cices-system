package org.example.backend_cices_system.modules.notificacion.dto;

import org.example.backend_cices_system.shared.catalogo.CodigoDTO;

import java.time.LocalDate;

public record NotificacionDTO (
    Integer id,
    String categoria,
    CodigoDTO prioridad,
    String asunto,
    String mensaje,
    LocalDate fechaCreacion
){}
