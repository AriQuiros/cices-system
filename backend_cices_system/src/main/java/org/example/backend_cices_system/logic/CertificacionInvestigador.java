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
@Table(name = "CERTIFICACION_INVESTIGADOR")
public class CertificacionInvestigador {
    @Id
    @Column(name = "ID_CERTIFICACION_INVESTIGADOR", nullable = false)
    private Short id;

    @NotNull
    @Column(name = "ID_CERTIFICACION", nullable = false)
    private Short idCertificacion;

    @Column(name = "ID_INVESTIGADOR")
    private Short idInvestigador;

}