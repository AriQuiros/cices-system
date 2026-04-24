package org.example.backend_cices_system.modules.proyecto.dto;

import org.example.backend_cices_system.shared.catalogo.CodigoDTO;

import java.time.LocalDate;

public record InformeDTO (
        Integer id,
        CodigoDTO tipoInforme, // Inicial, Final
        LocalDate fechaPresentacion,
        CodigoDTO estado // Pendiente o entregado
){}
