package org.example.backend_cices_system.model.view;

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

    @Size(max = 254)
    @NotNull
    @Column(name = "CODIGO_PROYECTO", nullable = false, length = 254)
    private String codigoProyecto;

    @NotNull
    @Column(name = "ID_PROYECTO", nullable = false)
    private Integer idProyecto;

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
    @Column(name = "DESCRIPCION", length = 254)
    private String descripcionPresupuesto;

    @Column(name = "CANTIDAD_HORAS_MES")
    private BigDecimal cantidadHoras;

    @Column(name = "CANTIDAD_MESES")
    private Short cantidadMeses;

    @Column(name = "FECHA_ASIGNACION")
    private LocalDate fechaAsignacion;

    //RESUMEN - GASTOS
    @Column(name = "MONTO_ASIGNADO", precision = 9, scale = 2)
    private BigDecimal montoAsignado;

    @Column(name = "TOTAL_GASTADO", precision = 12, scale = 2)
    private BigDecimal totalGastado;

    @Column(name = "MONTO_DISPONIBLE", precision = 12, scale = 2)
    private BigDecimal montoDisponible;

    @Column(name = "CANTIDAD_GASTOS")
    private Long cantidadGastos;

    //RESUMEN - HORAS
    @Column(name = "HORAS_ASIGNADAS", precision = 12, scale = 2)
    private BigDecimal horasAsignadas;

    @Column(name = "HORAS_USADAS", precision = 12, scale = 2)
    private BigDecimal horasUsadas;

    @Column(name = "HORAS_DISPONIBLES", precision = 12, scale = 2)
    private BigDecimal horasDisponibles;

    @Column(name = "CANTIDAD_REGISTROS_HORAS")
    private Long cantidadRegistrosHoras;

}