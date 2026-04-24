package org.example.backend_cices_system.modules.persona.dto;

import org.example.backend_cices_system.shared.catalogo.CodigoDTO;
import org.example.backend_cices_system.modules.usuario.dto.UsuarioDTO;

public record EmpleadoDTO(
        Integer id,
        String nombreCompleto,
        String identificacion,
        CodigoDTO tipoId,
        String pais,
        String correo,
        String numeroTelefono,
        CodigoDTO gradoAcademico,
        UsuarioDTO usuario
) {}
