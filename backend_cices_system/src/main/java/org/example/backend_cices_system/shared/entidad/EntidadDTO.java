package org.example.backend_cices_system.shared.entidad;

import org.example.backend_cices_system.shared.catalogo.CodigoDTO;

public record EntidadDTO(
        Integer id,
        String nombre,
        CodigoDTO tipo // INSTITUTION, UNIDAD, SITIO
){}

