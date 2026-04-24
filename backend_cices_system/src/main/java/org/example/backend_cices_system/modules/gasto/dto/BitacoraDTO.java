package org.example.backend_cices_system.modules.gasto.dto;

import java.time.LocalDate;

public record BitacoraDTO(
        Long idBitacora,
        LocalDate fecha,
        Character accion,
        String nombreUsuario
) {
}
