package org.example.backend_cices_system.dto;

import java.time.LocalDate;

public record CertificacionDTO(
        String nombreCertificacion,
        Short idCodigoTipoCertificacion,
        LocalDate fechaExpiracion,
        Short idCodigoTipoEstado
) {}