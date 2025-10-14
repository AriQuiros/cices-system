package org.example.backend_cices_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InvestigadorHorasDTO {
    private Short idInvestigador;
    private String nombreCompleto;
    private double horasMesAsignadas; // suma de CANTIDAD_HORAS_MES
    private int mesesTotales;         // suma de CANTIDAD_MESES
}