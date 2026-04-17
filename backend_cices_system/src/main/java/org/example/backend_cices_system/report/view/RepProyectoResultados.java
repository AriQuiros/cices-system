package org.example.backend_cices_system.report.view;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "REP_PROYECTO_RESULTADOS")
public class RepProyectoResultados {
    @Id
    @NotNull
    @Column(name = "ID_PROYECTO", nullable = false)
    private Integer idProyecto;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_PROYECTO", nullable = false, length = 254)
    private String nombreProyecto;

    @Size(max = 254)
    @NotNull
    @Column(name = "CODIGO_PROYECTO", nullable = false, length = 254)
    private String codigoProyecto;

    @NotNull
    @Column(name = "ID_OBJETIVO_ESPECIFICO", nullable = false)
    private Integer idObjetivoEspecifico;

    @Lob
    @Column(name = "OBJETIVO_ESPECIFICO")
    private String objetivoEspecifico;

    @NotNull
    @Column(name = "ID_META", nullable = false)
    private Integer idMeta;

    @Lob
    @Column(name = "META")
    private String meta;

    @Size(max = 30)
    @Column(name = "TIPO_META", length = 30)
    private String tipoMeta;

    @Column(name = "CANTIDAD_META")
    private Integer cantidadMeta;

    @Column(name = "ID_INDICADOR")
    private Integer idIndicador;

    @Lob
    @Column(name = "INDICADOR")
    private String indicador;

}