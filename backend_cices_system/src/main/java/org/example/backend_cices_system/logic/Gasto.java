package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
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
    @Column(name = "ID_GASTO", nullable = false)
    private Short id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PRESUPUESTO", nullable = false)
    private Presupuesto idPresupuesto;

    @NotNull
    @Column(name = "MONTO", nullable = false, precision = 8, scale = 2)
    private BigDecimal monto;

    @NotNull
    @Column(name = "FECHA_GASTO", nullable = false)
    private LocalDate fechaGasto;

    @Size(max = 50)
    @NotNull
    @Column(name = "CATEGORIA_GASTO", nullable = false, length = 50)
    private String categoriaGasto;

    @NotNull
    @Lob
    @Column(name = "DESCRIPCION", nullable = false)
    private String descripcion;


}