package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "META")
public class Meta {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "META_id_gen")
    @SequenceGenerator(name = "META_id_gen", sequenceName = "SEC_META", allocationSize = 1)
    @Column(name = "ID_META", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_OBJETIVO_ESPECIFICO")
    private ObjetivoEspecifico idObjetivoEspecifico;

    @Column(name = "ID_CODIGO_TIPO_META")
    private Short idCodigoTipoMeta;

    @Lob
    @Column(name = "DESCRIPCION")
    private String descripcion;

    @Column(name = "CANTIDAD")
    private Integer cantidad;

}