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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ENTIDAD_id_gen")
    @SequenceGenerator(name = "ENTIDAD_id_gen", sequenceName = "SEC_ENTIDAD", allocationSize = 1)
    @Column(name = "ID_ENTIDAD", nullable = false)
    private Integer id;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE", nullable = false, length = 254)
    private String nombre;

    @Column(name = "ID_CODIGO_TIPO_ENTIDAD")
    private Short idCodigoTipoEntidad;

}