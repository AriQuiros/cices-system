package org.example.backend_cices_system.report.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProyectoFiltroDTO {
    private String texto;          // búsqueda por nombre o código
    private Short  estado;         // id del catálogo ESTADO_PROYECTO
    private List<Short>  tipos;    // ids de catálogo TIPO_PROYECTO
    private List<String> lineas;   // líneas de investigación
    private String institucion;    // institución (filtro opcional)
    private String ordenFecha;     // "asc" | "desc"  (por fechaInicio)
}