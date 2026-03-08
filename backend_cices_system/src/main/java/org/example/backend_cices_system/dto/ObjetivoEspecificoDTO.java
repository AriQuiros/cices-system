package org.example.backend_cices_system.dto;

import java.util.List;

public record ObjetivoEspecificoDTO (
    Integer idObjetivo,
    String categoria,
    String descripcion,
    List<MetaDTO> metas
){}
