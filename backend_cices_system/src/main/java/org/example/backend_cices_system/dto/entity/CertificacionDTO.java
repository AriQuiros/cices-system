package org.example.backend_cices_system.dto.entity;

import java.time.LocalDate;

public record CertificacionDTO(
        Integer id,
        EntidadDTO entidadEmisora,
        String nombreCertificacion,
        CodigoDTO tipoCertificacion,
        LocalDate fechaExpiracion,
        CodigoDTO estado
) {}
