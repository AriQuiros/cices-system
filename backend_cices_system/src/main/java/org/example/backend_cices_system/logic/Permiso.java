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
@Table(name = "PERMISO")
public class Permiso {
    @Id
    @Column(name = "ID_PERMISO", nullable = false)
    private Short id;

    @Size(max = 50)
    @NotNull
    @Column(name = "NOMBRE_PERMISO", nullable = false, length = 50)
    private String nombrePermiso;

    @OneToMany(mappedBy = "idPermiso")
    private Set<RolPermiso> rolPermisos = new LinkedHashSet<>();

}