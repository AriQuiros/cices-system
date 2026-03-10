package org.example.backend_cices_system.dto;

import java.time.LocalDate;
import java.util.List;

public record NotificacionDTO (
    Integer id,
    CodigoDTO categoria,
    CodigoDTO prioridad,
    String asunto,
    String mensaje,
    LocalDate fechaCreacion,
    List<UsuarioDTO> usuarios
){}
