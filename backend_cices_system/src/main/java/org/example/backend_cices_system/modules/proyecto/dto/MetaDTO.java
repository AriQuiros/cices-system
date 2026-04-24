package org.example.backend_cices_system.modules.proyecto.dto;

import org.example.backend_cices_system.shared.catalogo.CodigoDTO;

import java.util.List;

public record MetaDTO (
        Integer id,
        CodigoDTO tipo, // CUANTITATIVA o CUALITATIVA
        Integer cantidad, // Solo se usa si es CUANTITATIVA
        String descripcion,
        List<IndicadorDTO> indicadores
){}