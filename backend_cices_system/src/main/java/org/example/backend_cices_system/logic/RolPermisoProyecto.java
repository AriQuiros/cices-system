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
@Table(name = "ROL_PERMISO_PROYECTO")
public class RolPermisoProyecto {
    @Id
    @Column(name = "ID_ROL_PERMISO_PROYECTO", nullable = false)
    private Short id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_ROL_PROYECTO", nullable = false)
    private RolProyecto idRolProyecto;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PERMISO_PROYECTO", nullable = false)
    private PermisoProyecto idPermisoProyecto;


}