package org.example.backend_cices_system.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ProyectoDTO {
    private Integer idProyecto;
    private String nombreProyecto;
    private String codigoProyecto;
    private String descripcionProyecto;
    private String objetivoGeneralProyecto;
    private LocalDate fechaInicio;
    private LocalDate fechaFinalizacion;
    private String lineaInvestigacion;
    private String estado;
    private String tipoProyecto;
    private String detallesProyectos;

    private List<ObjetivoEspecificoDTO> objetivosEspecificos;
    private List<DocumentoDTO> documentos;
    private List<EntidadVinculadaDTO> entidadesVinculadas;
    private List<InformeDTO> presentacionesInforme;
}
