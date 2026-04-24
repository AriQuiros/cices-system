package org.example.backend_cices_system.modules.notificacion.dto;

import org.example.backend_cices_system.modules.usuario.dto.UsuarioDTO;

import java.util.List;


public record NotificacionUsuarioDTO(
        NotificacionDTO notificacion,
        List<UsuarioDTO> destinatarios,
        boolean leido
) {
}
