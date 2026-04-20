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
@Table(name = "REP_PRESUPUESTO_GASTOS")
public class RepPresupuestoGastos {
    @Id
    @NotNull
    @Column(name = "ID_GASTO", nullable = false)
    private Integer idGasto;

    @NotNull
    @Column(name = "ID_PRESUPUESTO", nullable = false)
    private Integer idPresupuesto;

    @NotNull
    @Column(name = "ID_PROYECTO", nullable = false)
    private Integer idProyecto;

    @NotNull
    @Column(name = "MONTO", nullable = false, precision = 9, scale = 2)
    private BigDecimal monto;

    @NotNull
    @Column(name = "FECHA_GASTO", nullable = false)
    private LocalDate fechaGasto;

    @Size(max = 254)
    @NotNull
    @Column(name = "DESCRIPCION", nullable = false, length = 254)
    private String descripcion;
}