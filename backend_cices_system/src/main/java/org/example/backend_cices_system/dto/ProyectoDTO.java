package org.example.backend_cices_system.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ProyectoDTO {
    private Short idProyecto;
    private String nombre;
    private String codigo;
    private String descripcion;
    private String objetivoGeneral;
    private LocalDate fechaInicio;
    private LocalDate fechaFinalizacion;
    private String lineaInvestigacion;
    private String estado;
    private String tipo;
    private String detalles;

    private List<ObjetivoEspecificoDTO> objetivosEspecificos;
    private List<DocumentoDTO> documentos;
    private List<EntidadVinculadaDTO> entidadesVinculadas;
    private List<InformeDTO> presentacionesInformes;
}
