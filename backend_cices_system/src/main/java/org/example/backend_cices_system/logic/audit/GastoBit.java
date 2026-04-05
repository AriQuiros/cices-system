package org.example.backend_cices_system.logic.audit;

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
@Table(name = "GASTO_BIT")
public class GastoBit {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "GASTO_BIT_id_gen")
    @SequenceGenerator(name = "GASTO_BIT_id_gen", sequenceName = "SEC_GASTO_BIT", allocationSize = 1)
    @Column(name = "ID_GASTO_BIT", nullable = false)
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

    @Column(name = "ID_GASTO")
    private Integer idGasto;

    @Column(name = "ID_PRESUPUESTO")
    private Integer idPresupuesto;

    @Column(name = "MONTO_OLD", precision = 9, scale = 2)
    private BigDecimal montoOld;

    @Column(name = "FECHA_GASTO_OLD")
    private LocalDate fechaGastoOld;

    @Size(max = 254)
    @Column(name = "DESCRIPCION_OLD", length = 254)
    private String descripcionOld;


}