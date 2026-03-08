package org.example.backend_cices_system.dto;

import java.time.LocalDate;
import java.util.List;

public record NotificacionDTO (
    String categoria,
    String prioridad,
    String asunto,
    String mensaje,
    LocalDate fechaCreacion,
    List<UsuarioDTO> usuarios
){}
