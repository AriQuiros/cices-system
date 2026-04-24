package org.example.backend_cices_system.modules.investigadorProyecto.model;

import jakarta.persistence.*;
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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ROL_PROYECTO_id_gen")
    @SequenceGenerator(name = "ROL_PROYECTO_id_gen", sequenceName = "SEC_ROL_PROYECTO", allocationSize = 1)
    @Column(name = "ID_ROL_PROYECTO", nullable = false)
    private Short id;

    @Size(max = 50)
    @NotNull
    @Column(name = "NOMBRE_ROL_PROYECTO", nullable = false, length = 50)
    private String nombreRolProyecto;


}