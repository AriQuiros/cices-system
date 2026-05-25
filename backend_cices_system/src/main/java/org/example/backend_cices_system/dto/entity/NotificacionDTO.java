package org.example.backend_cices_system.dto.entity;

import java.time.LocalDate;

public record NotificacionDTO (
    Integer id,
    String categoria,
    CodigoDTO prioridad,
    String asunto,
    String mensaje,
    LocalDate fechaCreacion
){}
