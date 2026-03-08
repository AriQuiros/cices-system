package org.example.backend_cices_system.dto;

import java.time.LocalDate;

public record InformeDTO (
    Integer idInforme,
    String tipoInforme, // Inicial, Final
    LocalDate fechaPresentacion,
    String estado // Pendiente o entregado
){}
