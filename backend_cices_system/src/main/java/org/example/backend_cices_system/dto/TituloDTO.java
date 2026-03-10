package org.example.backend_cices_system.dto;

import java.time.LocalDate;

public record TituloDTO(
        Integer id,
        EntidadDTO entidadEmisora,
        String nombreTitulo,
        CodigoDTO nivelTitulo,
        LocalDate fechaEmision
) {}
