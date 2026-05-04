package org.example.backend_cices_system.modules.presupuesto.dto;

import org.example.backend_cices_system.modules.gasto.dto.BitacoraDTO;

import java.math.BigDecimal;

public record PresupuestoBitDTO(
        BitacoraDTO bitacora,
        Integer idPresupuesto,
        Integer idProyecto,
        BigDecimal montoAsignadoOld,
        BigDecimal cantidadHorasMesOld,
        Short cantidadMesesOld
) {}