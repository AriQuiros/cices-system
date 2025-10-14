package org.example.backend_cices_system.dto;

import java.time.LocalDate;

public record AsignacionReqDTO(
        Short investigadorId,
        Short rolProyectoId,
        Integer horasMes,
        Integer meses,
        LocalDate ini,
        LocalDate fin
) {}
