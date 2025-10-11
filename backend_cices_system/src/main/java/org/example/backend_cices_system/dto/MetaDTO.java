package org.example.backend_cices_system.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class MetaDTO {
    private Short idMeta;
    private String tipo; // CUANTITATIVA o CUALITATIVA
    private BigDecimal cantidad; // Solo se usa si es CUANTITATIVA
    private String descripcion;
    private List<String> indicadores;
}