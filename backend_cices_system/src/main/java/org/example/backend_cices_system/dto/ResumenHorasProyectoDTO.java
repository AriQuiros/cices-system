package org.example.backend_cices_system.dto;

import lombok.Data;

import java.util.List;

@Data
public class ResumenHorasProyectoDTO {
    private Short proyectoId;
    private String proyectoNombre;
    private List<InvestigadorHorasDTO> investigadores;
    private double totalHorasAsignadas;   // suma de horas/mes (todas las filas)
    private int totalHorasDisponibles;    // suma por investigador según tipo horas
}
