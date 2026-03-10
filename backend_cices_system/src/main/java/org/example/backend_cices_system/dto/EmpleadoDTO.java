package org.example.backend_cices_system.dto;

public record EmpleadoDTO(
        String nombreCompleto,
        String identificacion,
        CodigoDTO tipoId,
        String pais,
        String correo,
        String numeroTelefono,
        CodigoDTO gradoAcademico,
        UsuarioDTO usuario
) {}
