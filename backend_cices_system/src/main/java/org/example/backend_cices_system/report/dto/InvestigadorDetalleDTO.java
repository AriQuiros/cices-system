package org.example.backend_cices_system.report.dto;


import java.util.List;

public record InvestigadorDetalleDTO (
    String id,
    List<FormacionDTO> certificaciones,
    List<FormacionDTO> titulos,
    List<ProyectoCodigoDTO> proyectos

    ){}
