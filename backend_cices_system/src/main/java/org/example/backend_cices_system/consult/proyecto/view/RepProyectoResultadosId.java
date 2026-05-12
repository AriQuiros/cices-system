package org.example.backend_cices_system.consult.proyecto.view;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@EqualsAndHashCode
public class RepProyectoResultadosId implements Serializable {

    @Column(name = "ID_META", nullable = false)
    private Integer idMeta;

    // Nullable: filas sin indicador tienen null aquí. Hibernate lo acepta en vistas inmutables.
    @Column(name = "ID_INDICADOR")
    private Integer idIndicador;
}
