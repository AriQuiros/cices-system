package org.example.backend_cices_system.consult.resumenEjecutivo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "REP_RESUMEN_EJECUTIVO")
public class RepResumenEjecutivo {
    @Id
    @Column(name = "TOTAL_USUARIOS")
    private Long totalUsuarios;

    @Column(name = "INVESTIGADORES_REGISTRADOS")
    private Long investigadoresRegistrados;

    @Column(name = "ADMINISTRATIVOS")
    private Long administrativos;

    @Column(name = "ASISTENTES")
    private Long asistentes;

    @Column(name = "DIRECTORES")
    private Long directores;

    @Column(name = "USUARIOS_INACTIVOS")
    private Long usuariosInactivos;

    @Column(name = "INVESTIGADORES_USUARIO_INACTIVO")
    private Long investigadoresUsuarioInactivo;

    @Column(name = "TOTAL_PROYECTOS")
    private Long totalProyectos;

    @Column(name = "PROYECTOS_ACTIVOS")
    private Long proyectosActivos;

    @Column(name = "PROYECTOS_INACTIVOS")
    private Long proyectosInactivos;

    @Column(name = "CERTIFICACIONES_VENCIDAS")
    private Long certificacionesVencidas;

    @Column(name = "CERTIFICACIONES_POR_VENCER")
    private Long certificacionesPorVencer;

    @Column(name = "CERTIFICACIONES_VIGENTES")
    private Long certificacionesVigentes;

}