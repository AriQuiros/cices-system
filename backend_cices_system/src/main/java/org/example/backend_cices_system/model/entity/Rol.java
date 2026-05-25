package org.example.backend_cices_system.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ROL")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ROL_id_gen")
    @SequenceGenerator(name = "ROL_id_gen", sequenceName = "SEC_ROL", allocationSize = 1)
    @Column(name = "ID_ROL", nullable = false)
    private Short id;

    @Size(max = 50)
    @NotNull
    @Column(name = "NOMBRE_ROL", nullable = false, length = 50)
    private String nombreRol;

}