package org.example.backend_cices_system.modules.proyecto.dto;

import org.example.backend_cices_system.shared.catalogo.CodigoDTO;
import org.example.backend_cices_system.shared.entidad.EntidadDTO;
import org.example.backend_cices_system.modules.investigadorProyecto.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.modules.presupuesto.dto.PresupuestoDTO;

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
