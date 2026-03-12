package org.example.backend_cices_system.dto;

public record EntidadDTO(
        Integer id,
        String nombre,
        CodigoDTO tipo // INSTITUTION, UNIDAD, SITIO
){}

