package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "INVESTIGADOR_PROYECTO")
public class InvestigadorProyecto {
    @Id
    @Column(name = "ID_INVESTIGADOR_PROYECTO", nullable = false)
    private Short id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_INVESTIGADOR", nullable = false)
    private Investigador idInvestigador;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_ROL_PROYECTO", nullable = false)
    private RolProyecto idRolProyecto;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PROYECTO", nullable = false)
    private Proyecto idProyecto;

    @Lob
    @Column(name = "ACTIVIDAD_PROYECTO")
    private String actividadProyecto;

}