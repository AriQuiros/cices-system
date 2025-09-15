package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
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
@Table(name = "OBJETIVO_ESPECIFICO")
public class ObjetivoEspecifico {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEC_OBJETIVO_ESPECIFICO")
    @SequenceGenerator(name = "SEC_OBJETIVO_ESPECIFICO", sequenceName = "SEC_OBJETIVO_ESPECIFICO", allocationSize = 1)
    @Column(name = "ID_OBJETIVO", nullable = false)
    private Short id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PROYECTO")
    private Proyecto idProyecto;

    @Size(max = 100)
    @Column(name = "TIPO", length = 100)
    private String tipo;

    @Lob
    @Column(name = "DESCRIPCION")
    private String descripcion;

    @OneToMany(mappedBy = "idObjetivo")
    private Set<Meta> metas = new LinkedHashSet<>();

}