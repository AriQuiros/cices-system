package org.example.backend_cices_system.modules.investigadorProyecto.dto;

import org.example.backend_cices_system.shared.catalogo.CodigoDTO;

public record HorasAsignadasDTO(
        Integer id,
        InvestigadorProyectoDTO investigador,
        Integer idPresupuesto,
        CodigoDTO modalidad,
        CodigoDTO tipoHora,
        Double cantidadHorasMes,
        Short cantidadMeses
) {}
