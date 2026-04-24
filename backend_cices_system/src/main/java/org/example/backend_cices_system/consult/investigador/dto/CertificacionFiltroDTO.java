package org.example.backend_cices_system.consult.investigador.dto;

import java.util.List;

public record CertificacionFiltroDTO (
    Integer idInvestigador,        // nombre o identificacion
    String investigador,        // nombre o identificacion
    String nombreCertificacion,
    List<String> tipos,
    List<String> estados,
    String ordenFecha // "asc" o "desc"
){}
