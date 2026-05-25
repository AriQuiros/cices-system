package org.example.backend_cices_system.dto.auditory;

import java.time.LocalDate;

public record BitacoraDTO(
        Long idBitacora,
        LocalDate fecha,
        Character accion,
        String nombreUsuario
) {
}
