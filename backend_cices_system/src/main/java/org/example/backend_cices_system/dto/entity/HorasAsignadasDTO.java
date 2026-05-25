package org.example.backend_cices_system.dto.entity;

public record HorasAsignadasDTO(
        Integer id,
        InvestigadorProyectoDTO investigador,
        Integer idPresupuesto,
        CodigoDTO modalidad,
        CodigoDTO tipoHora,
        Double cantidadHorasMes,
        Short cantidadMeses
) {}
