package org.example.backend_cices_system.dto;

import java.util.List;

public record MetaDTO (
    Integer id,
    CodigoDTO tipo, // CUANTITATIVA o CUALITATIVA
    Integer cantidad, // Solo se usa si es CUANTITATIVA
    String descripcion,
    List<IndicadorDTO> indicadores
){}