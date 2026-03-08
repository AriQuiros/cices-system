package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "TIPO")
public class Tipo {
    @Id
    @SequenceGenerator(name = "TIPO_id_gen", sequenceName = "SEC_TIPO", allocationSize = 1)
    @Column(name = "ID_TIPO", nullable = false)
    private Short id;

    @Size(max = 30)
    @NotNull
    @Column(name = "NOMBRE", nullable = false, length = 30)
    private String nombre;

}