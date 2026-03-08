package org.example.backend_cices_system.dto;

import java.time.LocalDate;

public record CertificacionDTO(
        EntidadDTO entidadEmisora,
        String nombreCertificacion,
        String tipoCertificacion,
        LocalDate fechaExpiracion,
        String estado
) {}
