package org.example.backend_cices_system.dto;

import java.time.LocalDate;

public record TituloDTO(
        EntidadDTO entidadEmisora,
        String nombreTitulo,
        String nivelTitulo,
        LocalDate fechaEmision
) {}
