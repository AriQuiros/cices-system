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
@Table(name = "ROL")
public class Rol {
    @Id
    @Column(name = "ID_ROL", nullable = false)
    private Short id;

    @Size(max = 50)
    @NotNull
    @Column(name = "NOMBRE_ROL", nullable = false, length = 50)
    private String nombreRol;

    @OneToMany(mappedBy = "idRol")
    private Set<RolPermiso> rolPermisos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idRol")
    private Set<RolUsuario> rolUsuarios = new LinkedHashSet<>();

}