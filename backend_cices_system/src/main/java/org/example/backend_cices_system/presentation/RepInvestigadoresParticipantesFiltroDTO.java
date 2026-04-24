package org.example.backend_cices_system.presentation;

public class RepInvestigadoresParticipantesFiltroDTO {

    private String codigoProyecto;
    private String nombreProyecto;
    private Long idTipoProyecto;
    private Long idEstadoProyecto;
    private String lineaInvestigacion;
    private String formato;
    private String orden;

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

    public Long getIdTipoProyecto() {
        return idTipoProyecto;
    }

    public void setIdTipoProyecto(Long idTipoProyecto) {
        this.idTipoProyecto = idTipoProyecto;
    }

    public Long getIdEstadoProyecto() {
        return idEstadoProyecto;
    }

    public void setIdEstadoProyecto(Long idEstadoProyecto) {
        this.idEstadoProyecto = idEstadoProyecto;
    }

    public String getLineaInvestigacion() {
        return lineaInvestigacion;
    }

    public void setLineaInvestigacion(String lineaInvestigacion) {
        this.lineaInvestigacion = lineaInvestigacion;
    }

    public String getFormato() {
        return formato;
    }

    public void setFormato(String formato) {
        this.formato = formato;
    }

    public String getOrden() {
        return orden;
    }

    public void setOrden(String orden) {
        this.orden = orden;
    }
}