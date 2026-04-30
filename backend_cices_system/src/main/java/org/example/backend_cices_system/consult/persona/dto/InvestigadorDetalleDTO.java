package org.example.backend_cices_system.consult.persona.dto;


import org.example.backend_cices_system.consult.investigador.dto.FormacionDTO;

import java.util.List;

public record InvestigadorDetalleDTO (
    InvestigadorConsultaDTO investigador,
    List<FormacionDTO> certificaciones,
    List<FormacionDTO> titulos,
    List<String> proyectos

    ){}
