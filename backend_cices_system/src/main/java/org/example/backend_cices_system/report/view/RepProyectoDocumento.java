package org.example.backend_cices_system.report.view;

import jakarta.persistence.*;
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
@Table(name = "REP_PROYECTO_DOCUMENTOS")
public class RepProyectoDocumento {
    @Id
    @NotNull
    @Column(name = "ID_DOCUMENTO", nullable = false)
    private Integer idDocumento;

    @NotNull
    @Column(name = "ID_PROYECTO", nullable = false)
    private Integer idProyecto;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_DOCUMENTO", nullable = false, length = 254)
    private String nombreDocumento;

}