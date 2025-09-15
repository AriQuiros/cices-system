package org.example.backend_cices_system.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ObjetivoEspecificoDTO {
    private String tipo;
    private String descripcion;
    private List<MetaDTO> metas;
}
