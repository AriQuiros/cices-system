package org.example.backend_cices_system.dto.view;


import java.util.List;

public record InvestigadorDetalleDTO (
    InvestigadorConsultaDTO investigador,
    List<FormacionDTO> certificaciones,
    List<FormacionDTO> titulos,
    List<String> proyectos

    ){}
