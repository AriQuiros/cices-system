package org.example.backend_cices_system.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ObjetivoEspecificoDTO {
    private Short idObjetivo;
    private String categoria;
    private String descripcion;
    private List<MetaDTO> metas;
}