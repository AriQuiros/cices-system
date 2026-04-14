package org.example.backend_cices_system.report.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ProyectoReporteDTO {

    private String    codigoProyecto;
    private String    nombreProyecto;
    private String    lineaInvestigacion;
    private String    tipoProyecto;
    private String    estado;
    private LocalDate fechaInicio;
    private LocalDate fechaFinalizacion;

    public ProyectoReporteDTO(
            String    codigoProyecto,
            String    nombreProyecto,
            String    lineaInvestigacion,
            String    tipoProyecto,
            String    estado,
            LocalDate fechaInicio,
            LocalDate fechaFinalizacion
    ) {
        this.codigoProyecto     = codigoProyecto;
        this.nombreProyecto     = nombreProyecto;
        this.lineaInvestigacion = lineaInvestigacion;
        this.tipoProyecto       = tipoProyecto;
        this.estado             = estado;
        this.fechaInicio        = fechaInicio;
        this.fechaFinalizacion  = fechaFinalizacion;
    }
}