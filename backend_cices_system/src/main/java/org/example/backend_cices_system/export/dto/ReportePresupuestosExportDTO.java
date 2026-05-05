package org.example.backend_cices_system.export.dto;

import org.example.backend_cices_system.modules.proyecto.dto.ProyectoFechasDTO;
import java.util.List;

public record ReportePresupuestosExportDTO(
        ProyectoFechasDTO proyecto,
        List<PresupuestoConBitacorasReporteDTO> presupuestos
) {}