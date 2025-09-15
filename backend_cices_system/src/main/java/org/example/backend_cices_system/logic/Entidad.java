package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ENTIDAD")
public class Entidad {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEC_ENTIDAD")
    @SequenceGenerator(name = "SEC_ENTIDAD", sequenceName = "SEC_ENTIDAD", allocationSize = 1)
    @Column(name = "ID_ENTIDAD", nullable = false)
    private Short id;

    @Size(max = 50)
    @NotNull
    @Column(name = "NOMBRE", nullable = false, length = 50)
    private String nombre;

    @Column(name = "ID_CODIGO_TIPO_")
    private Short idCodigoTipo;

}