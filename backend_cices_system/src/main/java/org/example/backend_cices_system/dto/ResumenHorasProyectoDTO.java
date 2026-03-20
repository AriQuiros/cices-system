package org.example.backend_cices_system.dto;

import java.util.List;

public record ResumenHorasProyectoDTO(
        String proyectoNombre,
        Double totalHorasAsignadas,
        Double totalHorasDisponibles,
        List<InvestigadorHorasDTO> investigadores
) {}
