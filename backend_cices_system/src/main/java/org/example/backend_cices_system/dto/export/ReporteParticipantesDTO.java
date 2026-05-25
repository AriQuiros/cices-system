package org.example.backend_cices_system.dto.export;

import org.example.backend_cices_system.dto.entity.ProyectoFechasDTO;

import java.util.List;

public record ReporteParticipantesDTO(
        ProyectoFechasDTO proyecto,
        List<HorasAsignadasReporteDTO> participantes,
        Integer totalParticipantes,
        Integer restantes
) { }
