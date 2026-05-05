package org.example.backend_cices_system.export.dto;

import org.example.backend_cices_system.modules.proyecto.dto.ProyectoFechasDTO;
import java.util.List;

public record ReportePresupuestosListadoDTO(
        ProyectoFechasDTO proyecto,
        List<PresupuestoReporteDTO> presupuestos,
        Integer totalPresupuestos,
        Integer restantes
) {}