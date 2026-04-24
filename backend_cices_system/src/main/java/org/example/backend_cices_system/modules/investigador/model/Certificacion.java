package org.example.backend_cices_system.modules.investigador.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.example.backend_cices_system.shared.entidad.Entidad;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "CERTIFICACION")
public class Certificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "CERTIFICACION_id_gen")
    @SequenceGenerator(name = "CERTIFICACION_id_gen", sequenceName = "SEC_CERTIFICACION", allocationSize = 1)
    @Column(name = "ID_CERTIFICACION", nullable = false)
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
    @Column(name = "NOMBRE_CERTIFICACION", nullable = false, length = 254)
    private String nombreCertificacion;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_CERTIFICACION", nullable = false)
    private Short idCodigoTipoCertificacion;

    @Column(name = "FECHA_EXPIRACION")
    private LocalDate fechaExpiracion;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_ESTADO", nullable = false)
    private Short idCodigoTipoEstado;

}