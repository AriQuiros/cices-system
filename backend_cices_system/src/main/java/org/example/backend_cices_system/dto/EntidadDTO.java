package org.example.backend_cices_system.dto;

public record EntidadDTO(
        Integer id,
        String nombre,
        String tipo, // INSTITUTION, UNIDAD, SITIO
        String pais
){}

