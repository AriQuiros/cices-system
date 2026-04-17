package org.example.backend_cices_system.report.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.hibernate.annotations.Immutable;

@Getter
@Entity
@Immutable
@Table(name = "REP_PERSONA")
public class RepPersona {
    @Id
    @NotNull
    @Column(name = "ID_EMPLEADO", nullable = false)
    private Integer idEmpleado;

    @Size(max = 20)
    @NotNull
    @Column(name = "IDENTIFICACION", nullable = false, length = 20)
    private String identificacion;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_COMPLETO", nullable = false, length = 254)
    private String nombreCompleto;

    @Size(max = 30)
    @Column(name = "TIPO_IDENTIFICACION", length = 30)
    private String tipoIdentificacion;

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

    @Size(max = 30)
    @Column(name = "GRADO_ACADEMICO", length = 30)
    private String gradoAcademico;

    @Column(name = "ID_INVESTIGADOR")
    private Integer idInvestigador;

    @Size(max = 254)
    @Column(name = "INSTITUCION_ORIGEN", length = 254)
    private String institucionOrigen;

    @Size(max = 254)
    @Column(name = "UNIDAD_ACADEMICA", length = 254)
    private String unidadAcademica;

    @Size(max = 254)
    @Column(name = "TEMA_INTERES", length = 254)
    private String temaInteres;


}