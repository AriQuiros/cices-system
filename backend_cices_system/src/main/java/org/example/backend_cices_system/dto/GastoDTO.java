package org.example.backend_cices_system.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class GastoDTO {
    private Integer idProyecto;
    private BigDecimal monto;
    private LocalDate fechaGasto;
    private String categoriaGasto;
    private String descripcion;
}