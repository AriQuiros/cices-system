package org.example.backend_cices_system.logic;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

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

    @NotNull
    @Column(name = "FECHA_EXPIRA_PERMISO", nullable = false)
    private LocalDate fechaExpiracionPermiso;
}