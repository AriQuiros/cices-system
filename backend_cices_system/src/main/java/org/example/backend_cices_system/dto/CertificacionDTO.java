package org.example.backend_cices_system.dto;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;

public record CertificacionDTO(
        @NotBlank @JsonProperty("nombreCertificacion")
        String nombreCertificacion,

        @NotNull @JsonProperty("idCodigoTipoCertificacion")
        Short idCodigoTipoCertificacion,

        @NotNull @FutureOrPresent @JsonProperty("fechaExpiracion")
        LocalDate fechaExpiracion,

        @NotNull @JsonProperty("idCodigoTipoEstado")
        Short idCodigoTipoEstado
) {}
