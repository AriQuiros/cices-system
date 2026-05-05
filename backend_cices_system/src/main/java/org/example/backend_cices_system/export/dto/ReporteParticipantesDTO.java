package org.example.backend_cices_system.export.dto;

import org.example.backend_cices_system.modules.proyecto.dto.ProyectoFechasDTO;

import java.util.List;

public record ReporteParticipantesDTO(
        ProyectoFechasDTO proyecto,
        List<HorasAsignadasReporteDTO> participantes,
        Integer totalParticipantes,
        Integer restantes
) { }
