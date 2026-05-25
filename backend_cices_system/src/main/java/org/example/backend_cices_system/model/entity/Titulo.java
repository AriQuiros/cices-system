package org.example.backend_cices_system.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "TITULO")
public class Titulo {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "TITULO_id_gen")
    @SequenceGenerator(name = "TITULO_id_gen", sequenceName = "SEC_TITULO", allocationSize = 1)
    @Column(name = "ID_TITULO", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_INVESTIGADOR", nullable = false)
    private Investigador idInvestigador;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_ENTIDAD", nullable = false)
    private Entidad idEntidad;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_TITULO", nullable = false, length = 254)
    private String nombreTitulo;

    @Column(name = "ID_CODIGO_TIPO_NIVEL_TITULO")
    private Short idCodigoTipoNivelTitulo;

    @NotNull
    @Column(name = "FECHA_EMISION", nullable = false)
    private LocalDate fechaEmision;

}