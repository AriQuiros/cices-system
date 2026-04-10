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

import java.time.LocalDate;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "REP_NOTIFICACIONES_USUARIO")
public class RepNotificacionesUsuario {
    @Id
    @NotNull
    @Column(name = "ID_NOTIFICACION_USUARIO", nullable = false)
    private Integer idNotificacionUsuario;

    @NotNull
    @Column(name = "ID_USUARIO", nullable = false)
    private Integer idUsuario;

    @Size(max = 50)
    @NotNull
    @Column(name = "NOMBRE_USUARIO", nullable = false, length = 50)
    private String nombreUsuario;

    @NotNull
    @Column(name = "ID_NOTIFICACION", nullable = false)
    private Integer idNotificacion;

    @Size(max = 50)
    @Column(name = "ASUNTO", length = 50)
    private String asunto;

    @Size(max = 254)
    @Column(name = "MENSAJE", length = 254)
    private String mensaje;

    @Size(max = 30)
    @Column(name = "CATEGORIA", length = 30)
    private String categoria;

    @Column(name = "LEIDO")
    private Boolean leido;

    @Column(name = "ELIMINADO")
    private Boolean eliminado;

    @Column(name = "FECHA_CREACION")
    private LocalDate fechaCreacion;

    @Column(name = "FECHA_LEIDO")
    private LocalDate fechaLeido;

}