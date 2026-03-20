package org.example.backend_cices_system.report.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "REP_PROYECTO_PRESENTACION_INFORME")
public class RepProyectoPresentacionInforme {
    @Id
    @NotNull
    @Column(name = "ID_PRESENTACION_INFORME", nullable = false)
    private Integer idPresentacionInforme;

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

    @Size(max = 30)
    @Column(name = "TIPO_INFORME", length = 30)
    private String tipoInforme;

    @Size(max = 30)
    @Column(name = "ESTADO_INFORME", length = 30)
    private String estadoInforme;

    @NotNull
    @Column(name = "FECHA_PRESENTACION", nullable = false)
    private LocalDate fechaPresentacion;
    @NotNull
    @Column(name = "ID_CODIGO_TIPO_INFORME", nullable = false)
    private Short idCodigoTipoInforme;
    @NotNull
    @Column(name = "ID_CODIGO_TIPO_ESTADO", nullable = false)
    private Short idCodigoTipoEstado;

}