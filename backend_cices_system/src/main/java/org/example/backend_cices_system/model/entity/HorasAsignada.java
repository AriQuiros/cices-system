package org.example.backend_cices_system.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "HORAS_ASIGNADAS")
public class HorasAsignada {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "HORAS_ASIGNADAS_id_gen")
    @SequenceGenerator(name = "HORAS_ASIGNADAS_id_gen", sequenceName = "SEC_HORAS_ASIGNADAS", allocationSize = 1)
    @Column(name = "ID_HORAS_ASIGNADAS", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_INVESTIGADOR_PROYECTO", nullable = false)
    private InvestigadorProyecto idInvestigadorProyecto;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PRESUPUESTO", nullable = false)
    private Presupuesto idPresupuesto;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_MODALIDAD", nullable = false)
    private Short idCodigoTipoModalidad;

    @Column(name = "ID_CODIGO_TIPO_HORA", nullable = false)
    private Short idCodigoTipoHora;

    @NotNull
    @Column(name = "CANTIDAD_HORAS_MES", nullable = false)
    private Double cantidadHorasMes;

    @NotNull
    @Column(name = "CANTIDAD_MESES", nullable = false)
    private Short cantidadMeses;


}