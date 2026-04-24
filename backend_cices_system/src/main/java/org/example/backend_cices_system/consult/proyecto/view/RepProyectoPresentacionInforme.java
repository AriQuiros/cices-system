package org.example.backend_cices_system.consult.proyecto.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "REP_PROYECTO_PRESENTACION_INFORME")
public class RepProyectoPresentacionInforme {
    @Id
    @NotNull
    @Column(name = "ID_PRESENTACION_INFORME", nullable = false)
    private Integer idPresentacionInforme;

    @NotNull
    @Column(name = "ID_PROYECTO", nullable = false)
    private Integer idProyecto;

    @Size(max = 30)
    @Column(name = "TIPO_INFORME", length = 30)
    private String tipoInforme;

    @Size(max = 30)
    @Column(name = "ESTADO_INFORME", length = 30)
    private String estadoInforme;

    @NotNull
    @Column(name = "FECHA_PRESENTACION", nullable = false)
    private LocalDate fechaPresentacion;

}