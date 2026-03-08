package org.example.backend_cices_system.dto;

import java.time.LocalDate;
import java.util.List;

public record ProyectoDTO (
    String codigo,
    String nombre,
    String descripcion,
    String objetivoGeneral,
    LocalDate fechaInicio,
    LocalDate fechaFinalizacion,
    String lineaInvestigacion,
    String tipoProyecto,
    String estado,
    String detalles,

    List<ObjetivoEspecificoDTO>objetivosEspecificos,
    List<PresupuestoDTO> presupuestos,
    List<DocumentoDTO> documentos,
    List<EntidadDTO> entidadesVinculadas,
    List<InformeDTO> presentacionesInformes,
    List<InvestigadorProyectoDTO> investigadoresVinculados
){}
