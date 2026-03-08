package org.example.backend_cices_system.report.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "REP_ENTIDAD_PROYECTO")
public class RepEntidadProyecto {
    @Id
    @NotNull
    @Column(name = "ID_ENTIDAD_PROYECTO", nullable = false)
    private Integer idEntidadProyecto;

    @NotNull
    @Column(name = "ID_PROYECTO", nullable = false)
    private Integer idProyecto;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_PROYECTO", nullable = false, length = 254)
    private String nombreProyecto;

    @Size(max = 254)
    @NotNull
    @Column(name = "CODIGO_PROYECTO", nullable = false, length = 254)
    private String codigoProyecto;

    @NotNull
    @Column(name = "ID_ENTIDAD", nullable = false)
    private Integer idEntidad;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_ENTIDAD", nullable = false, length = 254)
    private String nombreEntidad;

    @Size(max = 4)
    @NotNull
    @Column(name = "PAIS_ENTIDAD", nullable = false, length = 4)
    private String paisEntidad;

}