package org.example.backend_cices_system.dto.entity;

import java.util.List;

public record UsuarioDTO(
        Integer id,
        String nombreUsuario,
        String contrasena,
        List<RolDTO> roles
) {}
