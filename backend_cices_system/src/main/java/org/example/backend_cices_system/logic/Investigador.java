package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "INVESTIGADOR")
public class Investigador {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "INVESTIGADOR_id_gen")
    @SequenceGenerator(name = "INVESTIGADOR_id_gen", sequenceName = "SEC_INVESTIGADOR", allocationSize = 1)
    @Column(name = "ID_INVESTIGADOR", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_EMPLEADO", nullable = false)
    private Empleado idEmpleado;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_INSTITUCION_ORIGEN", nullable = false)
    private Entidad idInstitucionOrigen;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_UNIDAD_ACADEMICA", nullable = false)
    private Entidad idUnidadAcademica;

    @Size(max = 254)
    @Column(name = "TEMA_INTERES", length = 254)
    private String temaInteres;

}