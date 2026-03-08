package org.example.backend_cices_system.report.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "REP_USUARIO_ROL")
public class RepUsuarioRol {
    @Id
    @NotNull
    @Column(name = "ID_ROL_USUARIO", nullable = false)
    private Integer idRolUsuario;

    @NotNull
    @Column(name = "ID_USUARIO", nullable = false)
    private Integer idUsuario;

    @Size(max = 50)
    @NotNull
    @Column(name = "NOMBRE_USUARIO", nullable = false, length = 50)
    private String nombreUsuario;

    @NotNull
    @Column(name = "ACTIVO", nullable = false)
    private Boolean activo = false;

    @NotNull
    @Column(name = "ID_ROL", nullable = false)
    private Integer idRol;

    @Size(max = 50)
    @NotNull
    @Column(name = "NOMBRE_ROL", nullable = false, length = 50)
    private String nombreRol;

}