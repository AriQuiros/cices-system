package org.example.backend_cices_system.report.filter;

import java.time.LocalDate;
import java.util.List;

public record InvestigadorProyectoFiltroDTO(
        // --- filtros de proyecto ---
        String texto,
        List<String> tipos,
        String estado,
        List<String> lineas,
        String ordenFecha,
        // --- filtros propios de la relación ---
        String rol,
        LocalDate desde,
        LocalDate hasta

) {}