package org.example.backend_cices_system.export.dto;

import java.util.List;

public record ObjetivoReporteDTO(
        String descripcion,
        List<MetaReporteDTO> metas
) {}