package org.example.backend_cices_system.dto.auditory;

import java.math.BigDecimal;

public record PresupuestoBitDTO(
        BitacoraDTO bitacora,
        Integer idPresupuesto,
        Integer idProyecto,
        BigDecimal montoAsignadoOld,
        BigDecimal cantidadHorasMesOld,
        Short cantidadMesesOld
) {}