package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "ROL_USUARIO")
public class RolUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ROL_USUARIO_id_gen")
    @SequenceGenerator(name = "ROL_USUARIO_id_gen", sequenceName = "SEC_ROL_USUARIO", allocationSize = 1)
    @Column(name = "ID_ROL_USUARIO", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario idUsuario;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_ROL", nullable = false)
    private Rol idRol;

}