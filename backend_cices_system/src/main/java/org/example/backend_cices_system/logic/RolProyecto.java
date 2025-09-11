package org.example.backend_cices_system.logic;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

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

}