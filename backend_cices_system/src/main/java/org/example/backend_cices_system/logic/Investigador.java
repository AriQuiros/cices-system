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
    @Column(name = "ID_INVESTIGADOR", nullable = false)
    private Short id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_EMPLEADO", nullable = false)
    private Empleado idEmpleado;

    @Size(max = 50)
    @NotNull
    @Column(name = "UNIDAD_ACADEMICA", nullable = false, length = 50)
    private String unidadAcademica;

    @Size(max = 50)
    @NotNull
    @Column(name = "INSTITUCION_ORIGEN", nullable = false, length = 50)
    private String institucionOrigen;

    @NotNull
    @Column(name = "ID_CODIGO_GRADO_ACADEMICO", nullable = false)
    private Short idCodigoGradoAcademico;

    @OneToMany(mappedBy = "idInvestigador")
    private Set<Certificacion> certificacions = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idInvestigador")
    private Set<InvestigadorProyecto> investigadorProyectos = new LinkedHashSet<>();

}