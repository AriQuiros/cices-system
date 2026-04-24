package org.example.backend_cices_system.consult.proyecto.dto;

import java.util.List;

public record ProyectoFiltroDTO (
    String texto,          // búsqueda por nombre o código
    String  estado,
    List<String>  tipos,
    List<String> lineas,   // líneas de investigación
    String ordenFecha    // "asc" | "desc"  (por fechaInicio)
){}