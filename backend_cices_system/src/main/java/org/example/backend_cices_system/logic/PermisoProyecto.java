package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "PERMISO_PROYECTO")
public class PermisoProyecto {
    @Id
    @Column(name = "ID_PERMISO_PROYECTO", nullable = false)
    private Short id;

    @Size(max = 20)
    @NotNull
    @Column(name = "NOMBRE_PERMISO_PROYECTO", nullable = false, length = 20)
    private String nombrePermisoProyecto;

    @OneToMany(mappedBy = "idPermisoProyecto")
    private Set<RolPermisoProyecto> rolPermisoProyectos = new LinkedHashSet<>();

}