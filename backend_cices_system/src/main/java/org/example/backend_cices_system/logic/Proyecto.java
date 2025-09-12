package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "PROYECTO")
public class Proyecto {
    @Id
    @Column(name = "ID_PROYECTO", nullable = false)
    private Short id;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_PROYECTO", nullable = false, length = 254)
    private String nombreProyecto;

    @Size(max = 20)
    @NotNull
    @Column(name = "CODIGO_PROYECTO", nullable = false, length = 20)
    private String codigoProyecto;

    @NotNull
    @Column(name = "FECHA_INICIO", nullable = false)
    private LocalDate fechaInicio;

    @NotNull
    @Column(name = "ID_CODIGO_ESTADO", nullable = false)
    private Short idCodigoEstado;

    @Lob
    @Column(name = "DETALLES_PROYECTOS")
    private String detallesProyectos;

    @Size(max = 254)
    @NotNull
    @Column(name = "LINEA_INVESTIGACION", nullable = false, length = 254)
    private String lineaInvestigacion;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_PROYECTO", nullable = false)
    private Short idCodigoTipoProyecto;

    @Column(name = "FECHA_FINALIZACION")
    private LocalDate fechaFinalizacion;

    @OneToMany(mappedBy = "idProyecto")
    private Set<Documento> documentos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idProyecto")
    private Set<InstitucionParticipante> institucionParticipantes = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idProyecto")
    private Set<InvestigadorProyecto> investigadorProyectos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idProyecto")
    private Set<ObjetivoEspecifico> objetivoEspecificos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idProyecto")
    private Set<PresentacionInforme> presentacionInformes = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idProyecto")
    private Set<Presupuesto> presupuestos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idProyecto")
    private Set<SitioInvestigacion> sitioInvestigacions = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idProyecto")
    private Set<UnidadVinculada> unidadVinculadas = new LinkedHashSet<>();

}