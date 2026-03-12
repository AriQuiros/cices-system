package org.example.backend_cices_system.report.dto;

import java.util.List;

public record UsuarioPersonaDTO (
        Integer id,
        String nombreCompleto,
        String nombreUsuario, //correo
        boolean activo,
        List<String> roles
) {}
