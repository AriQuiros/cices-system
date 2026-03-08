package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "NOTIFICACION_USUARIO")
public class NotificacionUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "NOTIFICACION_USUARIO_id_gen")
    @SequenceGenerator(name = "NOTIFICACION_USUARIO_id_gen", sequenceName = "SEC_NOTIFICACION_USUARIO", allocationSize = 1)
    @Column(name = "ID_NOTIFICACION_USUARIO", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_NOTIFICACION", nullable = false)
    private Notificacion idNotificacion;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario idUsuario;

    @ColumnDefault("0")
    @Column(name = "LEIDO")
    private Boolean leido;

    @ColumnDefault("0")
    @Column(name = "ELIMINADO")
    private Boolean eliminado;

    @Column(name = "FECHA_LEIDO")
    private LocalDate fechaLeido;

}