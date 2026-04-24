package org.example.backend_cices_system.modules.gasto.dto;

import java.math.BigDecimal;
import java.time.LocalDate;


public record GastoBitDTO(
        BitacoraDTO bitacora,
        Integer idGasto,
        BigDecimal montoOld,
        LocalDate fechaGastoOld,
        String descripcionOld
) {
}
