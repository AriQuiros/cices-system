package org.example.backend_cices_system.consult.presupuesto.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "REP_PRESUPUESTO_HORAS")
public class RepPresupuestoHoras {
    @Id
    @NotNull
    @Column(name = "ID_HORAS_ASIGNADAS", nullable = false)
    private Integer idHorasAsignadas;

    @NotNull
    @Column(name = "ID_INVESTIGADOR_PROYECTO", nullable = false)
    private Integer idInvestigadorProyecto;

    @NotNull
    @Column(name = "ID_PRESUPUESTO", nullable = false)
    private Integer idPresupuesto;

    @NotNull
    @Column(name = "ID_PROYECTO", nullable = false)
    private Integer idProyecto;

    @Size(max = 20)
    @NotNull
    @Column(name = "IDENTIFICACION", nullable = false, length = 20)
    private String identificacion;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_COMPLETO", nullable = false, length = 254)
    private String nombreCompleto;

    @NotNull
    @Column(name = "CANTIDAD_HORAS_MES", nullable = false)
    private Double cantidadHorasMes;

    @NotNull
    @Column(name = "CANTIDAD_MESES", nullable = false)
    private Short cantidadMeses;

    @Size(max = 30)
    @Column(name = "MODALIDAD", length = 30)
    private String modalidad;

    @Size(max = 50)
    @NotNull
    @Column(name = "ROL_PROYECTO", nullable = false, length = 50)
    private String rolProyecto;

    @NotNull
    @Column(name = "FECHA_INICIO_INVESTIGADOR", nullable = false)
    private LocalDate fechaInicioInvestigador;

    @Column(name = "FECHA_FIN_INVESTIGADOR")
    private LocalDate fechaFinInvestigador;

    @Column(name = "TOTAL_HORAS_PLANIFICADAS", precision = 12, scale = 2)
    private BigDecimal totalHorasPlanificadas;


}