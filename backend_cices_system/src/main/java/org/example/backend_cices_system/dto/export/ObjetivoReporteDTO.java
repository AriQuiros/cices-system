package org.example.backend_cices_system.dto.export;

import java.util.List;

public record ObjetivoReporteDTO(
        String descripcion,
        List<MetaReporteDTO> metas
) {}