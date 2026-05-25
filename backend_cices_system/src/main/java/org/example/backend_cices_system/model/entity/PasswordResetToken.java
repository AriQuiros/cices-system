package org.example.backend_cices_system.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "PASSWORD_RESET_TOKEN")
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PASSWORD_RESET_TOKEN_id_gen")
    @SequenceGenerator(name = "PASSWORD_RESET_TOKEN_id_gen", sequenceName = "SEC_PASSWORD_RESET_TOKEN", allocationSize = 1)
    @Column(name = "ID_PASSWORD_RESET_TOKEN", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario idUsuario;

    @Size(max = 256)
    @NotNull
    @Column(name = "TOKEN_HASH", nullable = false, length = 256)
    private String tokenHash;

    @NotNull
    @Column(name = "FECHA_EXPIRACION", nullable = false)
    private LocalDateTime fechaExpiracion;

    @NotNull
    @Column(name = "USADO", nullable = false)
    private Boolean usado;

    @NotNull
    @Column(name = "FECHA_CREACION", nullable = false)
    private LocalDateTime fechaCreacion;


}