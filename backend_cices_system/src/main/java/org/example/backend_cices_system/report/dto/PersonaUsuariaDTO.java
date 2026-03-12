package org.example.backend_cices_system.report.dto;

import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.dto.UsuarioDTO;

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
