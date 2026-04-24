package org.example.backend_cices_system.consult.proyecto.view;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Immutable
@Table(name = "REP_INVESTIGADOR_PROYECTO")
public class RepInvestigadorProyecto {
    // INVESTIGADOR PROYECTO
    @Id
    @NotNull
    @Column(name = "ID_INVESTIGADOR_PROYECTO", nullable = false)
    private Integer idInvestigadorProyecto;

    @Size(max = 50)
    @NotNull
    @Column(name = "ROL_PROYECTO", nullable = false, length = 50)
    private String rolProyecto;

    @Lob
    @Column(name = "ACTIVIDAD_PROYECTO")
    private String actividadProyecto;

    @NotNull
    @Column(name = "FECHA_INICIO_INVESTIGADOR", nullable = false)
    private LocalDate fechaInicioInvestigador;

    @Column(name = "FECHA_FIN_INVESTIGADOR")
    private LocalDate fechaFinInvestigador;
    // INVESTIGADOR

    @NotNull
    @Column(name = "ID_INVESTIGADOR", nullable = false)
    private Integer idInvestigador;

    @Size(max = 20)
    @NotNull
    @Column(name = "IDENTIFICACION", nullable = false, length = 20)
    private String identificacion;

    // PROYECTO
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

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_INVESTIGADOR", nullable = false, length = 254)
    private String nombreInvestigador;

    @Size(max = 254)
    @NotNull
    @Column(name = "LINEA_INVESTIGACION", nullable = false, length = 254)
    private String lineaInvestigacion;

    @Size(max = 30)
    @Column(name = "ESTADO_PROYECTO", length = 30)
    private String estadoProyecto;

    @Size(max = 30)
    @Column(name = "TIPO_PROYECTO", length = 30)
    private String tipoProyecto;

    @NotNull
    @Column(name = "FECHA_INICIO", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "FECHA_FINALIZACION")
    private LocalDate fechaFinalizacion;

    // PERMISO COORDINADOR

    @Column(name = "ID_PERMISO_PROYECTO")
    private Integer idPermisoProyecto;

}