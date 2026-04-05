package org.example.backend_cices_system.dto;

import java.time.LocalDate;
import java.util.List;

public record NotificacionDTO (
    Integer id,
    String categoria,
    CodigoDTO prioridad,
    String asunto,
    String mensaje,
    LocalDate fechaCreacion
){}
