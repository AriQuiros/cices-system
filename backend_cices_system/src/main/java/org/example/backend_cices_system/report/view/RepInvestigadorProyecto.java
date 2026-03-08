package org.example.backend_cices_system.report.view;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.time.LocalDate;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "REP_INVESTIGADOR_PROYECTO")
public class RepInvestigadorProyecto {
    @Id
    @NotNull
    @Column(name = "ID_INVESTIGADOR_PROYECTO", nullable = false)
    private Integer idInvestigadorProyecto;

    @NotNull
    @Column(name = "ID_INVESTIGADOR", nullable = false)
    private Integer idInvestigador;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_INVESTIGADOR", nullable = false, length = 254)
    private String nombreInvestigador;

    @Size(max = 20)
    @NotNull
    @Column(name = "IDENTIFICACION", nullable = false, length = 20)
    private String identificacion;

    @Size(max = 254)
    @NotNull
    @Column(name = "CORREO_INVESTIGADOR", nullable = false, length = 254)
    private String correoInvestigador;

    @NotNull
    @Column(name = "ID_PROYECTO", nullable = false)
    private Integer idProyecto;

    @Size(max = 254)
    @NotNull
    @Column(name = "CODIGO_PROYECTO", nullable = false, length = 254)
    private String codigoProyecto;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_PROYECTO", nullable = false, length = 254)
    private String nombreProyecto;

    @Size(max = 50)
    @NotNull
    @Column(name = "ROL_EN_PROYECTO", nullable = false, length = 50)
    private String rolEnProyecto;

    @Lob
    @Column(name = "ACTIVIDAD_PROYECTO")
    private String actividadProyecto;

    @NotNull
    @Column(name = "FECHA_INICIO_INVESTIGADOR", nullable = false)
    private LocalDate fechaInicioInvestigador;

    @Column(name = "FECHA_FIN_INVESTIGADOR")
    private LocalDate fechaFinInvestigador;

}