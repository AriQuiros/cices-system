package org.example.backend_cices_system.report.filter;

import java.util.List;

public record CertificacionFiltroDTO (
    String nombre,
    List<String> tipos,
    List<String> estados,
    String ordenFecha // "asc" o "desc"
){}
