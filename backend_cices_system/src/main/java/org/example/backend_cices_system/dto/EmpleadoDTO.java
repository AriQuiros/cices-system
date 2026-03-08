package org.example.backend_cices_system.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EmpleadoDTO(
        String nombreCompleto,
        String identificacion,
        String tipoId,
        String pais,
        String correo,
        String numeroTelefono,
        String gradoAcademico,
        UsuarioDTO usuario
) {}
