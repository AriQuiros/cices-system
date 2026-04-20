package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "USUARIO")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USUARIO_id_gen")
    @SequenceGenerator(name = "USUARIO_id_gen", sequenceName = "SEC_USUARIO", allocationSize = 1)
    @Column(name = "ID_USUARIO", nullable = false)
    private Integer id;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_USUARIO", nullable = false, length = 50)
    private String nombreUsuario;

    @Size(max = 254)
    @NotNull
    @Column(name = "CONTRASENA", nullable = false, length = 254)
    private String contrasena;

    @NotNull
    @Column(name = "ACTIVO", nullable = false)
    private Boolean activo = false;

}