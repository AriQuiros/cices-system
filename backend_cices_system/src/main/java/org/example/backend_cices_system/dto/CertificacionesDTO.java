package org.example.backend_cices_system.dto;

import java.time.LocalDate;
import java.util.Date;

public record CertificacionesDTO(String nombre, String tipoCertificacion, LocalDate fechaExpiracion, String estado) {
}
