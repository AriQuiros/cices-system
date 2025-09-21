package org.example.backend_cices_system.dto;

public record DirectorResumenDTO(
        int certsPorVencer,
        long investigadoresActivos,
        long totalInvestigadores,
        long personalAdministrativo,
        long totalProyectos,
        long investigadoresAsignados
) {}
