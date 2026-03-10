package org.example.backend_cices_system.dto;

import java.util.List;

public record UsuarioDTO(
        Integer id,
        String nombreUsuario,
        String contrasena,
        List<RolDTO> roles
) {}
