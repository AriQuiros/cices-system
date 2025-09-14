package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "USUARIO")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEC_USUARIO")
    @SequenceGenerator(name = "SEC_USUARIO", sequenceName = "SEC_USUARIO", allocationSize = 1)
    @Column(name = "ID_USUARIO", nullable = false)
    private Short id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_EMPLEADO", nullable = false)
    private Empleado idEmpleado;

    @Size(max = 50)
    @NotNull
    @Column(name = "NOMBRE_USUARIO", nullable = false, length = 50, unique = true)
    private String nombreUsuario;

    @Size(max = 254)
    @NotNull
    @Column(name = "CONTRASENA", nullable = false, length = 254)
    private String contrasena;

    @NotNull
    @Column(name = "ACTIVO", nullable = false)
    private Long activo;


}