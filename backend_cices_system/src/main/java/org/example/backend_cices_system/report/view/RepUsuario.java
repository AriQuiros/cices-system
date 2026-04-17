package org.example.backend_cices_system.report.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.hibernate.annotations.Immutable;

@Getter
@Entity
@Immutable
@Table(name = "REP_USUARIO")
public class RepUsuario {
    @Id
    @NotNull
    @Column(name = "ID_USUARIO", nullable = false)
    private Integer idUsuario;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_USUARIO", nullable = false, length = 254)
    private String nombreUsuario;

    @NotNull
    @Column(name = "ACTIVO", nullable = false)
    private Boolean activo;

    @NotNull
    @Column(name = "ID_EMPLEADO", nullable = false)
    private Integer idEmpleado;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_COMPLETO", nullable = false, length = 254)
    private String nombreCompleto;

    @Column(name = "ID_ROL")
    private Short idRol;

    @Size(max = 50)
    @Column(name = "NOMBRE_ROL", length = 50)
    private String nombreRol;


}