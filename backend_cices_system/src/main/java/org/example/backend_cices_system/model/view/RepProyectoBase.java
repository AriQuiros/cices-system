package org.example.backend_cices_system.model.view;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.time.LocalDate;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "REP_PROYECTO_BASE")
public class RepProyectoBase {
    @Id
    @NotNull
    @Column(name = "ID_PROYECTO", nullable = false)
    private Integer idProyecto;

    @Size(max = 254)
    @NotNull
    @Column(name = "CODIGO_PROYECTO", nullable = false, length = 254)
    private String codigoProyecto;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_PROYECTO", nullable = false, length = 254)
    private String nombreProyecto;

    @Lob
    @Column(name = "DESCRIPCION_PROYECTO")
    private String descripcionProyecto;

    @Lob
    @Column(name = "OBJETIVO_GENERAL")
    private String objetivoGeneral;

    @Size(max = 254)
    @NotNull
    @Column(name = "LINEA_INVESTIGACION", nullable = false, length = 254)
    private String lineaInvestigacion;

    @Size(max = 30)
    @Column(name = "ESTADO_PROYECTO", length = 30)
    private String estadoProyecto;

    @Size(max = 30)
    @Column(name = "TIPO_PROYECTO", length = 30)
    private String tipoProyecto;

    @NotNull
    @Column(name = "FECHA_INICIO", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "FECHA_FINALIZACION")
    private LocalDate fechaFinalizacion;

    @Lob
    @Column(name = "DETALLES_PROYECTOS")
    private String detallesProyectos;

}