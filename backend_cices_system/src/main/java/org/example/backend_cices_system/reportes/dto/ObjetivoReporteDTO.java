package org.example.backend_cices_system.reportes.dto;

import java.util.List;

public record ObjetivoReporteDTO(
        String descripcion,
        List<MetaReporteDTO> metas
) {}