package org.example.backend_cices_system.dto;

import java.time.LocalDate;
import java.util.List;

public record ProyectoDTO (
        Integer id,
    String codigoProyecto,
    String nombreProyecto,
    String descripcion,
    String objetivoGeneral,
    LocalDate fechaInicio,
    LocalDate fechaFinalizacion,
    String lineaInvestigacion,
    CodigoDTO tipoProyecto,
    CodigoDTO estado,
    String detalles,

    List<ObjetivoEspecificoDTO>objetivosEspecificos,
    List<PresupuestoDTO> presupuestos,
    List<DocumentoDTO> documentos,
    List<EntidadDTO> entidadesVinculadas,
    List<InformeDTO> presentacionesInformes,
    List<InvestigadorProyectoDTO> investigadoresVinculados
){}
