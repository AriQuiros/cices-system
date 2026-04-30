package org.example.backend_cices_system.consult.persona.dto;

import java.util.List;

public record PersonaFiltroDTO(
        String nombre,
        List<String> roles,
        List<String> gradosAcademicos,
        Boolean activo
) {}