package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "EMPLEADO")
public class Empleado {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "EMPLEADO_id_gen")
    @SequenceGenerator(name = "EMPLEADO_id_gen", sequenceName = "SEC_EMPLEADO", allocationSize = 1)
    @Column(name = "ID_EMPLEADO", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario idUsuario;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_COMPLETO", nullable = false, length = 254)
    private String nombreCompleto;

    @Size(max = 20)
    @NotNull
    @Column(name = "IDENTIFICACION", nullable = false, length = 20)
    private String identificacion;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_ID", nullable = false)
    private Short idCodigoTipoId;

    @Size(max = 4)
    @NotNull
    @Column(name = "PAIS", nullable = false, length = 4)
    private String pais;

    @Size(max = 254)
    @NotNull
    @Column(name = "CORREO", nullable = false, length = 254)
    private String correo;

    @Size(max = 15)
    @Column(name = "NUMERO_TELEFONO", length = 15)
    private String numeroTelefono;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_GRADO_ACADEMICO", nullable = false)
    private Short idCodigoTipoGradoAcademico;

}