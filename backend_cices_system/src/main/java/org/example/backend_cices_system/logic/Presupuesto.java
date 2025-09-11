package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "PRESUPUESTO")
public class Presupuesto {
    @Id
    @Column(name = "ID_PRESUPUESTO", nullable = false)
    private Short id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PROYECTO", nullable = false)
    private Proyecto idProyecto;

    @Column(name = "FECHA_ASIGNACION")
    private LocalDate fechaAsignacion;

    @Column(name = "ID_CODIGO_FUENTE_FINANCIAMIENTO")
    private Short idCodigoFuenteFinanciamiento;

    @Column(name = "MONTO", precision = 8, scale = 2)
    private BigDecimal monto;

    @Column(name = "CANTIDAD_HORAS_MES")
    private Double cantidadHorasMes;

    @Column(name = "CANTIDAD_MESES")
    private Short cantidadMeses;

    @Column(name = "ID_CODIGO_TIPO_PRESUPUESTO")
    private Short idCodigoTipoPresupuesto;

}