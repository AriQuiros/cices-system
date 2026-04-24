package org.example.backend_cices_system.modules.notificacion.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "NOTIFICACION")
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "NOTIFICACION_id_gen")
    @SequenceGenerator(name = "NOTIFICACION_id_gen", sequenceName = "SEC_NOTIFICACION", allocationSize = 1)
    @Column(name = "ID_NOTIFICACION", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "ID_REFERENCIA", nullable = false)
    private Integer idReferencia;

    @Size(max = 100)
    @NotNull
    @Column(name = "CLAVE", nullable = false, length = 100)
    private String clave;

    @NotNull
    @Column(name = "ID_CODIGO_TIPO_CATEGORIA", nullable = false)
    private Short idCodigoTipoCategoria;

    @Size(max = 50)
    @Column(name = "ASUNTO", length = 50)
    private String asunto;

    @Size(max = 254)
    @Column(name = "MENSAJE", length = 254)
    private String mensaje;

    @ColumnDefault("SYSDATE")
    @Column(name = "FECHA_CREACION")
    private LocalDate fechaCreacion;


}