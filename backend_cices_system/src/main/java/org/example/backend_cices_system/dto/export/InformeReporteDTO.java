package org.example.backend_cices_system.dto.export;

import java.time.LocalDate;

public record InformeReporteDTO(
        String tipoInforme,
        String estado,
        LocalDate fechaPresentacion
) {}
