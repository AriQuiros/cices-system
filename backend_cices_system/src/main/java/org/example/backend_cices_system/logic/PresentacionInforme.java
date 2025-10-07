package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "PRESENTACION_INFORME")
public class PresentacionInforme {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEC_PRESENTACION_INFORME")
    @SequenceGenerator(name = "SEC_PRESENTACION_INFORME", sequenceName = "SEC_PRESENTACION_INFORME", allocationSize = 1)
    @Column(name = "ID_PRESENTACION_INFORME", nullable = false)
    private Short id;

    @Size(max = 50)
    @NotNull
    @Column(name = "DESCRIPCION", nullable = false, length = 50)
    private String descripcion;

    @NotNull
    @Column(name = "FECHA_PRESENTACION", nullable = false)
    private LocalDate fechaPresentacion;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PROYECTO")
    private Proyecto idProyecto;

    @NotNull
    @Column(name = "ID_CODIGO_ESTADO", nullable = false)
    private Short idCodigoEstado;

}