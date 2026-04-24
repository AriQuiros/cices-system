package org.example.backend_cices_system.modules.presupuesto.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "PRESUPUESTO_BIT")
public class PresupuestoBit {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PRESUPUESTO_BIT_id_gen")
    @SequenceGenerator(name = "PRESUPUESTO_BIT_id_gen", sequenceName = "SEC_PRESUPUESTO_BIT", allocationSize = 1)
    @Column(name = "ID_PRESUPUESTO_BIT", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "FEC_BIT", nullable = false)
    private LocalDate fecBit;

    @NotNull
    @Column(name = "ACC_BIT", nullable = false)
    private Character accBit;

    @NotNull
    @Column(name = "USU_BIT", nullable = false)
    private Integer usuBit;

    @NotNull
    @Column(name = "ID_PRESUPUESTO", nullable = false)
    private Integer idPresupuesto;

    @NotNull
    @Column(name = "ID_PROYECTO", nullable = false)
    private Integer idProyecto;

    @Column(name = "MONTO_ASIGNADO_OLD", precision = 9, scale = 2)
    private BigDecimal montoAsignadoOld;

    @Column(name = "CANTIDAD_HORAS_MES_OLD")
    private BigDecimal cantidadHorasMesOld;

    @Column(name = "CANTIDAD_MESES_OLD")
    private Short cantidadMesesOld;

}