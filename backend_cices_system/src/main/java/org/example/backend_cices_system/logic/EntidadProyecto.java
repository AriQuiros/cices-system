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
@Table(name = "ENTIDAD_PROYECTO")
public class EntidadProyecto {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ENTIDAD_PROYECTO_id_gen")
    @SequenceGenerator(name = "ENTIDAD_PROYECTO_id_gen", sequenceName = "SEC_ENTIDAD_PROYECTO", allocationSize = 1)
    @Column(name = "ID_ENTIDAD_PROYECTO", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_ENTIDAD", nullable = false)
    private Entidad idEntidad;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PROYECTO", nullable = false)
    private Proyecto idProyecto;

}