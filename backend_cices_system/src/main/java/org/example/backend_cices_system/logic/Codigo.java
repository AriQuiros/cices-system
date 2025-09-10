package org.example.backend_cices_system.logic;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "CODIGO")
public class Codigo {
    @NotNull
    @Column(name = "ID_CODIGO", nullable = false)
    private Short idCodigo;

    @NotNull
    @Column(name = "ID_TIPO", nullable = false)
    private Short idTipo;

    @Size(max = 30)
    @NotNull
    @Column(name = "DESPLIEGUE", nullable = false, length = 30)
    private String despliegue;

    @NotNull
    @Column(name = "TIPO_VALOR", nullable = false)
    private Boolean tipoValor = false;

    @Size(max = 30)
    @NotNull
    @Column(name = "VALOR", nullable = false, length = 30)
    private String valor;

}