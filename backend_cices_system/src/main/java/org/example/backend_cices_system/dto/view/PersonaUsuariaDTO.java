package org.example.backend_cices_system.dto.view;

import java.util.List;

public record PersonaUsuariaDTO (
    String nombreCompleto,
    String identificacion,
    String pais,
    String correo,
    String numeroTelefono,
    String gradoAcademico,
    List<String> roles
) {}
