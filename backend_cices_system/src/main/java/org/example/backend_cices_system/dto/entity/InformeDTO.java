package org.example.backend_cices_system.dto.entity;

import java.time.LocalDate;

public record InformeDTO (
        Integer id,
        CodigoDTO tipoInforme, // Inicial, Final
        LocalDate fechaPresentacion,
        CodigoDTO estado // Pendiente o entregado
){}
