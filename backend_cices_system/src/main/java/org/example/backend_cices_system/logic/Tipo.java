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
@Table(name = "TIPO")
public class Tipo {
    @NotNull
    @Column(name = "ID_TIPO", nullable = false)
    private Short idTipo;

    @Size(max = 30)
    @NotNull
    @Column(name = "NOMBRE", nullable = false, length = 30)
    private String nombre;

}