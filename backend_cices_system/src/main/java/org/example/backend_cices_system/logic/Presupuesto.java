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
import java.util.LinkedHashSet;
import java.util.Set;

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

    @Size(max = 50)
    @Column(name = "DESCRIPCION", nullable = false, length = 50)
    private String descripcion;

    @OneToMany(mappedBy = "idPresupuesto")
    private Set<Gasto> gastos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idPresupuesto")
    private Set<HorasAsignada> horasAsignadas = new LinkedHashSet<>();

}