package org.example.backend_cices_system.dto;

import java.util.List;

public record UsuarioDTO(
        String nombreUsuario,
        String contrasena,
        List<String> roles
) {}
