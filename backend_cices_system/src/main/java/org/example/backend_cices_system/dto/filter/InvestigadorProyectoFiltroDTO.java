package org.example.backend_cices_system.dto.filter;

import java.time.LocalDate;

public record InvestigadorProyectoFiltroDTO(
        Integer idInvestigador,
        String rol,
        LocalDate desde,
        LocalDate hasta

) {}