package org.example.backend_cices_system.reportes.dto;

import java.util.List;

public record MetaReporteDTO(
        String descripcion,
        String tipoMeta,
        String cantidad,
        List<IndicadorReporteDTO> indicadores
) {}
