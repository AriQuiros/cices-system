package org.example.backend_cices_system.data;

import org.example.backend_cices_system.dto.ProyectoDTO;
import org.example.backend_cices_system.dto.ProyectoMiniDTO;
import org.example.backend_cices_system.dto.ProyectoResumenDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface ProyectoRepository extends JpaRepository<Proyecto, Short> {
    Optional<Proyecto> findByCodigoProyecto(String codigoProyecto);
    List<Proyecto> findByIdCodigoEstado(Short idCodigoEstado);
    Proyecto findProyectoById(Short id);
    @Query("""
    select new org.example.backend_cices_system.dto.ProyectoMiniDTO(
      p.id, p.codigoProyecto, p.nombreProyecto)
    from Proyecto p
    where (:q is null or trim(:q) = '')
       or upper(p.codigoProyecto) like upper(concat(:q, '%'))
       or upper(p.nombreProyecto) like upper(concat('%', :q, '%'))
    order by p.codigoProyecto
  """)
    List<ProyectoMiniDTO> suggest(@Param("q") String q, org.springframework.data.domain.Pageable pg);

    @Query("""
       select new org.example.backend_cices_system.dto.ProyectoResumenDTO(
         p.id,
         p.codigoProyecto,
         p.nombreProyecto,
         '' ,
         p.lineaInvestigacion,
         p.fechaInicio,
         p.fechaFinalizacion,
         0,    
         0,  
         0    
       )
       from Proyecto p
       where upper(p.codigoProyecto) = upper(:q)
          or upper(p.codigoProyecto) like upper(concat(:q,'%'))
       order by case when upper(p.codigoProyecto) = upper(:q) then 0 else 1 end, p.codigoProyecto
    """)
    List<ProyectoResumenDTO> buscarResumen(@Param("q") String q, org.springframework.data.domain.Pageable pg);


    @Query(value = """
        SELECT 
            i.ID_INVESTIGADOR AS id,
            e.NOMBRE_COMPLETO AS nombre,
            rp.NOMBRE_PERMISO AS rol,
            ip.FECHA_INICIO AS ini,
            ip.FECHA_FIN AS fin,
            ip.HORAS_MES AS horas,
            'Vigente' AS estado
        FROM INVESTIGADOR_PROYECTO ip
        JOIN INVESTIGADOR i ON i.ID_INVESTIGADOR = ip.ID_INVESTIGADOR
        JOIN EMPLEADO e ON e.ID_EMPLEADO = i.ID_EMPLEADO
        JOIN ROL_PROYECTO rp ON rp.ID_ROL_PROYECTO = ip.ID_ROL_PROYECTO
        WHERE ip.ID_PROYECTO = :id
          AND (:q IS NULL 
               OR UPPER(e.NOMBRE_COMPLETO) LIKE UPPER(CONCAT('%', :q, '%'))
               OR UPPER(rp.NOMBRE_PERMISO) LIKE UPPER(CONCAT('%', :q, '%')))
        ORDER BY e.NOMBRE_COMPLETO
        """, nativeQuery = true)
    List<Object[]> listarAsignados(@Param("id") Short idProyecto, @Param("q") String q);


    interface AsignadoRow {
        Short getId();
        String getNombre();
        String getRol();
        LocalDate getIni();
        LocalDate getFin();
        BigDecimal getHoras();
        String getEstado();
    }

    @Query(value = """
      SELECT
        ip.ID_INVESTIGADOR          AS id,
        e.NOMBRE_COMPLETO           AS nombre,
        rp.NOMBRE_PERMISO           AS rol,
        p.FECHA_INICIO              AS ini,
        p.FECHA_FINALIZACION        AS fin,
        NVL(SUM(ha.CANTIDAD_HORAS_MES * ha.CANTIDAD_MESES),0) AS horas,
        'VIGENTE'                   AS estado
      FROM INVESTIGADOR_PROYECTO ip
      JOIN INVESTIGADOR i   ON i.ID_INVESTIGADOR = ip.ID_INVESTIGADOR
      JOIN EMPLEADO e       ON e.ID_EMPLEADO     = i.ID_EMPLEADO
      JOIN ROL_PROYECTO rp  ON rp.ID_ROL_PROYECTO= ip.ID_ROL_PROYECTO
      JOIN PROYECTO p       ON p.ID_PROYECTO     = ip.ID_PROYECTO
      LEFT JOIN HORAS_ASIGNADAS ha ON ha.ID_INVESTIGADOR_PROYECTO = ip.ID_INVESTIGADOR_PROYECTO
      WHERE ip.ID_PROYECTO = :proyectoId
        AND (
              :q IS NULL OR :q = '' OR
              UPPER(e.NOMBRE_COMPLETO) LIKE UPPER(:q||'%') OR
              UPPER(rp.NOMBRE_PERMISO) LIKE UPPER(:q||'%')
            )
      GROUP BY ip.ID_INVESTIGADOR, e.NOMBRE_COMPLETO, rp.NOMBRE_PERMISO, p.FECHA_INICIO, p.FECHA_FINALIZACION
      ORDER BY e.NOMBRE_COMPLETO
    """, nativeQuery = true)

    List<AsignadoRow> asignados(@Param("proyectoId") int proyectoId,
                                @Param("q") String q);
}
