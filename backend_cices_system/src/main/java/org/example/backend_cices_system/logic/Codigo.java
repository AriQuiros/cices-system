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
@Table(name = "CODIGO")
public class Codigo {
    @Id
    @SequenceGenerator(name = "CODIGO_id_gen", sequenceName = "SEC_CODIGO", allocationSize = 1)
    @Column(name = "ID_CODIGO", nullable = false)
    private Short id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_TIPO", nullable = false)
    private Tipo idTipo;

    @Size(max = 30)
    @NotNull
    @Column(name = "DESPLIEGUE", nullable = false, length = 30)
    private String despliegue;

    @NotNull
    @Column(name = "TIPO_VALOR", nullable = false)
    private Character tipoValor;

    @Size(max = 30)
    @NotNull
    @Column(name = "VALOR", nullable = false, length = 30)
    private String valor;

}