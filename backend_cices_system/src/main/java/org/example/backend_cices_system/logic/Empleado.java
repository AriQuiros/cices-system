package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "EMPLEADO")
public class Empleado {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "empleado_seq")
    @SequenceGenerator(name = "empleado_seq", sequenceName = "SEC_EMPLEADO", allocationSize = 1)
    @Column(name = "ID_EMPLEADO", nullable = false)
    private Short id;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_COMPLETO", nullable = false, length = 254)
    private String nombreCompleto;

    @Size(max = 50)
    @NotNull
    @Column(name = "NACIONALIDAD", nullable = false, length = 50)
    private String nacionalidad;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_ID", nullable = false)
    private Short idCodigoTipoId;

    @Size(max = 20)
    @NotNull
    @Column(name = "IDENTIFICACION", nullable = false, length = 20)
    private String identificacion;

    @Size(max = 254)
    @NotNull
    @Column(name = "CORREO", nullable = false, length = 254)
    private String correo;

    @Size(max = 15)
    @NotNull
    @Column(name = "NUMERO_TELEFONO", nullable = false, length = 10)
    private String numeroTelefono;

}