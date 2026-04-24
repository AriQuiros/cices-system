package org.example.backend_cices_system.modules.proyecto.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "OBJETIVO_ESPECIFICO")
public class ObjetivoEspecifico {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "OBJETIVO_ESPECIFICO_id_gen")
    @SequenceGenerator(name = "OBJETIVO_ESPECIFICO_id_gen", sequenceName = "SEC_OBJETIVO_ESPECIFICO", allocationSize = 1)
    @Column(name = "ID_OBJETIVO_ESPECIFICO", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PROYECTO")
    private Proyecto idProyecto;

    @Lob
    @Column(name = "DESCRIPCION")
    private String descripcion;


}