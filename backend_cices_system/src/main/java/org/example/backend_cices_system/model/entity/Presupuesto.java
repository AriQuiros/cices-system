package org.example.backend_cices_system.model.entity;

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
@Table(name = "PRESUPUESTO")
public class Presupuesto {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PRESUPUESTO_id_gen")
    @SequenceGenerator(name = "PRESUPUESTO_id_gen", sequenceName = "SEC_PRESUPUESTO", allocationSize = 1)
    @Column(name = "ID_PRESUPUESTO", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PROYECTO", nullable = false)
    private Proyecto idProyecto;

    @Column(name = "ID_CODIGO_TIPO_PRESUPUESTO")
    private Short idCodigoTipoPresupuesto;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_CATEGORIA", nullable = false)
    private Short idCodigoTipoCategoria;

    @Column(name = "ID_CODIGO_TIPO_FUENTE_FINANCIAMIENTO")
    private Short idCodigoTipoFuenteFinanciamiento;

    @Size(max = 254)
    @Column(name = "DESCRIPCION", length = 254)
    private String descripcion;

    @Column(name = "FECHA_ASIGNACION")
    private LocalDate fechaAsignacion;

    @Column(name = "CANTIDAD_HORAS_MES")
    private BigDecimal cantidadHorasMes;

    @Column(name = "CANTIDAD_MESES")
    private Short cantidadMeses;

    @Column(name = "MONTO_ASIGNADO", precision = 9, scale = 2)
    private BigDecimal montoAsignado;

}