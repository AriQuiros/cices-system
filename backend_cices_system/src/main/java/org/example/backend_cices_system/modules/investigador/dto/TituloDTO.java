package org.example.backend_cices_system.modules.investigador.dto;

import org.example.backend_cices_system.shared.catalogo.CodigoDTO;
import org.example.backend_cices_system.shared.entidad.EntidadDTO;

import java.time.LocalDate;

public record TituloDTO(
        Integer id,
        EntidadDTO entidadEmisora,
        String nombreTitulo,
        CodigoDTO nivelTitulo,
        LocalDate fechaEmision
) {}
