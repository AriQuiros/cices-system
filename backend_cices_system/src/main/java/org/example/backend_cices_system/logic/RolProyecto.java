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
@Table(name = "ROL_PROYECTO")
public class RolProyecto {
    @Id
    @Column(name = "ID_ROL_PROYECTO", nullable = false)
    private Short id;

    @Size(max = 20)
    @NotNull
    @Column(name = "NOMBRE_PERMISO", nullable = false, length = 20)
    private String nombrePermiso;

    @OneToMany(mappedBy = "idRolProyecto")
    private Set<InvestigadorProyecto> investigadorProyectos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idRolProyecto")
    private Set<RolPermisoProyecto> rolPermisoProyectos = new LinkedHashSet<>();

}