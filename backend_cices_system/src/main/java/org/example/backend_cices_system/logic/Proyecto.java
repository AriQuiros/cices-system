package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "PROYECTO")
public class Proyecto {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PROYECTO_id_gen")
    @SequenceGenerator(name = "PROYECTO_id_gen", sequenceName = "SEC_PROYECTO", allocationSize = 1)
    @Column(name = "ID_PROYECTO", nullable = false)
    private Integer id;

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

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_ESTADO", nullable = false)
    private Short idCodigoTipoEstado;

    @Size(max = 254)
    @NotNull
    @Column(name = "LINEA_INVESTIGACION", nullable = false, length = 254)
    private String lineaInvestigacion;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_PROYECTO", nullable = false)
    private Short idCodigoTipoProyecto;

    @NotNull
    @Column(name = "FECHA_INICIO", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "FECHA_FINALIZACION")
    private LocalDate fechaFinalizacion;

    @Lob
    @Column(name = "DETALLES_PROYECTOS")
    private String detallesProyectos;

}