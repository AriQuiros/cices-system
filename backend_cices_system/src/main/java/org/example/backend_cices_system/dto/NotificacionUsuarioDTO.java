package org.example.backend_cices_system.dto;

import java.util.List;


public record NotificacionUsuarioDTO(
        NotificacionDTO notificacion,
        List<UsuarioDTO> destinatarios,
        boolean leido
) {
}
