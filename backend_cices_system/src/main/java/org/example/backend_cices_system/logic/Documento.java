package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "DOCUMENTO")
public class Documento {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "DOCUMENTO_id_gen")
    @SequenceGenerator(name = "DOCUMENTO_id_gen", sequenceName = "SEC_DOCUMENTO", allocationSize = 1)
    @Column(name = "ID_DOCUMENTO", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PROYECTO", nullable = false)
    private Proyecto idProyecto;

    @Size(max = 254)
    @NotNull
    @Column(name = "NOMBRE_DOCUMENTO", nullable = false)
    private String nombreDocumento;

    @NotNull
    @Lob
    @Column(name = "DIRECTORIO", nullable = false)
    private String directorio;

}