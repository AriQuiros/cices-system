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
@Table(name = "PRESUPUESTO_PROYECTO")
public class PresupuestoProyecto {
    @Id
    @Column(name = "ID_PRESUPUESTO_PROYECTO", nullable = false)
    private Short id;

    @NotNull
    @Column(name = "ID_PROYECTO", nullable = false)
    private Short idProyecto;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_PRESUPUESTO", nullable = false)
    private Short idCodigoTipoPresupuesto;

    @NotNull
    @Column(name = "ID_PRESUPUESTO", nullable = false)
    private Short idPresupuesto;

}