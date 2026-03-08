package org.example.backend_cices_system.dto;

import java.math.BigDecimal;
import java.util.List;

public record MetaDTO (
    Integer idMeta,
    String tipo, // CUANTITATIVA o CUALITATIVA
    BigDecimal cantidad, // Solo se usa si es CUANTITATIVA
    String descripcion,
    List<String> indicadores
){}