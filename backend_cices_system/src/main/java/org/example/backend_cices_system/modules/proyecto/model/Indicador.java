package org.example.backend_cices_system.modules.proyecto.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "INDICADOR")
public class Indicador {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "INDICADOR_id_gen")
    @SequenceGenerator(name = "INDICADOR_id_gen", sequenceName = "SEC_INDICADOR", allocationSize = 1)
    @Column(name = "ID_INDICADOR", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_META")
    private Meta idMeta;

    @Lob
    @Column(name = "DESCRIPCION")
    private String descripcion;

}