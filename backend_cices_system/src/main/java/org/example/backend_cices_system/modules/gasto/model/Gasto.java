package org.example.backend_cices_system.modules.gasto.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.example.backend_cices_system.modules.presupuesto.model.Presupuesto;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "GASTO")
public class Gasto {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "GASTO_id_gen")
    @SequenceGenerator(name = "GASTO_id_gen", sequenceName = "SEC_GASTO", allocationSize = 1)
    @Column(name = "ID_GASTO", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PRESUPUESTO", nullable = false)
    private Presupuesto idPresupuesto;

    @NotNull
    @Column(name = "MONTO", nullable = false, precision = 9, scale = 5)
    private BigDecimal monto;

    @NotNull
    @Column(name = "FECHA_GASTO", nullable = false)
    private LocalDate fechaGasto;

    @NotNull
    @Size(max = 254)
    @Column(name = "DESCRIPCION", length = 254)
    private String descripcion;

}