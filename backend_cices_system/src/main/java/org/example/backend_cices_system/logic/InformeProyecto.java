package org.example.backend_cices_system.logic;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "INFORME_PROYECTO")
public class InformeProyecto {
    @Id
    @Column(name = "ID_INFORME_PROYECTO", nullable = false)
    private Short id;

    @NotNull
    @Column(name = "ID_PROYECTO", nullable = false)
    private Short idProyecto;

    @NotNull
    @Column(name = "ID_PRESENTACION_INFORME", nullable = false)
    private Short idPresentacionInforme;

}