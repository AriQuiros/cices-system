package org.example.backend_cices_system.report.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CertificacionFiltroDTO {
    private String nombre;
//    private List<String> tipos;
//    private List<String> estados;
    List<Short> tipos;
    List<Short> estados;
    private String ordenFecha; // "asc" o "desc"
}
