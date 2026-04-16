package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepInvestigadorProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepInvestigadorProyectoRepository extends JpaRepository<RepInvestigadorProyecto, Integer> {

    List<RepInvestigadorProyecto> findAll();

    List<RepInvestigadorProyecto> findByIdInvestigador(Integer idInvestigador);

    List<RepInvestigadorProyecto> findByIdentificacion(String identificacion);

    List<RepInvestigadorProyecto> findByNombreInvestigadorContainingIgnoreCase(String nombreInvestigador);

    List<RepInvestigadorProyecto> findByCodigoProyecto(String codigoProyecto);

    List<RepInvestigadorProyecto> findByIdProyecto(Integer idProyecto);

    List<RepInvestigadorProyecto> findByNombreProyectoContainingIgnoreCase(String nombreProyecto);

    List<RepInvestigadorProyecto> findByRolProyecto(String rolEnProyecto);

    @Query(value = """
        SELECT
            rip.ID_PROYECTO AS idProyecto,
            rip.CODIGO_PROYECTO AS codigoProyecto,
            rip.NOMBRE_PROYECTO AS nombreProyecto,
            rip.ID_INVESTIGADOR AS idInvestigador,
            rip.IDENTIFICACION AS identificacion,
            rip.NOMBRE_INVESTIGADOR AS nombreInvestigador,
            rip.GRADO_ACADEMICO AS gradoAcademico,
            rip.ROL_PROYECTO AS rolProyecto,
            NVL(SUM(rph.HORAS_MES * rph.CANTIDAD_MESES), 0) AS horasAsignadas,
            rip.FECHA_INICIO_INVESTIGADOR AS fechaInicioParticipacion,
            rip.FECHA_FIN_INVESTIGADOR AS fechaFinParticipacion
        FROM REP_INVESTIGADOR_PROYECTO rip
        INNER JOIN REP_PROYECTO_BASE rpb
            ON rpb.ID_PROYECTO = rip.ID_PROYECTO
        LEFT JOIN REP_PRESUPUESTO_HORAS rph
            ON rph.ID_PROYECTO = rip.ID_PROYECTO
           AND rph.ID_INVESTIGADOR = rip.ID_INVESTIGADOR
        WHERE (:codigoProyecto IS NULL OR LOWER(rip.CODIGO_PROYECTO) LIKE '%' || LOWER(:codigoProyecto) || '%')
          AND (:nombreProyecto IS NULL OR LOWER(rip.NOMBRE_PROYECTO) LIKE '%' || LOWER(:nombreProyecto) || '%')
          AND (:idTipoProyecto IS NULL OR rpb.ID_CODIGO_TIPO_PROYECTO = :idTipoProyecto)
          AND (:idEstadoProyecto IS NULL OR rpb.ID_CODIGO_TIPO_ESTADO = :idEstadoProyecto)
          AND (:lineaInvestigacion IS NULL OR LOWER(rpb.LINEA_INVESTIGACION) LIKE '%' || LOWER(:lineaInvestigacion) || '%')
        GROUP BY
            rip.ID_PROYECTO,
            rip.CODIGO_PROYECTO,
            rip.NOMBRE_PROYECTO,
            rip.ID_INVESTIGADOR,
            rip.IDENTIFICACION,
            rip.NOMBRE_INVESTIGADOR,
            rip.GRADO_ACADEMICO,
            rip.ROL_PROYECTO,
            rip.FECHA_INICIO_INVESTIGADOR,
            rip.FECHA_FIN_INVESTIGADOR
        ORDER BY rip.NOMBRE_PROYECTO, rip.ROL_PROYECTO, rip.NOMBRE_INVESTIGADOR
        """, nativeQuery = true)
    List<Object[]> obtenerReporteInvestigadoresParticipantesFiltrado(
            @Param("codigoProyecto") String codigoProyecto,
            @Param("nombreProyecto") String nombreProyecto,
            @Param("idTipoProyecto") Long idTipoProyecto,
            @Param("idEstadoProyecto") Long idEstadoProyecto,
            @Param("lineaInvestigacion") String lineaInvestigacion
    );

}
