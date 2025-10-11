package org.example.backend_cices_system.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
public class InformeDTO {
    private Short idInforme;
    private String descripcion;
    private LocalDate fechaPresentacion;
    private String codigoEstado;
}
