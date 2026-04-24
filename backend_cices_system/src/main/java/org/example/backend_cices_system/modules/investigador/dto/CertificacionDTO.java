package org.example.backend_cices_system.modules.investigador.dto;

import org.example.backend_cices_system.shared.catalogo.CodigoDTO;
import org.example.backend_cices_system.shared.entidad.EntidadDTO;

import java.time.LocalDate;

public record CertificacionDTO(
        Integer id,
        EntidadDTO entidadEmisora,
        String nombreCertificacion,
        CodigoDTO tipoCertificacion,
        LocalDate fechaExpiracion,
        CodigoDTO estado
) {}
