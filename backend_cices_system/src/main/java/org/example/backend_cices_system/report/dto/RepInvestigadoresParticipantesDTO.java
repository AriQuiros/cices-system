package org.example.backend_cices_system.report.dto;

import java.time.LocalDate;

public class RepInvestigadoresParticipantesDTO {

    private Long idProyecto;
    private String codigoProyecto;
    private String nombreProyecto;

    private Long idInvestigador;
    private String identificacion;
    private String nombreInvestigador;
    private String gradoAcademico;
    private String rolProyecto;

    private Long horasAsignadas;

    private LocalDate fechaInicioParticipacion;
    private LocalDate fechaFinParticipacion;

    public RepInvestigadoresParticipantesDTO() {
    }

    public RepInvestigadoresParticipantesDTO(
            Long idProyecto,
            String codigoProyecto,
            String nombreProyecto,
            Long idInvestigador,
            String identificacion,
            String nombreInvestigador,
            String gradoAcademico,
            String rolProyecto,
            Long horasAsignadas,
            LocalDate fechaInicioParticipacion,
            LocalDate fechaFinParticipacion
    ) {
        this.idProyecto = idProyecto;
        this.codigoProyecto = codigoProyecto;
        this.nombreProyecto = nombreProyecto;
        this.idInvestigador = idInvestigador;
        this.identificacion = identificacion;
        this.nombreInvestigador = nombreInvestigador;
        this.gradoAcademico = gradoAcademico;
        this.rolProyecto = rolProyecto;
        this.horasAsignadas = horasAsignadas;
        this.fechaInicioParticipacion = fechaInicioParticipacion;
        this.fechaFinParticipacion = fechaFinParticipacion;
    }

    public Long getIdProyecto() {
        return idProyecto;
    }

    public void setIdProyecto(Long idProyecto) {
        this.idProyecto = idProyecto;
    }

    public String getCodigoProyecto() {
        return codigoProyecto;
    }

    public void setCodigoProyecto(String codigoProyecto) {
        this.codigoProyecto = codigoProyecto;
    }

    public String getNombreProyecto() {
        return nombreProyecto;
    }

    public void setNombreProyecto(String nombreProyecto) {
        this.nombreProyecto = nombreProyecto;
    }

    public Long getIdInvestigador() {
        return idInvestigador;
    }

    public void setIdInvestigador(Long idInvestigador) {
        this.idInvestigador = idInvestigador;
    }

    public String getIdentificacion() {
        return identificacion;
    }

    public void setIdentificacion(String identificacion) {
        this.identificacion = identificacion;
    }

    public String getNombreInvestigador() {
        return nombreInvestigador;
    }

    public void setNombreInvestigador(String nombreInvestigador) {
        this.nombreInvestigador = nombreInvestigador;
    }

    public String getGradoAcademico() {
        return gradoAcademico;
    }

    public void setGradoAcademico(String gradoAcademico) {
        this.gradoAcademico = gradoAcademico;
    }

    public String getRolProyecto() {
        return rolProyecto;
    }

    public void setRolProyecto(String rolProyecto) {
        this.rolProyecto = rolProyecto;
    }

    public Long getHorasAsignadas() {
        return horasAsignadas;
    }

    public void setHorasAsignadas(Long horasAsignadas) {
        this.horasAsignadas = horasAsignadas;
    }

    public LocalDate getFechaInicioParticipacion() {
        return fechaInicioParticipacion;
    }

    public void setFechaInicioParticipacion(LocalDate fechaInicioParticipacion) {
        this.fechaInicioParticipacion = fechaInicioParticipacion;
    }

    public LocalDate getFechaFinParticipacion() {
        return fechaFinParticipacion;
    }

    public void setFechaFinParticipacion(LocalDate fechaFinParticipacion) {
        this.fechaFinParticipacion = fechaFinParticipacion;
    }
}