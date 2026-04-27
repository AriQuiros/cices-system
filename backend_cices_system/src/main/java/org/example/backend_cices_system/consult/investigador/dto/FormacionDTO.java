package org.example.backend_cices_system.consult.investigador.dto;

import java.time.LocalDate;

public record FormacionDTO(
        String identificacionInvestigador,
        String nombreInvestigador,
        String nombre, // certificacion
        String institucion,
        String tipo,
        String estado,
        LocalDate fecha
) {}