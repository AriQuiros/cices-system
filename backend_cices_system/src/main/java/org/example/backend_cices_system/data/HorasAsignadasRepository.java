package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.HorasAsignada;
import org.example.backend_cices_system.logic.InvestigadorProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HorasAsignadasRepository extends JpaRepository<HorasAsignada, Integer> {
    List<HorasAsignada> findByIdInvestigadorProyecto_IdProyecto_Id(Short proyectoId);
    void deleteByIdInvestigadorProyecto(InvestigadorProyecto ip);
    List<HorasAsignada> findByIdInvestigadorProyecto(InvestigadorProyecto ip);

    boolean existsByIdInvestigadorProyecto_Id(Integer idInvestigadorProyectoId);

    @Query(value = """
    SELECT
        i.ID_INVESTIGADOR,
        e.NOMBRE_COMPLETO,
        c.DESPLIEGUE,
        ha.CANTIDAD_HORAS_MES,
        ha.CANTIDAD_MESES
    FROM HORAS_ASIGNADAS ha
    JOIN INVESTIGADOR_PROYECTO ip
        ON ip.ID_INVESTIGADOR_PROYECTO = ha.ID_INVESTIGADOR_PROYECTO
    JOIN INVESTIGADOR i
        ON i.ID_INVESTIGADOR = ip.ID_INVESTIGADOR
    JOIN EMPLEADO e
        ON e.ID_EMPLEADO = i.ID_EMPLEADO
    JOIN CODIGO c
        ON c.ID_CODIGO = ha.ID_CODIGO_TIPO_MODALIDAD
    WHERE ip.ID_PROYECTO = :id
""", nativeQuery = true)
    List<Object[]> obtenerHorasAsignadasProyecto(Integer id);

    @Query(value = """
    SELECT NVL(SUM(ha.CANTIDAD_HORAS_MES * ha.CANTIDAD_MESES),0)
    FROM HORAS_ASIGNADAS ha
    JOIN INVESTIGADOR_PROYECTO ip
        ON ip.ID_INVESTIGADOR_PROYECTO = ha.ID_INVESTIGADOR_PROYECTO
    WHERE ip.ID_PROYECTO = :id
""", nativeQuery = true)
    Double totalHorasAsignadas(Integer id);

    @Query(value = """
    SELECT NVL(SUM(p.CANTIDAD_HORAS_MES * p.CANTIDAD_MESES),0)
    FROM PRESUPUESTO p
    WHERE p.ID_PROYECTO = :id
""", nativeQuery = true)
    Double totalHorasPresupuestadas(Integer id);
}
