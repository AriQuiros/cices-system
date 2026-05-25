package org.example.backend_cices_system.dto.export;

import org.example.backend_cices_system.dto.entity.ProyectoFechasDTO;
import java.util.List;

public record ReportePresupuestosListadoDTO(
        ProyectoFechasDTO proyecto,
        List<PresupuestoReporteDTO> presupuestos,
        Integer totalPresupuestos,
        Integer restantes
) {}