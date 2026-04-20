package org.example.backend_cices_system.report.dto;


import java.util.List;

public record InvestigadorDetalleDTO (
    String investigador,
    List<FormacionDTO> certificaciones,
    List<FormacionDTO> titulos,
    List<String> proyectos

    ){}
