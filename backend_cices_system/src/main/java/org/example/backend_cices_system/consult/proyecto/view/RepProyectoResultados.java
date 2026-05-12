package org.example.backend_cices_system.consult.proyecto.view;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

@Getter
@Setter
@Entity
@Immutable
@Table(name = "REP_PROYECTO_RESULTADOS")
@IdClass(RepProyectoResultadosId.class)
public class RepProyectoResultados {

    // ── Clave compuesta ─────────────────────────────────────────────────────
    // idMeta identifica la meta, idIndicador puede ser null (meta sin indicadores).
    // El par (idMeta, idIndicador) es único por fila en la vista.

    @Id
    @NotNull
    @Column(name = "ID_META", nullable = false)
    private Integer idMeta;

    @Id
    @Column(name = "ID_INDICADOR")
    private Integer idIndicador;

    // ── Resto de columnas ───────────────────────────────────────────────────

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

    @Lob
    @Column(name = "META")
    private String meta;

    @Size(max = 30)
    @Column(name = "TIPO_META", length = 30)
    private String tipoMeta;

    @Column(name = "CANTIDAD_META")
    private Integer cantidadMeta;

    @Lob
    @Column(name = "INDICADOR")
    private String indicador;
}