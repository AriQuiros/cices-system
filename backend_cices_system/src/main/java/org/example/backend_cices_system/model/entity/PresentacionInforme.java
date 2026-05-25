package org.example.backend_cices_system.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "PRESENTACION_INFORME")
public class PresentacionInforme {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PRESENTACION_INFORME_id_gen")
    @SequenceGenerator(name = "PRESENTACION_INFORME_id_gen", sequenceName = "SEC_PRESENTACION_INFORME", allocationSize = 1)
    @Column(name = "ID_PRESENTACION_INFORME", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PROYECTO", nullable = false)
    private Proyecto idProyecto;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_INFORME", nullable = false)
    private Short idCodigoTipoInforme;

    @NotNull
    @Column(name = "FECHA_PRESENTACION", nullable = false)
    private LocalDate fechaPresentacion;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_ESTADO", nullable = false)
    private Short idCodigoTipoEstado;

}