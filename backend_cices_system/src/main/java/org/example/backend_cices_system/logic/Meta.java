package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "META")
public class Meta {
    @Id
    @Column(name = "ID_META", nullable = false)
    private Short id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_OBJETIVO")
    private ObjetivoEspecifico idObjetivo;

    @Column(name = "ID_CODIGO_TIPO")
    private Short idCodigoTipo;

    @Lob
    @Column(name = "DESCRIPCION")
    private String descripcion;

    @Column(name = "CANTIDAD", precision = 10, scale = 2)
    private BigDecimal cantidad;

    @OneToMany(mappedBy = "idMeta")
    private Set<Indicador> indicadors = new LinkedHashSet<>();

}