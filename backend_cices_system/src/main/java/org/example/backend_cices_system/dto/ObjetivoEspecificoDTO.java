package org.example.backend_cices_system.dto;

import java.util.List;

public record ObjetivoEspecificoDTO (
    Integer id,
    String categoria,
    String descripcion,
    List<MetaDTO> metas
){}
