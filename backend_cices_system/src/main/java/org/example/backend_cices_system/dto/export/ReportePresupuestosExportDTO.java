package org.example.backend_cices_system.dto.export;

import org.example.backend_cices_system.dto.entity.ProyectoFechasDTO;
import java.util.List;

public record ReportePresupuestosExportDTO(
        ProyectoFechasDTO proyecto,
        List<PresupuestoConBitacorasReporteDTO> presupuestos
) {}