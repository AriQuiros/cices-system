package org.example.backend_cices_system.modules.proyecto.dto;

import java.util.List;

public record ObjetivoEspecificoDTO (
    Integer id,
    String categoria,
    String descripcion,
    List<MetaDTO> metas
){}
