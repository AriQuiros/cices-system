package org.example.backend_cices_system.report.audit;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    @Column(name = "ID_BIT", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "FEC_BIT", nullable = false)
    private LocalDate fecBit;

    @NotNull
    @Column(name = "ACC_BIT", nullable = false)
    private Character accBit;

    @Size(max = 30)
    @NotNull
    @Column(name = "USU_BIT", nullable = false, length = 30)
    private String usuBit;

    @NotNull
    @Column(name = "ID_PRESUPUESTO", nullable = false)
    private Integer idPresupuesto;

    @NotNull
    @Column(name = "ID_PROYECTO", nullable = false)
    private Integer idProyecto;

    @Column(name = "MONTO_ASIGNADO_OLD", precision = 9, scale = 2)
    private BigDecimal montoAsignadoOld;

    @Column(name = "CANTIDAD_HORAS_MES_OLD")
    private Double cantidadHorasMesOld;

    @Column(name = "CANTIDAD_MESES_OLD")
    private Short cantidadMesesOld;

    @Column(name = "MONTO_ASIGNADO_NEW", precision = 9, scale = 2)
    private BigDecimal montoAsignadoNew;

    @Column(name = "CANTIDAD_HORAS_MES_NEW")
    private Double cantidadHorasMesNew;

    @Column(name = "CANTIDAD_MESES_NEW")
    private Short cantidadMesesNew;

}