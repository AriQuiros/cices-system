package org.example.backend_cices_system.logic;

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
    @Column(name = "ID_HORAS_ASIGNADAS", nullable = false)
    private Short id;

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
    @Column(name = "CANTIDAD_HORAS_MES", nullable = false)
    private Double cantidadHorasMes;

    @NotNull
    @Column(name = "CANTIDAD_MESES", nullable = false)
    private Short cantidadMeses;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_HORAS", nullable = false)
    private Short idCodigoTipoHoras;


}