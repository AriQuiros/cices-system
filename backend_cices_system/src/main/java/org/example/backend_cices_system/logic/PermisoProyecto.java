package org.example.backend_cices_system.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "PERMISO_PROYECTO")
public class PermisoProyecto {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PERMISO_PROYECTO_id_gen")
    @SequenceGenerator(name = "PERMISO_PROYECTO_id_gen", sequenceName = "SEC_PERMISO_PROYECTO", allocationSize = 1)
    @Column(name = "ID_PERMISO_PROYECTO", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_INVESTIGADOR_PROYECTO", nullable = false)
    private InvestigadorProyecto idInvestigadorProyecto;

    @NotNull
    @Column(name = "FECHA_INICIO_PERMISO", nullable = false)
    private LocalDate fechaInicioPermiso;

    @Column(name = "FECHA_FIN_PERMISO")
    private LocalDate fechaFinPermiso;


}