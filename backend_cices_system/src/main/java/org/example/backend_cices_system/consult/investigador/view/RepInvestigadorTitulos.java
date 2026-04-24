package org.example.backend_cices_system.consult.investigador.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.time.LocalDate;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "REP_INVESTIGADOR_TITULOS")
public class RepInvestigadorTitulos {
    @Id
    @NotNull
    @Column(name = "ID_TITULO", nullable = false)
    private Integer idTitulo;

    @NotNull
    @Column(name = "ID_INVESTIGADOR", nullable = false)
    private Integer idInvestigador;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_INVESTIGADOR", nullable = false, length = 254)
    private String nombreInvestigador;

    @Size(max = 20)
    @NotNull
    @Column(name = "IDENTIFICACION", nullable = false, length = 20)
    private String identificacion;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_TITULO", nullable = false, length = 254)
    private String nombreTitulo;

    @Size(max = 30)
    @Column(name = "NIVEL_TITULO", length = 30)
    private String nivelTitulo;

    @Size(max = 254)
    @NotNull
    @Column(name = "INSTITUCION", nullable = false, length = 254)
    private String institucion;

    @NotNull
    @Column(name = "FECHA_EMISION", nullable = false)
    private LocalDate fechaEmision;
}