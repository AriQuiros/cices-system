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

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "REP_PRESUPUESTO_BASE")
public class RepPresupuestoBase {
    @Id
    @NotNull
    @Column(name = "ID_PRESUPUESTO", nullable = false)
    private Integer idPresupuesto;

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

    @Size(max = 30)
    @Column(name = "TIPO_PRESUPUESTO", length = 30)
    private String tipoPresupuesto;

    @Size(max = 30)
    @Column(name = "FUENTE_FINANCIAMIENTO", length = 30)
    private String fuenteFinanciamiento;

    @Size(max = 30)
    @Column(name = "CATEGORIA_PRESUPUESTO", length = 30)
    private String categoriaPresupuesto;

    @Size(max = 254)
    @Column(name = "DESCRIPCION_PRESUPUESTO", length = 254)
    private String descripcionPresupuesto;

    @Column(name = "CANTIDAD_HORAS")
    private BigDecimal cantidadHoras;

    @Column(name = "CANTIDAD_MESES")
    private Short cantidadMeses;

    @Column(name = "MONTO_ASIGNADO", precision = 9, scale = 2)
    private BigDecimal montoAsignado;

    @Column(name = "FECHA_ASIGNACION")
    private LocalDate fechaAsignacion;

}